module.exports = function(grunt){

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-string-replace');
    // grunt.loadNpmTasks('grunt-postcss');
    // grunt.loadNpmTasks('grunt-autoprefixer');
    //grunt.loadNpmTasks("grunt-modernizr");

    const sass = require('node-sass');
    const mozjpeg = require('imagemin-mozjpeg');
    const imageminPngquant = require('imagemin-pngquant');
    // var creatives = grunt.file.expand({cwd: "src/"}, "*");
    // var environments = ["prod", "dev"];

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // REPLACE
        // config: {
        //         src: 'dev/*.html',
        //         dist: 'prod/'
        // },
        // 'string-replace': {
        //     inline: {
        //         files: {
        //             'dest/': 'prod',
        //         },
        //         options: {
        //             replacements: [
        //                 // place files inline example
        //                 {
        //                     pattern: '<script src="assets/css/style.min.css"></script>',
        //                     replacement: '<script><%= grunt.file.write("assets/css/style.min.css") %></script>'
        //                 }//,
        //                 // {
        //                 //     pattern: '<script src="assets/main.min.js"></script>',
        //                 //     replacement: '<script><%= grunt.file.read("assets/main.js") %></script>'
        //                 // }
        //             ]
        //         }
        //     }
        // },
        
        // COPY
        copy: {
            static_mappings: {
                 files: [{ 
                    expand: true, 
                    cwd: 'src/sarah',
                    src: ['index.html'],
                    dest: 'dev',
                    filter: 'isFile'
                },
                // { 
                //     expand: true, 
                //     cwd: 'src/sarah',
                //     src: ['*.html'], 
                //     dest: 'prod',
                //     filter: 'isFile'
                // },
                // { 
                //     expand: true, 
                //     cwd: 'src/sarah/assets/js',
                //     src: ['*.js'], 
                //     dest: 'dev/assets/js',
                //     filter: 'isFile'
                // },
                { 
                    expand: true, 
                    cwd: 'src/sarah/assets',
                    src: ['main.js'], 
                    dest: 'dev/assets',
                    filter: 'isFile'
                },
                // { 
                //     expand: true, 
                //     cwd: 'dev/assets/js',
                //     src: ['*.js'], 
                //     dest: 'prod/assets/js',
                //     filter: 'isFile'
                // },
                { 
                    expand: true, 
                    cwd: 'src/sarah/assets/sass',
                    src: ['*.css'], 
                    dest: 'dev/assets/css',
                    filter: 'isFile'
                }
            ] 
            },
            dynamic_mappings: {
                files: [{
                    expand: true, 
                    cwd: 'src/sarah/images', 
                    src: ['**/*'], 
                    dest: 'dev/images', 
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
                    "src/**/**/*.js",
                    "src/**/*.html",
                    "src/**/**/**/*.scss",
                    "src/**/**/**/*.css"
                ],
                tasks: ["clean", "concat", "sass", /*"postcss:dist",*/ "copy"/*, "string-replace"*/]
            }
        },
        
        // CONCAT
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'src/sarah/assets/js/jquery.js',
                    'src/sarah/assets/js/what-input.js',
                    'src/sarah/assets/js/foundation.js',
                ],
                dest: 'dev/assets/js/foundation.js',
            },
        },

        // MODERNIZR
        // modernizr: {
        //     src: [
        //         'bower_components/modernizr/modernizr.js',
        //         'src/js/custom.modernizr.js'
        //     ],
        //     dest: 'dist/assets/js/modernizr.js'
        // },

        // IMAGEMIN
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [mozjpeg(),imageminPngquant()] // Example plugin usage
                },
                files: [{
                    expand: true,
                    cwd: 'dev/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'prod'
                }]
            }
        },

        // SASS
        sass: {
            dev: {
                options: {
                    style: "expanded",
                    loadPath: ['node_modules/foundation-sites/scss']
                },
                files: {
                    "dev/assets/css/styles.css": "src/sarah/assets/sass/styles.scss"
                }
            }
        },

        // AUTOPREFIXER CSS
        // postcss: {
        //     options: {
        //         map: true,
        //         processors: [
        //             require('autoprefixer')
        //         ]
        //     },
        //     dist: {
        //         cwd: 'dev/assets/css',
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
                    cwd: 'dev/assets/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'prod/assets/css',
                    ext: '.min.css'
                }]
            }
        },

        // CLEAN
        clean: {
            build: {
            //   src: ['prod/sarah/**']
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
                // cwd: 'dev/assets/js',
                // src: ['*.js'],
                // dest: 'prod/assets/js',
                'prod/assets/main.min.js': ['dev/assets/main.js'],
                //'prod/assets/js/*.min.js': ['dev/assets/js/*.js']
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
    grunt.registerTask("prod", ["clean", "uglify", "cssmin", "imagemin:dynamic", "removeLivereload"]);

};