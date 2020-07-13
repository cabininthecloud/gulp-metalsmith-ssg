const { src, dest, series, parallel, watch } = require("gulp");
const del = require("del");
const concat = require("gulp-concat");
const minify = require("gulp-minify");
const eslint = require("gulp-eslint");
const cleanCSS = require("gulp-clean-css");
const rev = require("gulp-rev");
const fingerprint = require("gulp-fingerprint");

const metalsmith = require("metalsmith");
const layouts = require("metalsmith-layouts");
const partials = require("metalsmith-discover-partials");

const server = require("browser-sync").create();

function cleanDev() {
  return del(["dev/**/*"]);
}

function cleanProd() {
  return del(["prod/**/*"]);
}

function buildHTML(done) {
  metalsmith(__dirname)
    .clean(false)
    .source("./src/pages/")
    .destination("./dev/")
    .use(partials({ directory: "./src/partials/" }))
    .use(layouts({ directory: "./src/layouts/" }))
    .build(function build(err) {
      if (err) throw err;
    });
  done();
}

function concatJS() {
  return src(["./src/js/*.js"], { sourcemaps: true })
    .pipe(concat("scripts.js"))
    .pipe(eslint())
    .pipe(dest("./dev/js"))
    .pipe(eslint.failAfterError());
}

function concatCSS() {
  return src(["./src/css/*.css"])
    .pipe(concat("styles.css"))
    .pipe(dest("./dev/css"));
}

function devCopy() {
  return src(["./src/img/*"]).pipe(dest("./dev/img"));
}

function prodCopy() {
  return src(["./src/img/*"]).pipe(dest("./dev/img"));
}

function minJS() {
  return src(["./dev/js/*.js"], { base: "./dev/" })
    .pipe(
      minify({
        ext: {
          min: ".js",
        },
        noSource: true,
      })
    )
    .pipe(rev())
    .pipe(dest("./prod/"))
    .pipe(
      rev.manifest("./dev/rev-manifest.json", { base: "./dev/", merge: true })
    )
    .pipe(dest("./dev/"));
}

function minCSS() {
  return src(["./dev/css/*.css"], { base: "./dev/" })
    .pipe(cleanCSS())
    .pipe(rev())
    .pipe(dest("./prod/"))
    .pipe(
      rev.manifest("./dev/rev-manifest.json", { base: "./dev/", merge: true })
    )
    .pipe(dest("./dev/"));
}

function fingerprintHTML() {
  return src(["./dev/*.html"])
    .pipe(fingerprint("./dev/rev-manifest.json"))
    .pipe(dest("./prod/"));
}

function serve(done) {
  server.init({
    server: {
      baseDir: "./dev",
    },
  });
  done();
}

function reload(done) {
  server.reload();
  done();
}

const watcher = () =>
  watch(
    ["./src/*.html", "./src/js/*.js", "./src/css/*.css"],
    series(cleanDev, parallel(buildHTML, concatJS, concatCSS, devCopy), reload)
  );

exports.clean = parallel(cleanDev, cleanProd);
exports.dev = series(
  cleanDev,
  parallel(buildHTML, concatJS, concatCSS, devCopy),
  serve,
  watcher
);
exports.build = series(cleanProd, minJS, minCSS, fingerprintHTML, prodCopy);
