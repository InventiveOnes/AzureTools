module.exports = function(grunt) {
var nwjsify = require('nwjs-browserify');
    grunt.initConfig({
        watch: {
            build: {
                files: ['./app/app.js'],
                tasks: ['browserify'],
                options: {
                    alias: {
                        'net': './libs/net-chromify/index.js',
                    }
                }
            }
        },
        browserify: {
            dist: {
                src: './app/app.js',
                dest: './app/bundle.js',
                transform: [nwjsify /** or nwjsify.with('_require') **/],
                options: {
                    alias: {
                        'jquery': 'jquery-browserify',
                        'colReorder': './libs/datatables-colreorder',
                        'colResize': './libs/colResize/dataTables.colResize',
                        'colVis': 'drmonty-datatables-colvis',
                        'dataTablesSelect' : './libs/select/js/dataTables.select',
                        'ui-grid' : './app/content/js/ui-grid.min',

                        'util': './libs/net-chromify/node_modules/util/util',
                        'events': './libs/net-chromify/node_modules/events/events',
                        'buffer': './libs/net-chromify/node_modules/buffer/index',
                        'crypto': './node_modules/browserify/node_modules/crypto-browserify/index',

                        'freelist': './libs/freelist-chromify',
                        'fs': './libs/http-parser-js/fs',
                        'http_parser': './libs/http-parser-js/http-parser',
                        'http': './libs/http-chromify/index',
                        'net': './libs/net-chromify/index',
                        'string_decoder': './libs/string_decoder-chromify/index.js',
                    },
                    debug: true
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', 'build', ['browserify']);
};