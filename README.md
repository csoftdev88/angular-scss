# mobius

Rewrite of existing hotel booking engine into angular.js SPA..

### Overall Directory Structure

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
  |  |  |- <static files>
  |  |- images/
  |  |  |- <icons, logos>
  |  |- locales/
  |  |  |- en_US.json
  |  |- styles/
  |  |  |- <less files>
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
learn more.

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
2. `npm install -g grunt-cli bower karma phantomjs`
3. `git clone https://github.com/salsita/mobius.git`
4. `cd mobius`:
  * `npm install`
  * `bower install`
  * `grunt build`
  * Run server `NODE_ENV=development node server.js`
  * Finally, open `localhost:9000` in your browser

### Local development
1. Follow installation steps 1-3 described above.
2. Run `grunt development`
3. Run server `NODE_ENV=development node server.js`.

### Production
1. Follow instalation steps 1-4 described above.
2. Run `grunt build` to build the app.
3. Run `NODE_ENV=production node server.js`

### Configuration
Application settings are located in src/app/settings.js file. 
