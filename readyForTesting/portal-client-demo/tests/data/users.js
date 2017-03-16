define([],function(){
  return {
    PortalAdmin:{
       "status": "active",
       "settings": {
       },
       "image": null,
       "timeZone": null,
       "sessionTimeout": 1800,
       "message": null,
       "userRoles": [
         {
           "id": "5C4FC02D-A728-4719-9B6A-04659803FD26",
           "description": null,
           "name": "PortalAdmin"
         }
       ],
       "email": "portaladmin@kisters.de",
       "address": null,
       "editTime": "2015-07-06T11:41:48.610+08:00",
       "userName": "PortalAdmin",
       "creationTime": "2015-06-30T13:08:14.513+08:00",
       "metadata": {},
        "functionalPermissions": {
            'core.config.dashboard':4,
            'core.config.widget.dashboard':4,
            'portal-client-core.editProfile':4,
            'portal-client-core.userManagement':4,
            'portal-client-core.reportBugs':4,
            'portal-client-core.messages':4,
            'core.config.view.global':4,
            'portal-client-core.userTheme':4,
            'portal-client-core.userspace':4,
            'portal-client-core.changeLanguage':4,
            'portal-client-core.changeTimezone':4
        },
        password:'123'
    },
    basicUser:{
        "status": "active",
        "settings": {},
        "image": null,
        "timeZone": null,
        "sessionTimeout": 1800,
        "message": null,
        "userRoles": [
            {
                "id": "1D00C115-F4F3-4B9C-8445-E332B08E0542",
                "description": null,
                "name": "basicUser"
            }
        ],
        "email": "basicUser@kisters.de",
        "address": null,
        "editTime": "2015-08-14T15:23:46.353+08:00",
        "functionalPermissions": {
            'core.config.dashboard':4,
            'core.config.widget.dashboard':4,
            'portal-client-core.editProfile':4,
            'portal-client-core.reportBugs':4,
            'portal-client-core.messages':4
        },
        "userName": "Basic User",
        "creationTime": "2015-08-12T18:03:51.851+08:00",
        "metadata": {},
        password:'123'
    },
    guest:{

        "status": "active",
        "settings": {},
        "image": null,
        "timeZone": null,
        "sessionTimeout": 1800,
        "message": null,
        "userRoles": [
            {
                "id": "1D00C115-F4F3-4B9C-8445-E332B08E0542",
                "description": null,
                "name": "basicUser"
            }
        ],
        "email": "basicUser@kisters.de",
        "address": null,
        "editTime": "2015-08-14T15:23:46.353+08:00",
        "functionalPermissions": {
        },
        "userName": "Guest",
        "creationTime": "2015-08-12T18:03:51.851+08:00",
        "metadata": {},
        password:'123'
    }
  }
})