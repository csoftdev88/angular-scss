## 02 - Skinning ##

In mobius web, the concept of skinning is creating a theme for a new tenant
so that the build system can create a 'skin' for mobius web that it will use
as the UI.

A theme consists of:

 - Locales, a folder of JSON files that represent the localised content of the
 app. Please note that the JSON file needs to be named a the locale code.
 Additionally, these files need to match to the codes returned from 
 that API call /languages
 - Styles, a folder consisting of the LESS 

Additionally, some of the settings in the theme are not just for the
UI, but also configure the core JS controllers behaviour.

When adding a setting, please use the viewsSettings object for any config to
do purely with the UI. Whereas any config that will be accessed via the JS, please
use the modular approach, in which a object is created representing that component
or page.

