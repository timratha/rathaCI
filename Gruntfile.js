module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-task-interval');
	//grunt.loadTasks('./../portal-client-demo/');


	grunt.initConfig({
		// import gruntfile from demo project;
		/*connect: {
			server: {
			  options: {
				port: 3001,
				base: 'www-root',
				hostname: 'vm-webdev-4',
				keepalive: true,
				middleware: [
				function myMiddleware(req, res, next) {
					if (req.url == '/CI'){
						console.log(req.body);
						grunt.task.run("open")
						res.end('Hello, world!');
					}else{
						res.end('NOPE!');
					}
				  }
				],
			  }
			}
		},*/
		open : {
			devTest : {
				path: 'http://localhost/dev/giswebgroup/portal-client-demo/node_modules/intern/client.html?config=test/intern'
			}
		},
		shell: {
			gitpull: {
				command: 'git pull http://gitlab-srv.kisters.de:9000/giswebgroup/portal-client-demo.git',
				options: {
					stderr: false,
					execOptions: {
						//cwd: '../<%= folder %>/'
						cwd: '../portal-client-demo/'
					}
				}
			}
		},
		'task-interval': {
			your_target: {
			  options: {
				taskIntervals: [
				  {interval: 1000*60*2, tasks: ['shell']}
				]
			  }
			}
		},
		watch: {
			scripts: {
				files: ['./../portal-client-demo/.git/index'],
				tasks: ['open'],
				options: {
				  spawn: false,
				},
			  },
			},
	});

   //  grunt.registerTask('portal-core-demo', ['shell:gitpull'/*,'test','devCopy','build','testBuild','copyTest'*/]);
   
   
	grunt.registerTask('dosomething', ['task-interval','watch']);
	
    grunt.registerTask('portal-client-demo',  function() {
		var path = 'portal-client-demo'
		grunt.config.set('folder', path);
		grunt.config.set('repository', 'giswebgroup/portal-client-demo');
		
		//grunt.task.run(watch);
		grunt.task.run('watch');
		grunt.task.run('task-interval')
		//console.log(grunt.config.get('repository'));
		
		
		//grunt.task.run('clean:build');
	  });
	  	  
	grunt.registerTask('portal-client-core',  function() {
		grunt.config.set('src', 'portal-client-core');
		grunt.task.run('shell');
	  });

	
};