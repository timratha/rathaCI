define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./templates/appHeader.templates.html",
    "dojo/dom-class",
    "dijit/ConfirmDialog",
    "dojo/on",
    "dojo/hash",
    "dojo/_base/array",
    "dijit/MenuItem",
    '../store/PortalStore',
    "../nav/DashboardSelector",
    "../nav/ApplicationSelector",
    "dijit/DropDownMenu",
    "dijit/MenuSeparator",
    "dojo/domReady!"
],function(
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _Container,
    template,
    domClass,
    ConfirmDialog,
    on,
    hash,
    array,
    MenuItem,
    PortalStore,
    DashboardSelector,
    ApplicationSelector
){
    var logoutDialog = new ConfirmDialog ({
        title: "LogOut",
        content: "<div style='text-align: center;margin: 10px 0px;'>Are you sure ?</div>"
    });

    on(logoutDialog,'execute',function(){
        PortalStore.users.logout().then(function(){
            location.reload();
        });
    });

    return declare( [_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container],{
        templateString:template,
        declaredClass:"appHeader",
        postCreate:function(){
            this.inherited(arguments);
            this._createUserInfoMenuItems();
            new DashboardSelector({},this.dashboards).startup();
            new ApplicationSelector({appLabel:this.appLabel,key:this.app.config.key},this.applications).startup();

        },
        startup:function(){
            // put api access in startup will be better.
            this.inherited(arguments);
            this._fetchUsername();

        },
        showNavToggle:function(flag){
            if(flag){
                domClass.remove(this.nav_bar_toggle,'hide');
            }else{
                domClass.add(this.nav_bar_toggle,'hide');
            }
        },
        toggleNavBar:function(){
            this.app.nav_bar.toggleVisible();
        },

        _createUserInfoMenuItems:function(){
            var _t=this;
            this.messaging_system_menu.onClick=function(){

                hash('#messagingSystem');
            };
            this.user_profile_menu.onClick=function(){
                hash('#userInfo');
            };
            this.user_dashboards_menu.onClick=function(){
                hash('#DashboardManagement');
            };


            this.logout_menu.onClick=function(){
                logoutDialog.show();
            }
        },
        _fetchUsername:function(){
            var _t=this;
            PortalStore.users.getCurrentUser().then(function(user){
                if(user){
                    _t.user_name.innerHTML=user.userName;
                }
            });
        }
    });

});