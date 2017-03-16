define([
    'dojo/hash',
    'dijit/ConfirmDialog',
    '../store/PortalStore',
    "dojo/on",
    'dojo/i18n!./nls/LogoutDialog',
    './SignUpDialog',
    './ForgetPasswordDialog'
],function(hash, ConfirmDialog, PortalStore,
    on,nls){
    var logoutDialog = new ConfirmDialog ({
        title: nls.logout,
        content: "<div style='text-align: center;margin: 10px 0px;'>"+nls.remindMsg+"</div>"
    });

    on(logoutDialog,'execute',function(){
        PortalStore.users.logout().then(function(){
            location.href=location.href.substr(0,location.href.indexOf('#'));
        });
    });

    return logoutDialog;

});