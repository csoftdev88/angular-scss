# 03 - Skinning #

In mobius web, the concept of skinning is creating a theme for a new tenant
so that the build system can create a 'skin' for mobius web that it will use
as the UI.

Additionally, some of the settings in the theme are not just for the
UI, but also configure the core JS controllers behaviour.

A theme consists of:

 - Locales, a folder of JSON files that represent the localised content of the
 app. Please note that the JSON file needs to be named a the locale code.
 Additionally, these files need to match to the codes returned from 
 that API call /languages
 - Styles, a folder consisting of the LESS source files to style the app.
 This folder must have a style.less which should contain all the imports
 that are needed for the theme. Global styles can be imported from the styles
 folder in the main src.
 - Font, a folder to store ant tenant specific fonts. This folder is not used
 by the build system but used for convenience sake when creating font families
 in LESS.
 - Images, a folder for all the static images for the skin. This folder is
 copied into the built application's image folder and will override any image
 with the same name.
 - redirects, a JSON file representing any url that should be redirected for the
 tenant. These can be used to ensure links from external sites map to new content
 for example.


When adding a setting, please use the viewsSettings object for any config to
do purely with the UI. Whereas any config that will be accessed via the JS, please
use the modular approach, in which a object is created representing that component
or page.

#### Creating a new tenant from scratch ####

To create a new tenant, all you need to do is copy an existing tenant folder and
rename. This will then act as the 'tenant' name
used in the build commands. Also, please keep the utility npm scripts up to date
by adding a serve.tenant and run.tenant to the package JSON.

The styling of the tenant is imported from a single file, style.less. This file
is only for use with imports and allows your to import new tenant specific
components as well as picking some from the global styles.

The config.less is where we store the variables used throughout the tenant
styling. This file should be the first to be changed. Once the tenant folder
is copied, change the variables here with the tenant's existing color, font and
sizing requirments.

