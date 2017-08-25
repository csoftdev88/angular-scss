# 05 - Best Practises #

#### Settings
When creating settings that determine the behaviour of the UI, i.e. it is referenced
mainly in the JS, please create an object as an attribute to the UI config using
a semantic name.

When creating settings used solely for the purpose of adjusting the UI layout, i.e.
when using ng-repeat="item in items | filter : config.numRepeat", please add these
to the viewsSettings config.

#### Styling 
When creating a new UI component, please do not use any inline styles or use any
conditional ng-styles attributes. Move the styling rules into a dedicated class
then use apply this using the class attribute or ng-class if it needs to be conditional.

Furthermore, do not make style classes conditional upon tenant configs. As tenants
have dedicated LESS files, then use the style sheets to apply the correct rules.

#### Code style guide
Let's not re invent the wheel, just follow the jshint and eslint and make sure to
read john papa's angular guide (https://github.com/johnpapa/angular-styleguide/tree/master/a1)

#### Contributing ####
Don't merge other peoples branches after reviewing

At the beginning of the commit message, please specify the tenant name then a colon.

e.g. git commit -m "sandman: Improve the home page"
