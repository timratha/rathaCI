//summary:  builtin UserSpace app.
define([
    'dojo/i18n!./nls/Models',
    'dojo/_base/declare',
    '../views/UserManagementView',
    '../views/DashboardManagement',
    '../views/DashboardFactoryView',
    '../views/UserInfoView',
    '../views/messagingSystem/MessagingSystem',
    'dojo/_base/array',
    '../_base/store/PortalStore',
    '../_base/common/PortalHashHelper',
    '../_base/viewWrappers/DashboardWrapper',
    '../_base/common/Application'],function(nls,declare, UserManagementView, DashboardManagement, DashboardFactoryView, UserInfoView, MessagingSystem, array, PortalStore, PortalHashHelper, DashboardWrapper, Application){
    return {
        getUserSpace:function(){
            var userspace = {
                iconClass:'fa fa-user',
                "localDataId":'userspace',//TODO temp solution for missing id to save local data.
                "key": "userspace",
                "label": nls['UserSpace'],
                packageName:'userspace',
                version:'0.0.1',
                creationTime:'2015-11-27',
                menu:{
                    "position": "left",
                    "menuSize": "responsive",
                    "items": [ //TODO later will provide nls solution for labels of menu or config.
                        {
                            "key": "userManagement",
                            "iconClass": "fa fa-users",
                            "label": nls.userManagement
                        },
                        {
                            "key": "userInfo",
                            "iconClass": "fa fa-user",
                            "label": nls.myProfile
                        },
                        {
                            "key": 'messagingSystem',
                            "label": nls.messages,
                            "iconClass": "fa fa-inbox",
                            "permissionKeys": ["portal-client-core.messages"]
                        },
                        {
                            "key": "Dashboards",
                            "label": "Dashboards",
                            "permissionKeys": ["core.config.dashboard"],
                            "iconClass": "fa fa-th",
                            "items":[

                                PortalStore.dashboards,
                                {
                                    key: 'DashboardManagement',
                                    "label": nls.dashboardPreferences,
                                    "iconClass": "fa fa-cog"
                                }
                            ]
                        }
                    ]
                },
                "views": [
                    {
                        key: 'userInfo',
                        model:{
                            viewType: UserInfoView
                        }
                    }
                ]
            };

//remove after separate userspace

            if(PortalStore.users.checkPermission( "portal-client-core.messages")){
                userspace.views.push({
                        key: 'messagingSystem',
                        model:{
                            viewType: MessagingSystem
                        }
                });
            }
            if(PortalStore.users.checkPermission( "portal-client-core.userManagement")){

                            userspace.views.push({
                                    key: 'userManagement',
                                    model:{
                                        viewType: UserManagementView
                                    }
                            });
                //console.log("Ratha Tim:"+ userspace.views.model)
                        }

            if(PortalStore.users.checkPermission("core.config.dashboard")){
                userspace.views.push({
                    key: 'Dashboards',
                        model:{
                            viewType: DashboardFactoryView
                        }
                });

                userspace.views.push({
                        key: 'DashboardManagement',
                        model:{
                            viewType: DashboardManagement
                        }
                });
                    }
            console.debug('userspace model:',userspace);
            return userspace;
        }
    };
})