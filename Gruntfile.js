'use strict';

module.exports = function (grunt) {
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
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-cache-bust');

  // Time how long tasks take
  require('time-grunt')(grunt);

  // Get grunt target
  var target = grunt.option('tenant');
  var env = grunt.option('environment');

  if (!env) {
    grunt.fail.fatal('Missing "environment" argument.');
  }

  if (!target) {
    grunt.fail.fatal('Missing "tenant" argument.');
  }

  /**
   * Load in our build configuration file.
   */
  var buildConfig = require('./build.config.js');

  var taskConfig = {
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      tmp: '<%= config.build %>',
      dist: '<%= config.compile %>',
      cacheBust: '<%= config.cache_bust_dir %>'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        reporterOutput: ''
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
        src: [
          'app/**/*.js',
          'targets/' + target + '/**/*.js'
        ],
        dest: '<%= config.build %>'
      }
    },

    githooks: {
      all: {
        // Will run the jshint and test tasks at every push
        'pre-push': 'jshint test'
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
        options: {
          sourceMap: true,
          sourceMapFileName: '<%= config.build %>/style.css.map',
          sourceMapURL: '/static/targets/' + target + '/styles/style.css.map',
          sourceMapBasepath: 'static',
          sourceMapRootpath: '/',
          dumpLineNumbers: 'comments'
        },
        expand: true,
        cwd: '<%= config.client %>/',
        src: 'targets/' + target + '/styles/style.less',
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
        src: 'targets/' + target + '/styles/style.less',
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
          'build/app/**/*.js', 'build/targets/**/*.js', '!build/app/**/*.spec.js'
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
          src: ['images/<%= config.images %>'],
          dest: '<%= config.build %>'
        }]
      },
      imagestarget: {
        files: [{
          expand: true,
          cwd: '<%= config.client %>/targets/' + target,
          src: ['images/<%= config.images %>'],
          dest: '<%= config.build %>'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= config.client %>/targets/' + target,
          src: ['<%= config.fonts %>'],
          dest: '<%= config.build %>/targets/' + target
        },
        {
          expand: true,
          cwd: '<%= config.client %>/targets/' + target,
          src: ['<%= config.fonts %>'],
          dest: '<%= config.compile %>/targets/' + target
        }]
      },
      fontsawesome: {
        files: [{
          expand: true,
          cwd: '<%= config.font_awesome %>',
          src: ['<%= config.fonts %>'],
          dest: '<%= config.build %>/targets/' + target + '/font/'
        },
        {
          expand: true,
          cwd: '<%= config.font_awesome %>',
          src: ['<%= config.fonts %>'],
          dest: '<%= config.compile %>/targets/' + target + '/font/'
        }]
      },
      404: {
        files: [{
          expand: true,
          cwd: '<%= config.client %>/app/',
          src: ['<%= config.404 %>'],
          dest: '<%= config.build %>'
        }]
      },
      'pre-cachebust': {
        files: [
          {
            expand: true,
            cwd: '<%= config.compile %>',
            src: ['**/*'],
            dest: '<%= config.cache_bust_dir %>'
          },
          {
            expand: true,
            cwd: '<%= config.build %>',
            src: ['targets/' + target + '/settings.js'],
            dest: '<%= config.cache_bust_dir %>'
          },
          {
            expand: true,
            cwd: '<%= config.build %>',
            src: ['images/<%= config.images %>'],
            dest: '<%= config.cache_bust_dir %>'
          }
        ]
      },
      'post-cachebust': {
        files: [
          {
            expand: true,
            cwd: '<%= config.cache_bust_dir %>',
            src: ['**/*'],
            dest: '<%= config.compile %>'
          },
          {
            expand: true,
            cwd: '<%= config.cache_bust_dir %>',
            src: ['targets/' + target + '/settings.js'],
            dest: '<%= config.build %>'
          },
          {
            expand: true,
            cwd: '<%= config.cache_bust_dir %>',
            src: ['images/<%= config.images %>'],
            dest: '<%= config.build %>'
          }
        ]
      }
    },

    html: {
      files: ['<%= app_files.html %>'],
      tasks: ['index:build']
    },

    watch: {
      markup: {
        files: [
          '<%= config.client %>/<%= config.markup %>',
          '<%= config.client %>/locales/*.json',
          '<%= config.client %>/targets/' + target + '/locales/*.json'
        ],
        tasks: ['localisation', 'templateCache', 'index:build'],
        options: {livereload: true}
      },
      styles: {
        files: ['<%= config.client %>/<%= config.styles %>'],
        tasks: ['less:development', 'autoprefixer:development'],
        options: {livereload: true}
      },
      scripts: {
        files: ['<%= config.app_files.js %>', '<%= config.client %>/targets/' + target + '/settings.js'],
        tasks: ['prebuild:development', 'index:build'],
        options: {livereload: true}
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
        tasks: ['copy:images', 'copy:imagestarget'],
        options: {livereload: true}
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
        locales: 'src/targets/' + target + '/locales',
        pattern: /_([a-zA-Z_]+)_/
      },
      files: {
        src: ['**/*.html'],
        cwd: 'src/targets/' + target + '/templates/',
        expand: true,
        dest: 'build/templates/{locale}/'
      }
    },

    templateCache: {
      development: {
        app: {
          options: {
            src: 'build/templates/{locale}/**/*.html',
            dest: '<%= config.build %>/app/mobius-templates-{locale}.js'
          }
        }
      },
      production: {
        app: {
          options: {
            src: 'build/templates/{locale}/**/*.html',
            dest: '<%= config.compile %>/app/mobius-templates-{locale}.js'
          }
        }
      }

    },

    environment: {
      development: {
        env: 'development'
      },
      staging: {
        env: 'staging'
      },
      production: {
        env: 'production'
      }
    },

    cacheBust: {
      production: {
        options: {
          deleteOriginals: true,
          jsonOutput: true,
          prefixes: ['static'],
          baseDir: '<%= config.cache_bust_dir %>',
          assets: [
            '**/*.{js,css}',
            '<%= config.images %>'
          ]
        },
        files: [{
          expand: true,
          cwd: '<%= config.cache_bust_dir %>',
          src: [
            '**/*.{js,css,html}'
          ]
        }]
      }
    }
  };

  grunt.initConfig(grunt.util._.extend(taskConfig, buildConfig));

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  //run tests
  grunt.registerTask('test', [
    'karma:continuous'
  ]);

  //Prebuild
  grunt.registerTask('bust', [
    'copy:pre-cachebust',
    'pre-cachebust-cleanup',
    'cacheBust:production',
    'post-cachebust-cleanup',
    'copy:post-cachebust'
  ]);

  grunt.registerTask('prebuild:development', [
    'jshint',
    'localisation',
    'templateCache:development',
    'ngmin'
  ]);

  grunt.registerTask('prebuild:production', [
    'jshint',
    'test',
    'localisation',
    'templateCache:production',
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
    'prebuild:development',
    'less:development',
    'autoprefixer:development',
    'index:build',
    'copy:images',
    'copy:imagestarget',
    'copy:fonts',
    'copy:fontsawesome',
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
    'prebuild:production',
    'less:production',
    'autoprefixer:production',
    'concat',
    'uglify',
    'copy:styles',
    'copy:images',
    'copy:imagestarget',
    'copy:fonts',
    'copy:404',
    'index:compile',
    'bust',
    'copy:fontsawesome'
  ]);

  grunt.registerTask('post-cachebust-cleanup', 'Deletes the build/images dir as it is obsolete after cacheBusting and cleans up the cache bust dir', function () {
    grunt.file.delete('build/images');
  });

  grunt.registerTask('pre-cachebust-cleanup', 'Deletes the fonts dir to exclude from cache busting', function () {
    grunt.file.delete(buildConfig.config.cache_bust_dir + '/targets/' + target + '/font');
  });
  grunt.registerTask('sleep', 'Keep grunt running', function () {
    this.async();
  });

  grunt.registerTask('exit', 'Quit out of Grunt', function () {
    process.exit(0);
  });

  function setMetaEnvironment(locale, path) {
    var html = grunt.file.read(path);
    html = html.replace('<=?environment=>', env);

    grunt.log.writeln('Setting ' + env + ' as environment value...');
    grunt.file.write(path, html);
    grunt.log.writeln('HTML (' + path + ') has been replace').ok();
  }

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var dirRE = new RegExp('^(' + grunt.config('config.build') + '|' + grunt.config('config.compile') + ')\/', 'g');
    // All JS source files without templates prefix
    var FILTER_JS = /^(?!.*\bmobius-templates\b).+.js$/;
    var FILTER_CSS = /\.css$/;

    // List of JS source files
    var jsFiles = filterFiles(this.filesSrc, FILTER_JS).map(function (file) {
      return file.replace(dirRE, '');
    });

    // List of CSS files
    var cssFiles = filterFiles(this.filesSrc, FILTER_CSS).map(function (file) {
      return file.replace(dirRE, '');
    });

    var supportedLanguages = getSupportedLanguages('src/targets/' + target + '/locales');

    for (var i = 0; i < supportedLanguages.length; i++) {
      var localeCode = supportedLanguages[i];

      var src = grunt.config('config.build') + '/templates/' + localeCode + '/index.html';
      var dest = this.data.dir + '/index-' + localeCode + '.html';

      console.log(src);
      console.log(dest);

      processIndex(src, dest, jsFiles, cssFiles, localeCode);
      setMetaEnvironment(localeCode, dest);
    }
  });

  function processIndex(src, dest, jsFiles, cssFiles, localeCode) {
    var templateCache = 'app/mobius-templates-' + localeCode + '.js';
    grunt.file.copy(src, dest, {
      process: function (contents) {
        return grunt.template.process(contents, {
          data: grunt.util._.extend({
            scripts: jsFiles,
            styles: cssFiles,
            templates: [templateCache],
            vendor_js: jsFiles.length === 1 ? [] : grunt.config('config.vendor_files.js'),
            vendor_styles: grunt.config('config.vendor_files.styles'),
            version: grunt.config('pkg.version')
          }, {})
        });
      }
    });
  }

  /**
   * Creating template cache for each available locale
   */
  grunt.registerMultiTask('templateCache', 'Process localized templates', function () {
    var supportedLanguages = getSupportedLanguages('src/targets/' + target + '/locales');

    for (var i = 0; i < supportedLanguages.length; i++) {
      var localeCode = supportedLanguages[i];

      var src = this.data.app.options.src.replace('{locale}', localeCode);
      var dest = this.data.app.options.dest.replace('{locale}', localeCode);
      var basePath = 'build/templates/' + localeCode;

      // Creating multiple
      var taskName = 'html2js.' + localeCode;
      grunt.config.set(taskName + '.options.base', basePath);
      grunt.config.set(taskName + '.options.module', 'templates-main');
      grunt.config.set(taskName + '.src', src);
      grunt.config.set(taskName + '.dest', dest);

      grunt.task.run('html2js:' + localeCode);
    }
  });

  /**
   * A utility function for filtering the sources.
   */
  function filterFiles(files, filter) {
    return files.filter(function (file) {
      return file.match(filter);
    });
  }

  // Getting a list of available translations
  function getSupportedLanguages(path) {
    var supportedLanguages = [];

    grunt.file.recurse(path, function (path) {
      var localeConfig = grunt.file.readJSON(path);
      var langageCode = localeConfig.locale;
      if (supportedLanguages.indexOf(langageCode) === -1) {
        supportedLanguages.push(langageCode);
      }
    });

    return supportedLanguages;
  }
};
