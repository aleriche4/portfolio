module.exports = function(grunt){

    // grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks("grunt-ts");
    // grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");

    // grunt.loadNpmTasks('grunt-postcss');
    // grunt.loadNpmTasks('grunt-autoprefixer');
    //grunt.loadNpmTasks("grunt-modernizr");

    // const sass = require('node-sass');
    // const mozjpeg = require('imagemin-mozjpeg');
    // const imageminPngquant = require('imagemin-pngquant');
    // var creatives = grunt.file.expand({cwd: "src/"}, "*");
    // var environments = ["prod", "dev"];

    grunt.initConfig({

        ts: {
            default: {
                // tsconfig: true,
                tsconfig: './tsconfig.json'
                // src: ["**/*.ts", "!node_modules/**/*.ts"],
            },
            // options: {
            //     compile: true,                 // perform compilation. [true (default) | false]
            //     comments: false,               // same as !removeComments. [true | false (default)]
            //     target: 'es6',                 // target javascript language. [es3 | es5 (grunt-ts default) | es6]
            //     module: 'amd',                 // target javascript module style. [amd (default) | commonjs]
            //     sourceMap: true,               // generate a source map for every output js file. [true (default) | false]
            //     sourceRoot: '',                // where to locate TypeScript files. [(default) '' == source ts location]
            //     mapRoot: '',                   // where to locate .map.js files. [(default) '' == generated js location.]
            //     declaration: false,            // generate a declaration .d.ts file for every output js file. [true | false (default)]
            //     // htmlModuleTemplate: 'My.Module.<%= filename %>',    // Template for module name for generated ts from html files [(default) '<%= filename %>']
            //     htmlVarTemplate: '<%= ext %>',                      // Template for variable name used in generated ts from html files [(default) '<%= ext %>]
            //                                                         // Both html templates accept the ext and filename parameters.
            //     noImplicitAny: false,          // set to true to pass --noImplicitAny to the compiler. [true | false (default)]
            //     fast: "watch"
            // }
        },

        // ts: {
        //     default : {
        //       tsconfig: './tsconfig.json'
        //     }
        // },

        // browserify: {
        //     all: {
        //       src: "**/*.ts",
        //       dest: "dev/**/*.js",
        //       options: {
        //         plugin: ["tsify"],
        //       },
        //     },
        // },


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
                    cwd: 'src/samples',
                    src: ['*.html'],
                    dest: 'dev/samples',
                    filter: 'isFile'
                },
                // { 
                //     expand: true, 
                //     cwd: 'src',
                //     src: ['components/data/*.json'],
                //     dest: 'dev',
                //     filter: 'isFile'
                // },
                { 
                    expand: true, 
                    cwd: 'src/components',
                    src: ['*.js'], 
                    dest: 'dev/components',
                    filter: 'isFile'
                },
                // { 
                //     expand: true, 
                //     cwd: 'dev/components',
                //     src: ['*.js.map'], 
                //     dest: 'prod/components',
                //     filter: 'isFile'
                // },
                // { 
                //     expand: true, 
                //     cwd: 'src/components',
                //     src: ['*.ts'], 
                //     dest: 'dev/components',
                //     filter: 'isFile'
                // },
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
                    cwd: 'src/images', 
                    src: ['**/**/*'], 
                    dest: 'dev/images', 
                    filter: 'isFile'
                },
                {
                    expand: true, 
                    cwd: 'dev/images', 
                    src: ['**/**/*'], 
                    dest: 'prod/images', 
                    filter: 'isFile'
                }]
            }
        },

        // WATCH
        watch: {
            // options: {
            //     livereload: 9988
            // },
            src: {
                files: [
                    "src/*.html",
                    "src/**/*.js",
                    "src/**/*.ts",
                    "src/**/*.html",
                    "src/**/*.css",
                    "src/**/**/*.json"
                ],
                tasks: [/*"clean", "sass", "postcss:dist",*/ "copy", "ts" /*, "string-replace"*/]
            }
        },
        
        // CONCAT
        // concat: {
        //     options: {
        //         separator: ';',
        //     },
        //     dist: {
        //         src: 'src/components/jquery.js',
        //             // 'src/components/js/what-input.js',
        //             // 'src/components/js/foundation.js',
        //         dest: 'dev/components/jquery.js',
        //     },
        // },

        // ts: {
        //     // A specific target
        //     build: {
        //     // The source TypeScript files, http://gruntjs.com/configuring-tasks#files
        //     src: ["test/work/**/*.ts"],
        //     // The source html files, https://github.com/grunt-ts/grunt-ts#html-2-typescript-support   
        //     html: ["src/*.html"], 
        //     // If specified, generate this file that to can use for reference management
        //     reference: "./test/reference.ts",  
        //     // If specified, generate an out.js file which is the merged js file
        //     out: 'test/out.js',
        //     // If specified, the generate JavaScript files are placed here. Only works if out is not specified
        //     outDir: 'test/outputdirectory',
        //     // If specified, watches this directory for changes, and re-runs the current target
        //     watch: 'test',                     
        //     // Use to override the default options, http://gruntjs.com/configuring-tasks#options
        //     options: {     
        //         // 'es3' (default) | 'es5'
        //         target: 'es6',
        //         // 'amd' (default) | 'commonjs'    
        //         module: 'commonjs',
        //         // true (default) | false
        //         sourceMap: true,
        //         // true | false (default)
        //         declaration: false,
        //         // true (default) | false
        //         removeComments: true
        //         },
        //     },
        //     // Another target
        //     dist: {                               
        //         src: ["test/work/**/*.ts"],
        //         // Override the main options for this target
        //         options: {
        //             sourceMap: false,
        //         }
        //     },
        // },

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
        //             require('autoprefixer')(),
        //             require('cssnext')(),
        //             require('precss')()
        //         ]
        //     },
        //     dist: {
        //         src: 'src/components/main.css',
        //         dest: 'dev/components/main.css'
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
                    cwd: 'src/components',
                    src: ['*.css'],
                    dest: 'prod/components',
                    ext: '.css'
                }]
            }
        },

        // CLEAN
        clean: {
            build: {
              src: ['prod/**']
            // src: ['dev/**'],
            // dev: ['prod/**']
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
                'prod/components/portfolio.js': ['dev/components/portfolio.js'],
                // 'prod/components/portfolio.js.map': ['dev/components/portfolio.js.map']
                // expand: true,
                // cwd: 'dev/components',
                // src: ['*.js'],
                // dest: 'prod/components',
                // 'prod/components/*.min.js': ['dev/components/*.js'],
                // 'prod/components/js/*.min.js': ['dev/components/js/*.js']
              }
            }
        },

        htmlmin: {
            dist: {
              options: {
                removeComments: true,
                collapseWhitespace: true
              },
              files: [
                {
                    expand: true,
                    cwd: 'dev/',
                    src: ['*.html'],
                    dest: 'prod/',
                    ext: '.html'
                 },
                 {
                    expand: true,
                    cwd: 'dev/samples/',
                    src: ['*.html'],
                    dest: 'prod/samples/',
                    ext: '.html'
                 }
              ]
            }
            // }
            // dev: {
            //   files: {
            //     'prod/index.html': 'dev/index.html',
            //     'prod/resume.html': 'dev/resume.html',
            //     'prod/samples/*.html' : 'dev/samples/*.html'
            //   }
        }
        //   }
        // });
    });


    // grunt.registerTask("removeLivereload", "Remove livereload", function(){

    //     grunt.file.recurse("prod/", function(abspath, rootdir, subdir, filename){
    //         if ( filename === "index.html" ) {
    //             var index = grunt.file.read(abspath);
    //             index = index.replace(/<script src="\/\/localhost:[0-9]*\/livereload.js"><\/script>/, '');
    //             grunt.file.write(abspath, index);
    //         }
    //     });

    // });
    grunt.registerTask("default", [/*"browserify", */"watch", "ts"]);
    grunt.registerTask("prod", ["clean", "uglify", "cssmin", "htmlmin", "copy"/*, imagemin:dynamic", "removeLivereload"*/]);
    // grunt.registerTask("prod", ["watch", "ts"]);

};