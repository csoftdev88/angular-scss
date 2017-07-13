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
    fonts:   '**/*.{eot,svg,ttf,woff,woff2,otf}',
    font_awesome: 'bower_components/font-awesome/fonts/',
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
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-chosen-js/angular-chosen.min.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'bower_components/angular-growl-v2/build/angular-growl.min.js',
        'bower_components/chai/chai.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'node_modules/lolex/lolex.js',
        'bower_components/sinon/lib/sinon.js',
        'bower_components/sinon/lib/sinon/util/core.js',
        'bower_components/sinon/lib/sinon/extend.js',
        'bower_components/sinon/lib/sinon/times_in_words.js',
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
        'bower_components/sinon/lib/sinon/format.js',
        'bower_components/sinon/lib/sinon/log_error.js',
        'bower_components/sinon/lib/sinon/util/event.js',
        'bower_components/sinon/lib/sinon/util/fake_xml_http_request.js',
        'bower_components/sinon/lib/sinon/util/fake_timers.js',
        'bower_components/sinon/lib/sinon/util/fake_xdomain_request.js',
        'bower_components/sinon/lib/sinon/util/xhr_ie.js',
        'bower_components/sinon/lib/sinon/util/xdr_ie.js',
        'bower_components/sinon/lib/sinon/util/timers_ie.js',
        'bower_components/sinon/lib/sinon/util/fake_server.js',
        'bower_components/sinon/lib/sinon/util/fake_server_with_clock.js',
        'bower_components/sinon-chai/lib/sinon-chai.js',
        'bower_components/angular-underscore-module/angular-underscore-module.js',
        'bower_components/underscore/underscore.js',
        'bower_components/ngmap/build/scripts/ng-map.min.js',
        'bower_components/moment/min/moment.min.js',
        'bower_components/moment-timezone/builds/moment-timezone-with-data.min.js',
        'bower_components/re-tree/re-tree.min.js',
        'bower_components/ng-device-detector/ng-device-detector.min.js',
        'bower_components/angular-vertilize/angular-vertilize.min.js',
        'bower_components/angular-cookie-law/dist/angular-cookie-law.min.js',
        'bower_components/ouibounce/build/ouibounce.min.js',
        'karma/init.js',
        'src/app/**/*.js'
      ]
    },

    /* List of vendor files used in application */
    vendor_files: {
      js: [
        // jquery is a dependency on a lot of other scripts, ensure it is always loaded first
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/jquery-ui/jquery-ui.min.js',
        'vendors/jquery-datepicker/index.js',
        'vendors/chosen/chosen.jquery.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-touch/angular-touch.min.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-chosen-js/angular-chosen.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-growl-v2/build/angular-growl.min.js',
        'bower_components/underscore/underscore.js',
        'bower_components/angular-underscore-module/angular-underscore-module.js',
        'bower_components/angular-validation-match/dist/angular-input-match.js',
        'bower_components/ngmap/build/scripts/ng-map.min.js',
        'bower_components/moment/min/moment.min.js',
        'bower_components/moment-timezone/builds/moment-timezone-with-data.min.js',
        'bower_components/moment/locale/de.js',
        'bower_components/moment/locale/fr.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/angular-rangeslider/angular.rangeSlider.js',
        'bower_components/intl-tel-input/build/js/intlTelInput.min.js',
        'bower_components/international-phone-number/releases/international-phone-number.min.js',
        'bower_components/intl-tel-input/lib/libphonenumber/build/utils.js',
        'bower_components/showdown/compressed/Showdown.min.js',
        'bower_components/angular-markdown-directive/markdown.js',
        'bower_components/angular-tooltips/dist/angular-tooltips.min.js',
        'bower_components/angularUtils-pagination/dirPagination.js',
        'vendors/jquery-ui/datepicker-translations/de.js',
        'vendors/jquery-ui/datepicker-translations/fr.js',
        'bower_components/re-tree/re-tree.min.js',
        'bower_components/ng-device-detector/ng-device-detector.min.js',
        'bower_components/angular-vertilize/angular-vertilize.min.js',
        'bower_components/angular-cookie-law/dist/angular-cookie-law.min.js',
        'bower_components/ouibounce/build/ouibounce.min.js'
      ],
      styles: []
    }
  }
};
