# Mobius web

[![Code Climate](https://codeclimate.com/repos/55a13cd2e30ba0458a00384f/badges/fda5b4afe8ad006ed0fe/gpa.svg)](https://codeclimate.com/repos/55a13cd2e30ba0458a00384f/feed)
[![Circle CI](https://circleci.com/gh/2PVentures/mobius-web/tree/master.svg?style=shield&circle-token=c747f87a995b02c9d999cee050e74265a98745e4)](https://circleci.com/gh/2PVentures/mobius-web/tree/master)
[![Test Coverage](https://codeclimate.com/repos/55a13cd2e30ba0458a00384f/badges/fda5b4afe8ad006ed0fe/coverage.svg)](https://codeclimate.com/repos/55a13cd2e30ba0458a00384f/coverage)

Front end application for mobius booking engine

## FAQ

### How do I run it locally

1. Install node.js
1. `npm install -g grunt-cli bower karma phantomjs@1.9.8`
1. `git clone https://github.com/2PVentures/mobius-web.git`
1. `cd mobius-web`:
1. Install dependencies `npm i && bower install --allow-root`
1. Build and watch files `npm run watch.sandman`
1. Run the middleware `npm run server.sandman`
1. Finally, open `localhost:9000` in your browser

### How do I deploy to a live environment

1. Change to root `sudo su -`
1. Follow installation steps 1-4 described above.
1. Run `npm run build.sandman-live` (replace sandman and live with correct tenant and env)
    1. For Keystone enabled tenants it is imperative that you are including the correct Keystone `status` script in the index.html. All environments are included - and all but integration have a suffix to the tenant name in the script path such as `https://scripts.infiniti.io/sandman-staging/status.js`. Note, _non_-Keystone-enabled tenants do NOT need this script.
1. Run `pm2 restart WEB` (If pm2 says there is no instance of WEB running do `NODE_ENV=production pm2 start server.js --name "WEB" -- --tenant=sandman --environment=live --port=900*` where the port number is as dicated in [this document](https://docs.google.com/document/d/1rVjFPY9p3MIj5ubjXt5kFhqGFwNCSzyrfEN1IkYhf_A))
1. Clear cloudflare cache visit `https://webservice.mobiuswebservices.com/cloudflare/clearcache?site=mobiusbookingengine`

#### Trouble shooting

If you deploy the app and get an index_US cannot be found, or something
similiar, then something has gone wrong with the build process. Re build
the application and try again. Failing that, ensure that the locales in the
config file are valid and match the values of the build folder names.

### The Build System

The best way to learn about the build system is by familiarizing yourself with
Grunt and then reading through the build script,
`Gruntfile.js`.

All configs used by the Gruntfile can be found in build.config.js

The driver of the process is the `watch` multi-task, which watches for file
changes using `grunt-contrib-watch` and executes one of many tasks when a file
changes:

* `watch:styles` - When any `*.less` file within `src/styles` changes, the
  `src/less/main.less` file is linted and copied into
  `build/styles/main.css`.
* `watch:scripts` - When any JavaScript file within `src/` that does not end in
  `.spec.js` changes, all JavaScript sources are linted, all unit tests are run, and the all source files are re-copied to `build/app`.
* `watch:markup` - When any `*.html` file within `src/` changes, all templates are put into strings in a JavaScript file that will add the template to AngularJS's [`$templateCache`](http://docs.angularjs.org/api/ng.$templateCache) so template files are part of the initial JavaScript payload and do not require any future XHR.  The template cache files are  `build/app/mobius-templates-*_*.js`.
* `watch:jsunit` - When any `*.spec.js` file in `src/` changes, the test files are linted and the unit tests are executed.

Most of this is very standard with the exception of 2 things:

* localisation task - This is a custom localisation grunt task. It just uses
   regex to match any text that is suffixed and prefixed with a _. For example
   _title_. It then replaces this with the text in the locale json using the text
   as a key. The locale is compiled X number of times, where X is each language
   in the tenant's locale directory
* index task - This is a simple task that runs through the index file and
   places some information about the environment and app it is building, such
   as environment=production, tenant=sandman etc. These meta fields are then
   read by a service so that you can lookup which settings to use when env
   specific settings are provided.

### Live Reload

Build system also includes [Live Reload](http://livereload.com/), so you no
longer have to refresh your page after making changes! You need a Live Reload
browser plugin for this:

* Chrome - [Chrome Webstore](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
* Firefox - [Download from Live Reload](http://download.livereload.com/2.0.8/LiveReload-2.0.8.xpi)
* Safari - [Download from Live Reload](http://download.livereload.com/2.0.9/LiveReload-2.0.9.safariextz)
* Internet Explorer - Surely you jest.

When you load your page, click the Live Reload icon in your toolbar and
everything should work.

## Configuration

All settings can be categorised into the following categories:

* Front-end
* Server
* Build system

### `Settings.js` - main configuration file which contais customer related settings

Main sections are:

* `API` - backend endpoints and their URL's. Make sure google analytics settings are turned off until the client codes are confirmed, this is especially true when creating a new target from an existing one.
* `heroSlider` - slider related settings such as animation duration, autoplay delay, autopreload etc.
* `menu` - visibility settings for  main menu items in application header. Some of the settings can be overridden by the server.
* `languages` - list of available languages.  This section is used to provide additional language data such as short name which is missing on the server.
* `currencies` - list of currencies and their display symbols.
* `bookingWidget` - settings related to a booking widget such as number of adults, children etc.
* `layout` - layout related settings, page content, order of the components. Application supports dynamic positioning of the widgets on the page which allows to change the layout without making direct changes to the application templates(.html files). Each page is presented by using corresponding state name like `index.home`  [Read more](https://github.com/angular-ui/ui-router) and a list of nested components. Children will be appended in the same order as they are specifyed in the config. Each component has a corresponding template. List of all supported widgets and their HTML templates is specified under `templates` section.

### Styles

All styles are located in `src/styles` folder in [less](http://lesscss.org/) or `css` format. Each component has a corresponding `less` file which is located in`styles/partials` forlder. During the build everything is imported into a single CSS file as long as sources are imported via `main.less` file using `@import` statement. Colors, dimensions, transitions, typography settings are located in `styles/config.less`. Platform related media queries are specifyed at the bottom of each `less` files but in some complex cases can be found elsewhere within the file by using this tag `@media`.

### Server

* `config/environments`
* `routes/config.js`

## prerender.io

As mobius-web is an angular application, we rely on prerender.io to index pages for search engines. This is implemented through a combination of:

* `meta name="prerender-status-code" content="{{prerenderStatusCode}}"` in the head of the page - /src/app/index.html
* `require('prerender-node').set('prerenderToken', 'i5yOvEEIyhpbWHoBfeG2')` in the node layer - /server.js

If you want to see how your page looks to the prerender crawler, try this - [http://service.prerender.io/your-url-here/](http://service.prerender.io/your-url-here)
