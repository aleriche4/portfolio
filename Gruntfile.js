module.exports = function(grunt){

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-postcss');
    // grunt.loadNpmTasks('grunt-autoprefixer');
    //grunt.loadNpmTasks("grunt-modernizr");

    // const sass = require('node-sass');
    // const mozjpeg = require('imagemin-mozjpeg');
    // const imageminPngquant = require('imagemin-pngquant');
    // var creatives = grunt.file.expand({cwd: "src/"}, "*");
    // var environments = ["prod", "dev"];

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // REPLACE
         config: {
                src: 'dev/*.html',
                dist: 'prod/'
        },
        'string-replace': {
            inline: {
                files: {
                    'dest/': 'prod',
                },
                options: {
                    replacements: [
                        // place files inline example
                        {
                            pattern: '<script src="components/main.css"></script>',
                            replacement: '<script><%= grunt.file.write("components/main.css") %></script>'
                        }
                    ]
                }
            }
        },
        
        // COPY
        copy: {
            static_mappings: {
                 files: [{ 
                    expand: true, 
                    cwd: 'src',
                    src: ['*.html'],
                    dest: 'dev',
                    filter: 'isFile'
                },
                { 
                    expand: true, 
                    cwd: 'src/components',
                    src: ['*.js'], 
                    dest: 'dev/components',
                    filter: 'isFile'
                },
                { 
                    expand: true, 
                    cwd: 'src/components',
                    src: ['*.css'], 
                    dest: 'dev/components',
                    filter: 'isFile'
                }
            ] 
            },
            dynamic_mappings: {
                files: [{
                    expand: true, 
                    cwd: 'src/components/images', 
                    src: ['**/**/*'], 
                    dest: 'dev/components/images', 
                    filter: 'isFile'
                }]
            }
        },

        // WATCH
        watch: {
            options: {
                livereload: 9988
            },
            src: {
                files: [
                    "src/**/*.js",
                    "src/*.html",
                    // "src/**/*.scss",
                    "src/**/*.css"
                ],
                tasks: ["clean", "concat", /*"sass",*/ "postcss:dist", "copy"/*, "string-replace"*/]
            }
        },
        
        // CONCAT
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'src/components/jquery.js',
                    // 'src/components/js/what-input.js',
                    // 'src/components/js/foundation.js',
                ],
                dest: 'dev/components/jquery.js',
            },
        },

        // MODERNIZR
        // modernizr: {
        //     src: [
        //         'bower_components/modernizr/modernizr.js',
        //         'src/js/custom.modernizr.js'
        //     ],
        //     dest: 'dist/components/js/modernizr.js'
        // },

        // IMAGEMIN
        // imagemin: {
        //     dynamic: {
        //         options: {
        //             optimizationLevel: 3,
        //             svgoPlugins: [{removeViewBox: false}],
        //             use: [mozjpeg(),imageminPngquant()] // Example plugin usage
        //         },
        //         files: [{
        //             expand: true,
        //             cwd: 'dev/',
        //             src: ['**/*.{png,jpg,gif}'],
        //             dest: 'prod'
        //         }]
        //     }
        // },

        // SASS
        // sass: {
        //     dev: {
        //         options: {
        //             style: "expanded",
        //             loadPath: ['node_modules/foundation-sites/scss']
        //         },
        //         files: {
        //             "dev/components/css/styles.css": "src/components/styles.scss"
        //         }
        //     }
        // },

        // AUTOPREFIXER CSS
        // postcss: {
        //     options: {
        //         map: true,
        //         processors: [
        //             require('autoprefixer')
        //         ]
        //     },
        //     dist: {
        //         cwd: 'dev/components/css',
        //         src: ['*.css'],
        //     }
        // },

        // CSSMIN
        cssmin: {
            options: {
                keepBreaks: true,
                keepSpecialComments: '*',
                aggressiveMerging: false,
                advanced: false,
                mediaMerging: false,
                shorthandCompacting: false
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'dev/components/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'prod/components/css',
                    ext: '.min.css'
                }]
            }
        },

        // CLEAN
        clean: {
            build: {
            //   src: ['prod/**']
            src: ['dev/**']
            }
        },

        // UGLIFY
        uglify: {
            options: {
              compress: {
                drop_console: true
              }
            },
            my_target: {
              files: {
                // expand: true,
                // cwd: 'dev/components/js',
                // src: ['*.js'],
                // dest: 'prod/components/js',
                'prod/components/main.min.js': ['dev/components/main.js'],
                //'prod/components/js/*.min.js': ['dev/components/js/*.js']
              }
            }
        }
    });

    grunt.registerTask("removeLivereload", "Remove livereload", function(){

        grunt.file.recurse("prod/", function(abspath, rootdir, subdir, filename){
            if ( filename === "index.html" ) {
                var index = grunt.file.read(abspath);
                index = index.replace(/<script src="\/\/localhost:[0-9]*\/livereload.js"><\/script>/, '');
                grunt.file.write(abspath, index);
            }
        });

    });
    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("prod", ["clean", "uglify", "cssmin", /*"imagemin:dynamic",*/ "removeLivereload"]);

};