module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-stylus');


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		stylus: {
			src: {
				options: {
					compress: false
				},
				files: [
					{
						expand: true,
						src: ['src/**/*.styl'],
						filter: 'isFile',
						ext: '.css'
					}, {
						expand: true,
						src: ['deploy/**/*.styl'],
						filter: 'isFile',
						ext: '.css'
					}
				]
			}
		}

	});


	grunt.registerTask();
};