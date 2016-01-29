'use strict';

module.exports = function(grunt) {
	grunt.config.init({
		watch: {
			css: {
				files: ['public/core/stylesheets/*.styl'],
				tasks: ['build']
			},
			js: {
				files: ['public/**/*.js'],
				tasks: ['build']
			}
		},

		uglify: {
			options: {
				mangle: false
			},
			my_target: {
				files: {
					'build/js/scripts.min.js': ['test.js']
				}
			}
		},

		concurrent: {
			target: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		nodemon: {
			dev: {
				script: 'server.js'
			}
		},

		cssmin: {
			target: {
				files: {
					'build/stylesheets/styles.min.css': ['public/core/stylesheets/main.css']
				}
			}
		},

		stylus: {
			all: {
				files: {
					'public/core/stylesheets/main.css': 'public/core/stylesheets/*.styl'
				}
			}
		},

		concat: {
			dist: {
				src: ['public/youtube/keys.js', 'public/layout.js', 'public/**/*.js'],
				dest: 'test.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['stylus', 'cssmin', 'concat', 'uglify']);
	grunt.registerTask('default', ['concurrent']);

};
