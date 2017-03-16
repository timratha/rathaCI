define([], function () {
    var module='portal-client-core';

    return {

        PermissionConfig:{
            //
            permissions:[
                {
                    "key":module+'.messages',
                    "module":module,
                    "description":"enable to use messages system"
                },
                //{
                //    "key":module+'.userManagement',
                //    "module":module,
                //    "description":"enable to manage Users"
                //},
                {
                    "key":module+'.editProfile',
                    "module":module,
                    "description":"enable to edit Profile"
                },
                {
                    "key":module+'.reportBugs',
                    "module":module,
                    "description":"enable to report Bugs"
                },
                {
                    "key":module+'.userTheme',
                    "module":module,
                    "description":"enable to set userTheme"
                },
                {
                    "key":module+'.config.views',
                    "module":module,
                    "description":"enable to set config views"
                },{
                    "key":module+'.resetPassword',
                    "module":module,
                    "description":"enable to reset password"
                },{
                    "key":module+'.changeTimezone',
                    "module":module,
                    "description":"enable to change Timezone"
                },{
                    "key":module+'.changeLanguage',
                    "module":module,
                    "description":"enable to change Language"
                },{
                    "key":module+'.userspace',
                    "module":module,
                    "description":"enable userspace application"
                }
            ],
            //pre-defined permission groups
            permissionGroups:[
                {
                    "key": module+'.all',
                    "description": 'all permissions',
                    "functionalPermissions": [
                        {
                            "key": module+'.messages',
                            "level":4
                        },
                        {
                            "key": module+'.editProfile',
                            "level":4
                        },
                        {
                            "key": module+'.reportBugs',
                            "level":4
                        },
                        //{
                        //    "key": module+'.userManagement',
                        //    "level":4
                        //}

                    ]
                }
            ]
        },
        widgetTypes: [
        ]
    }
});