module.exports = function ( karma ) {

  var buildConfig = require( '../build.config.js' );

  var files = buildConfig.config.app_files.jsunit_init
        .concat(buildConfig.config.app_files.jsunit);

  karma.set({
    /**
     * From where to look for files, starting with the location of this file.
     */
    basePath: '../',

    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: files,
    preprocessors: {
      'src/app/**/!(*spec).js': 'coverage'
    },

    frameworks: [ 'mocha' ],
    plugins: [ 'karma-mocha', 'karma-phantomjs-launcher', 'karma-junit-reporter', 'karma-coverage' ],

    /**
     * How to report, by default.
     */
    reporters: ['dots', 'junit', 'coverage'],
    junitReporter: {
        outputFile: 'test-results.xml'
    },

    coverageReporter: {
      type : 'lcovonly',
      dir : 'coverage/',
      subdir: '.',
      file: 'lcov.info'
    },

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',

    /**
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      'PhantomJS'
    ]
  });
};