/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  config: {
    // Destinations
    build: 'build',
    compile: 'compile',

    gruntfile: 'Gruntfile.js',
    client: 'src',
    server: 'server',

    'static': 'static',

    markup:  '**/*.html',
    styles:  '**/*.{css,less}',
    scripts: '**/*.js',

    locales: 'src/locales',

    images:  '**/*.{png,jpg,jpeg,gif,webp,svg}',
    fonts:   '**/*.{eot,svg,ttf,woff}',
    404: '404.html',

    app_files: {
      js: [
        'src/app/**/*.js',
        '!src/app/**/*.spec.js',
        '!src/app/temp/*'
      ],
      jsunit: [
        'src/app/**/*.spec.js'
      ],
      /* These files should be loaded first in order to initialize app namespaces */
      jsunit_init: [
        'bower_components/angular/angular.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-touch/angular-touch.min.js',
        'bower_components/angular-chosen-localytics/chosen.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'bower_components/chai/chai.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/underscore/underscore.js',
        'bower_components/sinon/lib/sinon.js',
        'bower_components/sinon/lib/sinon/util/core.js',
        'bower_components/sinon/lib/sinon/extend.js',
        'bower_components/sinon/lib/sinon/spy.js',
        'bower_components/sinon/lib/sinon/call.js',
        'bower_components/sinon/lib/sinon/behavior.js',
        'bower_components/sinon/lib/sinon/stub.js',
        'bower_components/sinon/lib/sinon/mock.js',
        'bower_components/sinon/lib/sinon/collection.js',
        'bower_components/sinon/lib/sinon/assert.js',
        'bower_components/sinon/lib/sinon/sandbox.js',
        'bower_components/sinon/lib/sinon/test.js',
        'bower_components/sinon/lib/sinon/test_case.js',
        'bower_components/sinon/lib/sinon/typeOf.js',
        'bower_components/sinon/lib/sinon/match.js',
        'bower_components/sinon-chai/lib/sinon-chai.js',
        'karma/init.js',
        'src/app/**/*.js'
      ]
    },

    /* List of vendor files used in application */
    vendor_files: {
      js: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-touch/angular-touch.min.js',
        'bower_components/angular-chosen-localytics/chosen.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/jquery-ui/jquery-ui.min.js',
        'bower_components/jquery-datepicker/index.js',
        'bower_components/chosen/chosen.jquery.min.js',
        'bower_components/underscore/underscore.js',
        'bower_components/angular-underscore-module/angular-underscore-module.js',
        'bower_components/angular-validation-match/dist/angular-input-match.js'
      ],
      styles: []
    }
  }
};
