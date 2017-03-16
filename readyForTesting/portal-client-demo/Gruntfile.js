
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
    grunt.loadNpmTasks('grunt-if');
    grunt.loadNpmTasks('grunt-contrib-copy');


    var logfile = require('logfile-grunt');
    var testFailCount = null;
    var mailTransport = {
        type: "SMTP",
        options: {
            //debug: true,
            host: 'mail.kisters.de',
            secureConnection: false, // use SSL
            port: 25
        }
    };
    var mailRecipients = [{name: "RATHA CI", email: "timratha@gmail.com"},{name: "Marko", email: "Marko.Vukadinovic@kisters.de"}];

    grunt.initConfig({
        intern: {
            unitTest: {
                options: {
                    runType: 'runner', // defaults to 'client'
                    config: 'tests/intern',
                    reporters: ['console'],
                }
            }
        },
        stylus: {
            src: {
                options: {
                    compress: false,
                },
                files: [{
                    expand: true,
                    src: ['src/**/*.styl'],
                    filter: 'isFile',
                    ext: '.css'
                }]
            }
        },
        nodemailer: {
            errorTestBBMail:{
                options: {
                    transport: mailTransport,
                    recipients: mailRecipients,
                    message: {
                        from: 'gisweb-alert@kisters.de',
                        subject: 'Portal Client Demo: Error test before build.',
                        text: 'Check the attachment for detail error.',
                        attachments : [{   // file on disk as an attachment
                            filename: 'testLog.log',
                            filePath: './log/testLog.log', // stream this file
                        }]
                    }
                }
            },
            buildMail: {
                options: {
                    transport: mailTransport,
                    recipients: mailRecipients,
                    message: {
                        from: 'gisweb-alert@kisters.de',
                        subject: 'Portal Client Demo: Error during build.',
                        text: 'Check the attachment for detail error.',
                        attachments: [{   // file on disk as an attachment
                            filename: 'testLog.log',
                            filePath: './log/testLog.log', // stream this file
                        }]
                    }
                }
            },
            testABMail: {
                options: {
                    transport: mailTransport,
                    recipients: mailRecipients,
                    message: {
                        from: 'gisweb-alert@kisters.de',
                        subject: 'Portal Client Demo: Error test after build.',
                        text: 'Check the attachment for detail error',
                        attachments: [{   // file on disk as an attachment
                            filename: 'testLog.log',
                            filePath: './log/testLog.log', // stream this file
                        }]
                    }
                }
            },
            deployForTestingMail: {
                options: {
                    transport: mailTransport,
                    recipients: mailRecipients,
                    message: {
                        from: 'gisweb-alert@kisters.de',
                        subject: 'Portal Client Demo: Error during deploy project to Test Server.',
                        text: 'Error test after build',
                        attachments: [{   // file on disk as an attachment
                            filename: 'testLog.log',
                            filePath: './log/testLog.log', // stream this file
                        }]
                    }
                }
            },
        },
        search: {
            searchTestFail: {
                files: {
                    src: ["./log/testLog.log"]
                },
                options: {
                    searchString: "FAIL",
                    logFormat: "console",
                    //failOnMatch: true,
                    onMatch: function(match) {
                        testFailCount ++;},
                }
            }
        },
        if: {
            failTestBB: {
                options: {
                    test: function(){ return testFailCount; }
                },
                ifTrue: [ 'nodemailer:errorTestBB' ]
            },
            failBuild: {
                options: {
                    test: function(){ return testFailCount; }
                },
                ifTrue: [ 'nodemailer:errorTestBB' ]
            },
            failTestAB: {
                options: {
                    test: function(){ return testFailCount; }
                },
                ifTrue: [ 'nodemailer:errorTestBB' ]
            },
            failDeployForTesting: {
                options: {
                    test: function(){ return testFailCount; }
                },
                ifTrue: [ 'nodemailer:errorTestBB' ]
            },
        },
        copy: {
            toTestServer: {
                expand: true,
                dest: '\\\\vm-webdev-4\\htdocs\\CI\\readyForTesting\\portal-client-demo',
                cwd: '../portal-client-demo',
                src: '**'
            },
        }
    });

    grunt.task.registerTask('createTestLog', 'Create a new release build log files on each run.', function() {
        logfile(grunt, { filePath: './log/testLog.log', clearLogFile: true });
    });


    grunt.option( 'force', true );
    grunt.registerTask('runTestBB', 'Run test before build.',['createTestLog', 'intern:unitTest', 'search:ifTestFail','if:failTestBB']);

    //grunt.registerTask('runBuild', ['build', 'sendemail:errorBuild']);
    //grunt.registerTask('runTestAB', ['testLog', 'sendemail:errorTestAB']);
    //grunt.registerTask('zipProject', ['build', 'sendemail:errorDuringZipProject']);
    grunt.registerTask('deployForTesting', 'Copy project to test server.', ['copy:toTestServer']);

};

