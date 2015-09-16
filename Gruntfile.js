'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-localisation');
  grunt.loadNpmTasks('grunt-istanbul');

  // Time how long tasks take
  require('time-grunt')(grunt);

  // Get grunt target
  var target = grunt.option('target') || 'sutton';

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
        reporter: require('jshint-stylish')
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
      }
    },

    less: {
      development: {
        expand: true,
        sourceMap: true,
        cwd: '<%= config.client %>/',
        src: ['styles/style.less', 'targets/' + target + '/styles/style.less'],
        dest: '<%= config.build %>/',
        ext: '.css'
      },

      production: {
        options: {
          cleancss: true,
          report: 'min',
          compress: true
        },
        expand: true,
        cwd: '<%= config.client %>/',
        src: ['styles/style.less', 'targets/' + target + '/styles/style.less'],
        dest: '<%= config.compile %>/',
        ext: '_<%= pkg.name %>-<%= pkg.version %>.css'
      }
    },

    autoprefixer: {
      development: {
        src: '<%= config.build %>/<%= config.styles %>'
      },
      production: {
        src: '<%= config.compile %>/<%= config.styles %>'
      }
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {},

    /* PRODUCTION */
    concat: {
      compileJS: {
        src: buildConfig.config.vendor_files.js.concat([
          'build/app/**/*.js', '!build/app/**/*.spec.js'
        ]),
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
        assetsDirs: ['<%= config.compile %>']
      }
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
          cwd: '<%= config.client %>',
          src: ['images/<%= config.images %>', 'targets/' + target + '/images/<%= config.images %>'],
          dest: '<%= config.build %>'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= config.font_awesome %>',
          src: ['<%= config.fonts %>'],
          dest: '<%= config.build %>/font/'
        },
        {
          expand: true,
          cwd: '<%= config.font_awesome %>',
          src: ['<%= config.fonts %>'],
          dest: '<%= config.build %>/targets/' + target + '/font/'
        }]
      },
      404: {
        files: [{
          expand: true,
          cwd: '<%= config.client %>/app/',
          src: ['<%= config.404 %>'],
          dest: '<%= config.build %>'
        }]
      }
    },

    html: {
      files: [ '<%= app_files.html %>' ],
      tasks: [ 'index:build' ]
    },

    watch: {
      markup: {
        files: [
          '<%= config.client %>/<%= config.markup %>',
          '<%= config.client %>/locales/*.json',
          '<%= config.client %>/targets/' + target + '/locales/*.json'
        ],
        tasks: ['localisation', 'templateCache', 'index:build'],
        options: { livereload: true }
      },
      styles: {
        files: ['<%= config.client %>/<%= config.styles %>'],
        tasks: ['less:development', 'autoprefixer:development'],
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

    localisation: {
      options: {
        locales: 'src/locales',
        //pattern: /_(.+)_/
        pattern: /_([a-zA-Z_]+)_/
        //pattern: /[^a-zA-Z](_([a-zA-Z_]+)_)[^a-zA-Z]/
      },
      files: {
        src: [ '**/*.html' ],
        cwd: 'src/app',
        expand: true,
        dest: 'build/templates/{locale}/'
      }
    },

    templateCache: {
      app:{
        options: {
          src: 'build/templates/{locale}/**/*.html',
          dest: '<%= config.build %>/app/mobius-templates-{locale}.js'
        }
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, buildConfig ));

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);


  //run tests
  grunt.registerTask('test', [
    'karma:continuous'
  ]);

  //Prebuild
  grunt.registerTask('prebuild', [
    'jshint',
    'test',
    'localisation',
    'templateCache',
    'ngmin'
  ]);

  //default development task
  grunt.registerTask('default', [
    'development'
  ]);

  //development tasks
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
    'autoprefixer:development',
    'index:build',
    'copy:images',
    'copy:fonts',
    'copy:404'
  ]);

  //production tasks
  grunt.registerTask('release', [
    'production'
  ]);

  grunt.registerTask('production', [
    'build:production'
  ]);

  grunt.registerTask('build:production', [
    'clean',
    'prebuild',
    'less:production',
    'autoprefixer:production',
    'concat',
    'uglify',
    'copy',
    'index:compile'
    //'usemin'
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

    // All JS source files without templates prefix
    var FILTER_JS = /^(?!.*\bmobius-templates\b).+.js$/;
    var FILTER_CSS = /\.css$/;

    // List of JS source files
    var jsFiles = filterFiles( this.filesSrc, FILTER_JS ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    // List of CSS files
    var cssFiles = filterFiles( this.filesSrc, FILTER_CSS ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });

    var supportedLanguages = getSupportedLanguages(grunt.config('config.locales'));

    for(var i = 0; i < supportedLanguages.length; i++){
      var localeCode = supportedLanguages[i];

      var src = grunt.config('config.build') + '/templates/' + localeCode + '/index.html';
      var dest = this.data.dir + '/index-' + localeCode + '.html';

      console.log(src);
      console.log(dest);

      processIndex(src, dest, jsFiles, cssFiles, localeCode);
    }
  });

  function processIndex(src, dest, jsFiles, cssFiles, localeCode){
    var templateCache = 'app/mobius-templates-' + localeCode + '.js';
    grunt.file.copy(src, dest, {
      process: function ( contents ) {
        return grunt.template.process( contents, {
          data: grunt.util._.extend({
            scripts: jsFiles,
            styles: cssFiles,
            templates: jsFiles.length === 1 ? [] : [templateCache],
            vendor_js: jsFiles.length === 1 ? [] : grunt.config('config.vendor_files.js'),
            vendor_styles: grunt.config('config.vendor_files.styles'),
            version: grunt.config( 'pkg.version' )
          }, {})
        });
      }
    });
  }

  /**
  * Creating template cache for each available locale
  */
  grunt.registerMultiTask( 'templateCache', 'Process localized templates', function () {
    var supportedLanguages = getSupportedLanguages(grunt.config('config.locales'));

    for(var i = 0; i < supportedLanguages.length; i++){
      var localeCode = supportedLanguages[i];

      var basePath = 'build/templates/' + localeCode;

      // Creating multiple
      var taskName = 'html2js.' + localeCode;
      grunt.config.set(taskName + '.options.base', basePath);
      grunt.config.set(taskName + '.options.module', 'templates-main');
      grunt.config.set(taskName + '.src', basePath + '/' + grunt.config('config.markup'));
      grunt.config.set(taskName + '.dest', grunt.config('config.build') + '/' + 'app/mobius-templates-' + localeCode + '.js');

      grunt.task.run('html2js:' + localeCode);
    }
  });

  /**
   * A utility function for filtering the sources.
   */
  function filterFiles (files, filter) {
    return files.filter( function ( file ) {
      return file.match( filter );
    });
  }

  // Getting a list of available translations
  function getSupportedLanguages ( path ) {
    var supportedLanguages  = [];

    grunt.file.recurse(path, function(path){
      var localeConfig = grunt.file.readJSON(path);
      var langageCode = localeConfig.locale;
      if(supportedLanguages.indexOf(langageCode) === -1 ){
        supportedLanguages.push(langageCode);
      }
    });

    return supportedLanguages;
  }
};
