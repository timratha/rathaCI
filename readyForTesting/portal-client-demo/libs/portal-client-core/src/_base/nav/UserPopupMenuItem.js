define([
    '../dialogs/LogoutDialog',
    'dijit/MenuSeparator',
    '../common/PortalHashHelper',
    'dojo/window',
    'dojo/hash',
    'dojo/io-query',
    'dojo/topic',
    '../store/PortalStore',
    'dijit/MenuItem',
    'dijit/Menu',
    'dojo/text!./templates/UserPopupMenuItem.template.html',
    'dojo/_base/declare',
    'dijit/PopupMenuBarItem',
    '../dialogs/BugReportDialog',
    "dojo/i18n!./nls/UserPopupMenuItem"
],function(LogoutDialog,MenuSeparator, PortalHashHelper,window, hash, ioQuery, topic, PortalStore,MenuItem, Menu, template, declare, PopupMenuBarItem,BugReportDialog,nls){
    return declare([PopupMenuBarItem],{
        templateString:template,
        declaredClass:'UserPopupMenuItem',

        postCreate:function(){
            this.inherited(arguments);
            this._initMenus();
            this._fetchUsername();
        },
        _initMenus:function(){
            this.popup=new Menu();

            if(PortalStore.users.checkPermission('portal-client-core.userManagement')) {
                this.popup.addChild(new MenuItem({ iconClass: 'fa fa-users', label: nls.userManagement,onClick:function(){
                    PortalHashHelper.switchTo('userspace','userManagement');
                }}));
            }
            if(PortalStore.users.checkPermission('portal-client-core.editProfile')){
                this.popup.addChild(new MenuItem({ iconClass: 'fa fa-user', label: nls.myProfile,onClick:function(){
                    PortalHashHelper.switchTo('userspace','userInfo');
                }}));
            }

            if(PortalStore.users.checkPermission('core.config.dashboard')) {
                this.popup.addChild(new MenuItem({ iconClass: 'fa fa-th', label: nls.Dashboards,onClick:function(){
                    PortalHashHelper.switchTo('userspace','DashboardManagement');
                }}));
            }

            if(PortalStore.users.checkPermission('portal-client-core.reportBugs')){
                this.popup.addChild(new MenuItem({ iconClass: 'fa fa-bug', label: nls.BugReport,onClick:function(){
                    new BugReportDialog().showDialog();
                }}));
            }

            this.popup.addChild(new MenuSeparator());
            this.popup.addChild(new MenuItem({ iconClass: 'fa fa-power-off', label: nls.Logout,onClick:function(){
                LogoutDialog.show();
            }}));

        },
        _fetchUsername:function(){
            var _t=this;
            PortalStore.users.getCurrentUser().then(function(user){
                if(user){
                    _t.set('label',user.userName);
                }
            });
        }
    })
});