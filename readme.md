# Gulp Metalsmith Static Site Generator

## Features

- Partials
- Layouts
- Concatenate CSS and JS
- Minify CSS and JS (production)
- Fingerprinting (production)
- Development server
- Hot reloading

## Usage

There are three scripts: clean, start and build

### Clean

```
npm run clean
```

This deletes the `/dev` and `/prod` folders.

## Start

```
npm start
```

Files from the `/src` folder are processed and put in the `/dev` folder. Pages are built from the templates and CSS and JS are concatenated. A hot reloading development server is started from the `/dev` folder. when a file in `/src` changes the `/dev` folder is rebuilt.

### Build

```
npm run build
```

Minifies CSS and JS and fingerprints the HTML files. This is stored in `/prod `ready for deployment.

## Templates

The template engine is Handlebars. There are two types of templates: layouts and partials. Layouts contain general page layouts. They are populated with partials and individual page content. Partials look like this `{{> header }}`. The `{{{ contents }}}` in a layout is replaced by page contents. Layouts are in `/layouts`. Partials are in `/partials`. Pages are in `/pages`.

## Pages

Pages along with HTML can contain variables in front matter between `---`. Here you can specify a page title, description, etc. along with the layout to be used. Variables inside of `{{}}` are replaced by their contents. E.g. `<title>{{ title }}</title>`.
