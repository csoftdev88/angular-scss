# mobius

[![Code Climate](https://codeclimate.com/repos/55a13cd2e30ba0458a00384f/badges/fda5b4afe8ad006ed0fe/gpa.svg)](https://codeclimate.com/repos/55a13cd2e30ba0458a00384f/feed)
[![Circle CI](https://circleci.com/gh/2PVentures/mobius-web/tree/master.svg?style=shield&circle-token=c747f87a995b02c9d999cee050e74265a98745e4)](https://circleci.com/gh/2PVentures/mobius-web/tree/master)
[![Test Coverage](https://codeclimate.com/repos/55a13cd2e30ba0458a00384f/badges/fda5b4afe8ad006ed0fe/coverage.svg)](https://codeclimate.com/repos/55a13cd2e30ba0458a00384f/coverage)

Rewrite of existing hotel booking engine into angular.js SPA..

## Overall Directory Structure

At a high level, the structure looks roughly like this:

```
mobius/
  |- src/
  |  |- app/
  |  |  |- <app logic>
  |  |  |- directives/
  |  |  |  |- <reusable controls>
  |  |  |- filters/
  |  |  |  |- <reusable components>
  |  |  |- layouts/
  |  |  |  |- <application templates>
  |  |  |- services/
  |  |  |  |- <reusable components>
  |  |  |- app.js
  |  |  |- settings.js
  |  |  |- index.html
  |  |- font/
  |  |  |- <core static files>
  |  |- images/
  |  |  |- <core icons, logos>
  |  |- locales/
  |  |  |- en_US.json
  |  |- styles/
  |  |  |- <core less files>
  |  |-targets
  |  |  |-suttonLive
  |  |  |  |- <target specific files>
  |- bower_components/
  |- node_modules/
  |- karma/
  |- tests/
  |  |- ...
  |- .bowerrc
  |- bower.json
  |- build.config.js
  |- Gruntfile.js
  |- package.json
```

What follows is a brief description of each entry, but most directories contain
their own `README.md` file with additional documentation, so browse around to
learn more:

- `src/` - our application sources. [Read more &raquo;](src/README.md)
- `bower_components/` - third-party libraries used in front-end. [Bower](http://bower.io) will install
  packages here. Anything added to this directory will need to be manually added
  to `build.config.js` and `karma/karma-unit.js` to be picked up by the build
  system.
- `node_modules/` - third-party libraries used in build system. [NodeJS](http://nodejs.org/) will install
  packages here.
- `karma/` - test configuration.
- `.bowerrc` - the Bower configuration file. This tells Bower to install
  components into the `vendor/` directory.
- `bower.json` - this is our project configuration for Bower and it contains the
  list of Bower dependencies we need.
- `build.config.js` - our customizable build settings; see "The Build System"
  below.
- `Gruntfile.js` - our build script; see "The Build System" below.
- `package.json` - metadata about the app, used by NPM and our build script. Our
  NPM dependencies are listed here.

## FAQ

### How do I run it locally?

1. Install node.js
2. `npm install -g grunt-cli bower karma phantomjs@1.9.8`
3. `git clone https://github.com/2PVentures/mobius-web.git`
4. `cd mobius-web`:
  * `npm install`
  * `bower install`
  * `grunt build --tenant=suttonLive --environment=development` to build the app using "sutton" as target.
  * Run server `NODE_ENV=development node server.js --tenant=suttonLive --environment=development`
  * Finally, open `localhost:9000` in your browser

### Local development
1. Follow installation steps 1-3 described above.
2. Run `grunt development --tenant=suttonLive --environment=development` to build the app using "sutton" as target.
3. Run server `NODE_ENV=development node server.js --tenant=suttonLive --environment=development`.

### Production
1. Follow instalation steps 1-4 described above.
2. Run `grunt production --tenant=suttonLive --environment=live` to build the app using "sutton" as target.
3. Run `NODE_ENV=production node server.js --tenant=suttonLive --environment=live`

In case the application needs to run on a different port append `port=xxxx` eg `port=9090` to the start command.
-> eg full: `pm2 start server.js -- tenant=laval port=9090`

Running production with PM2, node server needs to be started on mobius-web folder:
1. cd mobius-web
2. export NODE_ENV=production
3. pm2 start server.js --name "WEB" -- --tenant=suttonLive --environment=live

### The Build System

The best way to learn about the build system is by familiarizing yourself with
Grunt and then reading through the heavily documented build script,
`Gruntfile.js`.

The driver of the process is the `watch` multi-task, which watches for file
changes using `grunt-contrib-watch` and executes one of nine tasks when a file
changes:

* `watch:styles` - When any `*.less` file within `src/styles` changes, the
  `src/less/main.less` file is linted and copied into
  `build/styles/main.css`.
* `watch:scripts` - When any JavaScript file within `src/` that does not end in
  `.spec.js` changes, all JavaScript sources are linted, all unit tests are run, and the all source files are re-copied to `build/app`.
* `watch:markup` - When any `*.html` file within `src/` changes, all templates are put into strings in a JavaScript file that will add the template to AngularJS's [`$templateCache`](http://docs.angularjs org/api/ng.$templateCache) so template files are part of the initial JavaScript payload and do not require any future XHR.  The template cache files are  `build/app/mobius-templates-*_*.js`.
* `watch:jsunit` - When any `*.spec.js` file in `src/` changes, the test files are linted and the unit tests are executed.

As covered in the previous section, `grunt watch` will execute a full build up-front and then run any of the aforementioned `watch:*` tasks as needed to ensure the fastest possible build. So whenever you're working on your project,
start with:

```sh
$ grunt watch
```

### Live Reload!

Build system also includes [Live Reload](http://livereload.com/), so you no
longer have to refresh your page after making changes! You need a Live Reload
browser plugin for this:

- Chrome - [Chrome Webstore](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
- Firefox - [Download from Live Reload](http://download.livereload.com/2.0.8/LiveReload-2.0.8.xpi)
- Safari - [Download from Live Reload](http://download.livereload.com/2.0.9/LiveReload-2.0.9.safariextz)
- Internet Explorer - Surely you jest.

When you load your page, click the Live Reload icon in your toolbar and
everything should work.

If you'd prefer to not install a browser extension, then you must add the
following to the end of the `body` tag in `index.html`:

```html
<script src="http://localhost:35729/livereload.js"></script>
```

### Troubleshooting
During install some of you may encounter some issues, most of this issues can be solved by one of the following tips.

#### Update NPM, Bower or Grunt
Sometimes you may find there is a weird error during install like npm's *Error: ENOENT*, usually updating those tools to the latest version solves the issue.

Updating NPM:
```
$ npm update -g npm
```

Updating Grunt:
```
$ npm update -g grunt-cli
```

Updating Bower:
```
$ npm update -g bower
```

#### Cleaning NPM and Bower cache
NPM and Bower has a caching system for holding packages that you already installed.
Cleaning the cache solves some troubles this system creates.

NPM Clean Cache:
```
$ npm cache clean
```

Bower Clean Cache:
```
$ bower cache clean
```

## Configuration
All settings can be categorised into the following categories:

- Front-end
- Server
- Build system

### UI
Front-end configuration is located in the following places:
`src/targets/{tenant}/settings.js`
`src/targets/{tenant}/styles`
`src/targets/{tenant}/locales`

#### `Settings.js` - main configuration file which contais customer related settings.
Main sections are:
- `API` - backend endpoints and their URL's. Make sure google analytics settings are turned off until the client codes are confirmed, this is especially true when creating a new target from an existing one.
- `heroSlider` - slider related settings such as animation duration, autoplay delay, autopreload etc.
- `menu` - visibility settings for  main menu items in application header. Some of the settings can be overridden by the server.
- `languages` - list of available languages.  This section is used to provide additional language data such as short name which is missing on the server.
- `currencies` - list of currencies and their display symbols.
- `bookingWidget` - settings related to a booking widget such as number of adults, children etc.
- `layout` - layout related settings, page content, order of the components. Application supports dynamic positioning of the widgets on the page which allows to change the layout without making direct changes to the application templates(.html files). Each page is presented by using corresponding state name like `index.home`  [Read more](https://github.com/angular-ui/ui-router) and a list of nested components. Children will be appended in the same order as they are specifyed in the config. Each component has a corresponding template. List of all supported widgets and their HTML templates is specified under `templates` section.

#### Styles
All styles are located in `src/styles` folder in [less](http://lesscss.org/) or `css` format. Each component has a corresponding `less` file which is located in`styles/partials` forlder. During the build everything is imported into a single CSS file as long as sources are imported via `main.less` file using `@import` statement. Colors, dimensions, transitions, typography settings are located in `styles/config.less`. Platform related media queries are specifyed at the bottom of each `less` files but in some complex cases can be found elsewhere within the file by using this tag `@media`.

### Server
`config/environments`
`routes/index.js`

### Build process
All build related settings are located in the following files:
`Gruntfile.js`
`build.config.js`

See The Build System.

## Creating a new tenant from scratch
All settings specific to a tenant is located in src/targets/{tenant}/ - a default setup is provided to get you started in src/targets/default/ - when creating a new tenant duplicate the default folder and rename it according to the tenant name, and update as follows:

### Settings
The main tenant settings file is located in src/targets/{tenant}/settings.js and is commented, many settings such as google analytics, google tag manager can be enabled/disabled depending on tenant needs, this should be evaluated at the start of the project. However some settings are required and must be set at the start of the project, request them to your project manager, those are:

* defaultProductRateId
* authType - "infiniti" or "mobius"
* infiniti - if authType = infiniti this must be enabled and environment urls updated accordingly
* infiniti e-commerce tracking - if authType = infiniti this must be enabled and environment urls updated accordingly
* evolution infiniti script - if authType = infiniti this must be enabled and script updated accordingly
* sentry - this should always be enabled and urls are not tenant specific so doesn't need to be updated
* googleAnalytics - check if this should be enabled and get client ID
* googleTagManager - check if this should be enabled and get client ID
* chainCode - uppercase code for current tenant
* Mobius-chainId
* Mobius-channelId
* baseURL - API base url with various environments
* Mobius product search/purchase tracking - enable?
* singleProperty - true if only one property
* facebookAppId - required for facebook sharing

### Locales
Locales files located in src/targets/{tenant}/locales are processed by grunt/node when building the app into angular template files. These files and some of their settings need to match the "languages" settings in Settings file, you can check what values are required by a tenant by fetching the "generics/languages" endpoint of the current tenant API, then update the locales params such as "base_href", "language_code" accordingly

### css
Refer to comments in src/targets/default/styles/style.less


## prerender.io
As mobius-web is an angular application, we rely on prerender.io to index pages for search engines.
This is implemented through a combination of:
- ``` meta name="prerender-status-code" content="{{prerenderStatusCode}}" ``` in the head of the page - /src/app/index.html
- ``` require('prerender-node').set('prerenderToken', 'i5yOvEEIyhpbWHoBfeG2') ``` in the node layer - /server.js

If you want to see how your page looks to the prerender crawler, try this - http://service.prerender.io/http://integration-sandman-www.mobiuswebservices.com/
(http://service.prerender.io/your-url-here)
