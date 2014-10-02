'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-localization');

  // Time how long tasks take
  require('time-grunt')(grunt);

  /**
  * Load in our build configuration file.
  */
  var buildConfig = require( './build.config.js' );

  var taskConfig = {
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      tmp: '<%= config.build %>',
      dist: '<%= config.compile %>'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
      },
      src: [
        '<%= config.gruntfile %>',
        '<%= config.app_files.js %>'
      ],
      test: [
        '<%= config.app_files.jsunit %>'
      ]
    },


    /* PREBUILD CONFIG */

    ngmin: {
      default: {
        expand: true,
        cwd: '<%= config.client %>',
        src: '**/*.js',
        dest: '<%= config.build %>'
      }
    },

    /* BUILD CONFIG*/

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {
      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= config.build %>',
        src: [
          '<%= config.build %>/**/*.js',
          '!<%= config.build %>/**/*.spec.js',
          '<%= config.build %>/**/*.css'
        ]
      },
      compile: {
        dir: '<%= config.compile %>',
        src: [
          '<%= config.compile %>/**/*.js',
          '<%= config.compile %>/**/*.css'
        ]
      },
    },

    less: {
      development: {
        expand: true,
        sourceMap: true,
        cwd: '<%= config.client %>/',
        src: 'styles/main.less',
        dest: '<%= config.build %>/',
        ext: '.css',
      },

      production: {
        options: {
          cleancss: true,
          report: 'min',
          compess: true,
        },
        expand: true,
        cwd: '<%= config.client %>/',
        src: 'styles/main.less',
        dest: '<%= config.compile %>/',
        ext: '_<%= pkg.name %>-<%= pkg.version %>.css',
      }
    },

    autoprefixer: {
      options: {
        diff: '<%= config.build %>/styles/autoprefixer.patch',
        browsers: [
          '> 1%',
          'last 2 versions',
          'Firefox ESR',
          'Opera 12.1',
          'ie 8',
          'ie 9',
          'ie 10',
          'Android 2',
          'bb 10',
          'last 2 op_mob versions',
          'last 2 and_chr versions',
          'last 2 ie_mob versions'
        ]
      },
      dist: {
        src: '<%= config.build %>/<%= config.styles %>'
      }
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      app: {
        options: {
          base: '<%= config.client %>/app/'
        },
        src: [ '<%= config.client %>/<%= config.app_files.html %>' ],
        dest: '<%= config.build %>/app/mobius-templates.js'
      }
    },


    /* PRODUCTION */

    concat: {
      compileJS: {
        src: [
          'build/app/**/*.js', '!build/app/**/*.spec.js'
        ],
        dest: '<%= config.compile %>/app/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },

      compile: {
        files: {
          '<%= concat.compileJS.dest %>': '<%= concat.compileJS.dest %>'
        }
      }
    },

    usemin: {
      html: ['<%= config.compile %>/**/*.html'],
      css: ['<%= config.compile %>/**/*.css'],
      options: {
        dest: '<%= config.compile %>',
        assetsDirs: ['<%= config.compile %>'],
      },
    },

    copy: {
      styles: {
        files: [{
          expand: true,
          cwd: '<%= config.build %>',
          src: ['**/*.css'],
          dest: '<%= config.compile %>'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= config.client %>/images/',
          src: ['<%= config.images %>'],
          dest: '<%= config.build %>/images/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= config.client %>/fonts/',
          src: ['<%= config.fonts %>'],
          dest: '<%= config.build %>/fonts/'
        }]
      }
    },

    html: {
      files: [ '<%= app_files.html %>' ],
      tasks: [ 'index:build' ]
    },

    watch: {
      markup: {
        files: ['<%= config.client %>/<%= config.markup %>'],
        tasks: ['localization', 'html2js', 'index:build'],
      },
      styles: {
        files: ['<%= config.client %>/<%= config.styles %>'],
        tasks: ['less:development', 'autoprefixer'],
        options: { livereload: true }
      },
      scripts: {
        files: ['<%= config.app_files.js %>'],
        tasks: ['prebuild', 'index:build'],
        options: { livereload: true }
      },
      jsunit: {
        files: ['<%= config.app_files.jsunit %>'],
        tasks: ['jshint:test', 'test']
      },
      server: {
        files: ['<%= config.server %>/<%= config.scripts %>'],
        tasks: ['exit']
      },
      images: {
        files: ['<%= config.client %>/<%= config.images %>'],
        tasks: ['copy:images'],
        options: { livereload: true }
      }
    },

    karma: {
      options: {
        configFile: 'karma/karma-unit.js'
      },
      unit: {
        runnerPort: 9101,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    localization: {
      options: {
        locales: 'src/locales',
        defaultLocale: 'en_US'
      },
      files: {
        // Core as default component
        src: [ '**/*.html' ],
        cwd: 'src/app',
        dest: 'build/templates/{locale}/'
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, buildConfig ));

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', [
    'karma:continuous'
  ]);

  grunt.registerTask('prebuild', [
    'jshint',
    'test',
    'localization',
    'html2js',
    'ngmin'
  ]);


  grunt.registerTask('default', [
    'development'
  ]);

  grunt.registerTask('development', [
    'build:development',
    'watch',
    'sleep'
  ]);

  grunt.registerTask('build', [
    'build:development'
  ]);

  grunt.registerTask('build:development', [
    'clean',
    'prebuild',
    'less:development',
    'autoprefixer',
    'index:build',
    'copy:images',
    'copy:fonts'
  ]);

  grunt.registerTask('production', [
    'build:production',
    'sleep'
  ]);

  grunt.registerTask('build:production', [
    'clean',
    'prebuild',
    'less:production',
    'concat',
    'uglify',
    'copy',
    'index:compile',
    'usemin'
  ]);

  grunt.registerTask('release', [
    'production'
  ]);

  grunt.registerTask('localize', [
    'localization'
  ]);

  grunt.registerTask('sleep', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('exit', 'Quit out of Grunt', function() {
    process.exit(0);
  });


  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
    var dirRE = new RegExp( '^('+grunt.config('config.build') + '|' + grunt.config('config.compile')+')\/', 'g' );

    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    grunt.file.copy(grunt.config('config.client') + '/app/index.html', this.data.dir + '/index.html', {
      process: function ( contents ) {
        return grunt.template.process( contents, {
          data: grunt.util._.extend({
            scripts: jsFiles,
            styles: cssFiles,
            vendor_js: grunt.config('config.vendor_files.js'),
            vendor_styles: grunt.config('config.vendor_files.styles'),
            version: grunt.config( 'pkg.version' )
          }, {})
        });
      }
    });
  });

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }
};
