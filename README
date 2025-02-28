# WebCat
_WebCat © Nathcat 2025_

## Contents

- [WebCat](#webcat)
  - [Contents](#contents)
- [What is WebCat](#what-is-webcat)
- [Configuration file syntax](#configuration-file-syntax)
- [Pre-processing](#pre-processing)
  - [TypeScript](#typescript)
  - [Template elements](#template-elements)

# What is WebCat

WebCat is a web application framework built by [Nathcat](https://nathcat.net) as part of the [NathCat Network](https://nathcat.net/network). It features a simple pre-processor which allows for a templating system, and a method for linking compiled TypeScript files to HTML files.


# Configuration file syntax
The configuration file should be placed placed at the project root, `/WebCat.conf.json`, and contain the following options:

- `preProcessor` Options for the pre-processor, _must_ be included.
  - `appPath` The path to your web app. This is the folder which should contain the code / HTML scripts for your web app. Should _not_ have a trailing `/`, _must_ be included.
  - `outDir` The directory which should contain all of the processed HTML files, should be the same as your `tsconfig.json` `outDir`. Should _not_ have a trailing `/`, _must_ be included.
- `server` Options for the web server. _Must_ be included
  - `hostname` The server hostname, generally either `"localhost"`, or `"0.0.0.0"`. _Must_ be included.
  - `port` The port the server should accept connections on. _Must_ be included.
  - `errorPages` Allows you to specify custom error pages. _Optional_.
    - Each record should be named after the error, with it's value being the path from your app root at which the custom file is located. For example, if we had a 404 page at errors/error404.html from our `appPath`, we would have `"404": "errors/error404.html"`


# Pre-processing

## TypeScript

WebCat allows you to easily include compiled TypeScript files into your HTML pages.

Scripts which you want to be included in your pages should be written as TypeScript files inside a `scripts` directory in your `appPath`. To link these scripts in your HTML pages you can then use a custom HTML element:

```html
<webcat src="myScriptName" />
```

Note that _no_ file extension should be included in the script name. For example, a TypeScript file `scripts/index_test-button.ts` can be linked to a HTML file with

```html
<webcat src="index_test-button" />
```

## Template elements

WebCat also allows you to create HTML templates which can be included in your HTML files. Templates should be placed under the `templates` folder in your `appPath`. Note that the template files must outwardly appear as a _single HTML element_, for example:

```html
<h1>Hello world</h1>
```

Is a valid template.

```html
<h1>Hello world</h1>
<p>Hey there!</p>
```

Is not a valid template. To make it a valid template, we might do something like this:

```html
<div>
    <h1>Hello world</h1>
    <p>Hey there!</p>
</div>
```

To use a template in a HTML file, consider this example. Suppose we have a template in a HTML file at `templates/MyTemplate.html`. We may then use this template in other HTML files using the following element:

```html
<MyTemplate />
```