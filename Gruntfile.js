'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;

var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
  };

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        test: 'tests'
      };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            qunit: {
                files: ['tests/*.js', 'tests/*.html', 'app/js/*.js', 'app/index.html'],
                tasks: ['qunit']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            },
            livereload: {
                options: {
                    livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/js/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    '<%= yeoman.app %>/js/templates/*.{ejs,mustache,hbs}',
                    'test/spec/**/*.js'
                ]
            },
            jst: {
                files: [
                    '<%= yeoman.app %>/js/templates/*.ejs'
                ],
                tasks: ['jst']
            },
            test: {
                files: ['<%= yeoman.app %>/js/{,*/}*.js', 'test/spec/**/*.js'],
                tasks: ['test:true']
            }
        },
        express: {
            dist: {
                options: {
                    server: './dist/app',
                    port: grunt.option('port') || SERVER_PORT,
                }
            }
        },
        connect: {
            options: {
                port: grunt.option('port') || SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            test: {
                // path: 'http://localhost:<%= connect.test.options.port %>'
                path: '<%= yeoman.test %>/index.html'
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp',
            dev: {
                src: ['<%= yeoman.dev%>'],
                options: { force: true }
            }
        },
        // jshint: {
        //     options: {
        //         jshintrc: '.jshintrc',
        //         reporter: require('jshint-stylish')
        //     },
        //     all: [
        //         'Gruntfile.js',
        //         '<%= yeoman.app %>/scripts/{,*/}*.js',
        //         '!<%= yeoman.app %>/scripts/vendor/*',
        //         'test/spec/{,*/}*.js'
        //     ]
        // },
        qunit: {
            all: ['tests/*.html']
        },
        blanket_qunit: {
            all: {
                options: {
                    urls: ['<%= yeoman.test %>/index.html?coverage=true&gruntReport'],
                    threshold: 20
                }
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/js',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/js/lib',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: false
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/style.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        sshconfig: {
            "devServerProperties": grunt.file.readJSON('./deploy/dev-server-properties.json')
        },
        sftp: {
            copyDev: {
                files: {
                    "./": "dist/**"
                },
                options: {
                    config: 'devServerProperties',
                    path: '/tmp/rentmethat-staging/',
                    srcBasePath: 'dist/',
                    createDirectories: true
                }
            }
        },
        sshexec: {
            reloadDev: {
                command: [
                    'echo password | sudo -S rm -rf /opt/rentmethat/*',
                    'echo password | sudo -S chmod 755 /tmp/rentmethat-staging/bin/* /opt/rentmethat',
                    'echo password | sudo -S chown -R dev:dev /tmp/rentmethat-staging/*',
                    'echo password | sudo -S cp -R /tmp/rentmethat-staging/* /opt/rentmethat',
                    'echo password | sudo -S stop rentmethat',
                    'echo password | sudo -S start rentmethat'
                    ].join(' && '),
                options: {
                    config: 'devServerProperties'
                }
            },
            removeTmpDev: {
                command: [
                    'echo password | sudo -S rm -rf /tmp/rentmethat-staging/*'
                    ].join(' && '),
                options: {
                    config: 'devServerProperties'
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: './',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        // 'app/**',
                        'bin/**',
                        'routes/**',
                        'app.js',
                        'node_modules/express/**',
                        'views/**',
                        'public/**'            
                    ]
                }]
            }
        },
        jst: {
            compile: {
                files: {
                    '.tmp/js/templates.js': ['<%= yeoman.app %>/js/templates/*.ejs']
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/js/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '/styles/fonts/{,*/}*.*',
                        'js/lib/sass-bootstrap/fonts/*.*'
                    ]
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-blanket-qunit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-express');
    

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('.tmp/js/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve' + (target ? ':' + target : '')]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:server', 'express:dist', 'express-keepalive'/*'connect:dist:keepalive'*/]);
        }

        grunt.task.run([
            'clean:server',
            'jst',
            'compass:server',
            'open:server',
            //'connect:livereload',
            'express:dist',
            'express-keepalive'
        ]);
    });

    grunt.registerTask('deploy', function (target) {
        if (target === 'dev') {
            return grunt.task.run([
                'build',
                'sshexec:removeTmpDev',
                'sftp:copyDev',
                'sshexec:reloadDev'
            ]);
        }
    });

    grunt.registerTask('test', function (isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
                'clean:server',
                'createDefaultTemplate',
                'jst',
                'compass',
                'connect:test',
                'qunit'
            ];

        if(!isConnected) {
            return grunt.task.run(testTasks);
        } else {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('connect:test'), 1);
            return grunt.task.run(testTasks);
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'jst',
        'compass:dist',
        'useminPrepare',
        'imagemin',
        'htmlmin',
        'cssmin',
        'copy:dist',
        'rev',
        'usemin',
        // 'qunit'
    ]);

    grunt.registerTask('default', [
        // 'jshint',
        // 'test',
        'build',
        'qunit',
        'blanket_qunit'
    ]);
};
