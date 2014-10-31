# The `src` Directory

## Overview

The `src/` directory contains all code used in the application along with all
tests of such code.

```
src/
  |- app/
  |  |- directives/
  |  |- filters/
  |  |- layouts/
  |  |- services/
  |  |- app.js
  |  |- index.html
  |  |- settings.js
```

- `src/app/` - application-specific code.
- `src/font/` - static files, fonts, vector images.
- `src/images/` - application icons, logos.
- `src/locales/` - localisation files.
- `src/styles/` - application styles.

- `src/app/index.html` - this is the HTML document of the single-page application.
  See below.

## `index.html`

The `index.html` file is the HTML document of the single-page application (SPA)
that should contain all markup that applies to everything in the app, such as
the header and footer. It declares with `mobiusApp` and contains the `ui-view` directive into which route templates are
placed.

Unlike any other HTML document (e.g. the templates), `index.html` is compiled as
a Grunt template, so variables from `Gruntfile.js` and `package.json` can be
referenced from within it.

- `src/app/settings.js` - this is the main application configuration.
  See below.

## `settings.js`

### Main configuration sections

- `API` - remote endpoints. `baseURL` specifies full path to the API. The rest of the settings are relative to the `baseURL`.

- UI - settings related to UI components/directives.

- menu - customer specific settings for the main menu.

- currencies - list of supported currencies. Server doesn't provide a list of corresponding currency symbols so we keep this settings directly on the front-end.

- languages - list of supported languages. This dictionary is used for mapping locales into a short language name.

- bookingWidget - settings for booking widget directive. Customer related settings as number of adults/children are specified here.

- layout - settings for dynamic page layout based on application states. Every displayed page in the application has a corresponding application state. States are short definitions which are specified in app.js file and associate view, controllers and path in the URL. By changing this configuration we can affect the view and component placement without making changes in application templates (layouts). dynamicLayoutDirective will build a final page layout on the fly according to the specified configuration. Content in this section is tightly connected with templates definitions, See below.

- templates - map of component names and their templates.