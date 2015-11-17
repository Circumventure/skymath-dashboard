module.exports = function(grunt) {
    console.log('DIRNAME: ', __dirname);
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            options: {
                transform: [ require('grunt-react').browserify ],
                browserifyOptions: {
                    paths: [
                        'node_modules',
                        'src/skymath-common/components',
                        'src/skymath-common/components/mixins',
                        'src/skymath-common/vendor',
                        'src/components',
                        'src/components/mixins',
                        'src/vendor'
                    ]
                }
            },
            client: {
                src: [
                    './src/components/App.js'
                ],
                dest: 'build/js/app.js'
            }
        },

        sass: {
            dist: {
                files: {
                    './build/style/common.css' : './src/skymath-common/style/common.scss',
                    './build/style/style.css' : './src/style/style.scss',
                    './build/style/jquery/jquery-ui.min.css' : './src/skymath-common/style/jquery/jquery-ui.min.scss'
                }
            }
        },

        watch: {
            files: [
                './src/**/*',
                'index.html'
            ],
            tasks: ['browserify', 'sass', 'copy']
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: './src/skymath-common/style',
                        src: ['assets/*','jquery/*'],
                        dest: './build/style/'
                    },
                    {
                        expand: true,
                        cwd: './src',
                        src: 'vendor/*',
                        dest: './build/js/'
                    },
                    {
                        expand: true,
                        cwd: './src/img',
                        src: '*',
                        dest: './build/img/'
                    }
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', [
        'browserify',
        'sass',
        'copy'
    ]);
};
