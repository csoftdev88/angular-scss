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

    app_files: {
        html: [
            'app/**/*.html'
        ],

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
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'bower_components/angular-chosen-localytics/chosen.js',
            'bower_components/jquery/jquery.js',
            'bower_components/angular-bootstrap/ui-bootstrap.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'bower_components/chai/chai.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/sinon/index.js',
            'bower_components/sinon-chai/lib/sinon-chai.js',
            'karma/init.js',
            'src/app/**/*.js'
        ]
    },

    /* List of vendor files used in application */
    vendor_files: {
        js: [
            'bower_components/jquery/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-chosen-localytics/chosen.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            // 'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/temp/ui-bootstrap-tpls.js',
            'bower_components/chosen/chosen.jquery.min.js'
        ],
        styles: [
        ]
    }
  }
};
