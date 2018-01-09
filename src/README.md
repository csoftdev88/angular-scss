# The `src` Directory

## Overview

The `src` directory contains all code used in the application along with all
tests of such code, localisation data, images, fonts, CSS and LESS files.

```
src/
  |- app/
  |- font/
  |- images/
  |- locales/
  |- styles/
```

- `src/app/` - application-specific code [Read more &raquo;](app/README.md)
- `src/font/` - static files, fonts, vector images.
- `src/images/` - application icons, logos.
- `src/locales/` - localisation filesю
- `src/styles/` - application styles.


# The `src/locales` Directory

## Overview

The `src/locales/` directory contains all locales supported by the application.


## `*.json`

JSON files contains the translations for all view related strings presented in the application, locale code, language name and description. These files are used during the build process when application templates are created.

# The `src/targets` Directory

## Overview

The `src/targets/` directory contains all the template, directive, image and style files used by a tenant (overriding the *CORE* files) to theme and control the application.
Any changes to *CORE* files should be avoided if at all possible and overrides used instead as this will limit the impact for other tenants.

## `settings.js`
 
Main sections are:
 
 * `API` - backend endpoints and their URL's. Make sure google analytics settings are turned off until the client codes are confirmed, this is especially true when creating a new target from an existing one.
 * `heroSlider` - slider related settings such as animation duration, autoplay delay, autopreload etc.
 * `menu` - visibility settings for  main menu items in application header. Some of the settings can be overridden by the server.
 * `languages` - list of available languages.  This section is used to provide additional language data such as short name which is missing on the server.
 * `currencies` - list of currencies and their display symbols.
 * `bookingWidget` - settings related to a booking widget such as number of adults, children etc.
 * `layout` - layout related settings, page content, order of the components. Application supports dynamic positioning of the widgets on the page which allows to change the layout without making direct changes to the application templates(.html files). Each page is presented by using corresponding state name like `index.home`  [Read more](https://github.com/angular-ui/ui-router) and a list of nested components. Children will be appended in the same order as they are specifyed in the config. Each component has a corresponding template. List of all supported widgets and their HTML templates is specified under `templates` section.

Contains all the relevant config values for determining the state of the application, these mostly take the shape of boolean flags controlling the visibility of various components, but can just as easily be the location of specific resources as well as content overrides in some exceptional circumstances.
 
NB: it is here in the settings.js where a specific tenant can be made to point at the integration, staging or live environments for debug or development purposes. This can be helpful when investigating client issues or when certain data is expected - for instance that exists on staging but not on integration.
  
```
    ...
    'baseURL': {
      'local': '//localhost:3010/api/4.0/',
      'development': '//integration-www-sandman.mobiusbookingengine.com/api/4.0/',
      'integration': '//integration-www-sandman.mobiusbookingengine.com/api/4.0/',
      'staging': '//staging-www-sandman.mobiusbookingengine.com/api/4.0/',
      'live': 'https://www.sandmanhotels.com/api/4.0/'
    },
    ...
```
 
## `dynamicMessages.js`
 
A _mostly_ obsoleted method of Intertnationalisation.
 
## `src/targets/<tenant>/locales/*.json`
 
The more widely used method of Internationalisation, we have a couple files here that provide localised strings for use in the templates.
 
### 'en_US.json'
```
  "hotels": "Find a Hotel",
```
 
### 'fr.json'
```
  "hotels": "Trouver un hôtel",
```
 
### header.html
```
  <li has-dropdown="click"
     ng-hide="!isMobile || config.generics.singleProperty || (!config.menu.showHotels && !config.menu.standalone && !isMobile) || (config.menu.standalone && !isMobile)"
     menu-content="hotels"
     data-disable-title-click="true"
     data-title="_hotels_">
  </li>
```

Notice the use of `_hotels_` which will refer to the string loaded by the Internationalisation module depending on which language has been chosen.

## `redirects.json`

Contains the mappings for internal redirects - this is mainly a legacy hack to get around the fact we don't own the sandman.ca DNS and cannot produce redirects at that level so we have to handle them using a piece of code living inside the app itself.
