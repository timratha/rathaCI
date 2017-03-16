
module.exports = function(grunt) {

    //TODO
    var packageName='portal-client-demo';
    var releaseName='0.1.2';

    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dojo');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('intern');
    grunt.loadNpmTasks('grunt-nodemailer');
    grunt.loadNpmTasks('grunt-search');

    var logfile = require('logfile-grunt');


    grunt.initConfig({
        dojo: {
            build: {
                options: {
                    load: 'build',
                    profile: './portal-client-demo.profile.js',
                    // Optional: Location to search package.json (Default: nothing)
                    packages:[
                        'src'
                    ]
                }
            },
            options: {
                dojo:'./libs/dojo/dojo.js', // Path to dojo.js file in dojo source
                action: 'release', // Optional: Build action, release, help. clean has been deprecated.
                cwd: './', // Directory to execute build within
                basePath: './'
            }
        },
        clean: {
            build: {
                src: ['./build/'+releaseName+'/'+packageName,'./build/'+releaseName+'/'+packageName+'.zip'],
                force:true
            },
            cleanLog:{
                src: ['./log/*', '!./log/testLog.log']
            }
        },
        compress: {
            build:{
                options: {
                    archive: './build/'+releaseName+'/'+packageName+'.zip'
                },
                files: [
                    {cwd:'./build/'+releaseName+'/'+packageName,expand: true,src: ['./**'], dest: './', filter: 'isFile'},
                ]
            }
        },
        intern: {
            functionalTest: {
                options: {
                    runType: 'runner', // defaults to 'client'
                    config: 'tests/intern',
                    reporters: ['combined']
                    //    { id: 'html', filename: 'report.html' }
                    //]
                    //suites: [ 'tests/unit/all' ]
                }
            }
            //anotherReleaseTarget: { /* … */ }
        },
        nodemailer: {
            testBB:{
                options: {
                    transport: {
                        type: "SMTP",
                        options: {
                            //debug: true,
                            host: 'mail.kisters.de',
                            secureConnection: false, // use SSL
                            port: 25
                        }
                    },
                    recipients: [
                        {name: "RATHA CI", email: "timratha@gmail.com"},
                        //{name: "Marko", email: "Marko.Vukadinovic@kisters.de"}
                    ],
                    message: {
                        from: 'gisweb-alert@kisters.de',
                        //to: 'Ratha.Tim@kisters.de',
                        subject: 'Portal Client Demo: Error test before build.',
                        text: 'Error test before build.',
                        attachments : [{   // file on disk as an attachment
                            filename: 'testLog.log',
                            filePath: './log/testLog.log', // stream this file
                        }]
                    },
                }
            },
            test: {
                options: {
                    transport: {
                        type: "SMTP",
                        options: {
                            //debug: true,
                            host: 'mail.kisters.de',
                            secureConnection: false, // use SSL
                            port: 25
                        }
                    },
                    recipients: [
                        {name: "RATHA CI", email: "timratha@gmail.com"},
                        //{name: "Marko", email: "Marko.Vukadinovic@kisters.de"}
                    ],
                    message: {
                        from: 'gisweb-alert@kisters.de',
                        //to: 'Ratha.Tim@kisters.de',
                        subject: 'Portal Client Demo: Error during test.',
                        text: 'Error during test.',
                        attachments: [{   // file on disk as an attachment
                            filename: 'testLog.log',
                            filePath: './log/testLog.log', // stream this file
                        }]
                    },
                }
            },
            testAB: {
                options: {
                    transport: {
                        type: "SMTP",
                        options: {
                            //debug: true,
                            host: 'mail.kisters.de',
                            secureConnection: false, // use SSL
                            port: 25
                        }
                    },
                    recipients: [
                        {name: "RATHA CI", email: "timratha@gmail.com"},
                        //{name: "Marko", email: "Marko.Vukadinovic@kisters.de"}
                    ],
                    message: {
                        from: 'gisweb-alert@kisters.de',
                        //to: 'Ratha.Tim@kisters.de',
                        subject: 'Portal Client Demo: Error test after build.',
                        text: 'Error test after build',
                        attachments: [{   // file on disk as an attachment
                            filename: 'testLog.log',
                            filePath: './log/testLog.log', // stream this file
                        }]
                    },
                }
            }
        },
        search: {
            ifFail: {
                files: {
                    src: ["./log/testLog.log"]
                },
                options: {
                    searchString: "FAIL",
                    logFormat: "console",
                    //failOnMatch: true,
                    //onMatch: function(match) {
                    //    // called when a match is made. The parameter is an object of the
                    //    // following structure: { file: "", line: X, match: "" }
                    //    //console.log(match);
                    //    //return false;
                    //},
                    //logFile: "./log/fail.json",
                    //logFormat: "json"
                }
            }
        }

    });
    grunt.registerTask('developing', ['watch']);

    grunt.registerTask('sendmail', "Sends intern result report html",function(){
        var nodemailer=require("nodemailer");

        grunt.task.run('nodemailer:test')
        //smtpTransport.sendMail(mailOpts, function(){
        //
        //    if(err) console.log(err);
        //});
    });

    grunt.registerTask('build', ['clean:build','dojo:build','compress:build']);

    grunt.task.registerTask('testLog', 'Create a new release build log files on each run.', function() {
        logfile(grunt, { filePath: './log/testLog.log', clearLogFile: true });
    });

    grunt.option('force', true);
    grunt.registerTask('runTest', 'Do something interesting.', ['testLog','clean:cleanLog', 'intern:functionalTest', 'search:ifFail']);
};