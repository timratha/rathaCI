define([
    'dijit/form/ValidationTextBox',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./templates/LoginDialog.template.html",
    "dijit/Dialog",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/Form",
    "dojo/_base/array",
    '../store/PortalStore',
    "dojo/dom-form",
    "dijit/registry",
    "../common/MessageBar",
    "dojo/on",
    "dojo/i18n!./nls/login",
    './SignUpDialog',
    './ForgetPasswordDialog',
    'xstyle/css!./css/LoginDialog.css'
],function(ValidationTextBox, declare,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _Container,
    template,
    Dialog,
    TextBox,
    Button,
    Form,
    array,
    PortalStore,
    domForm,
    registry,
    MessageBar,
    on,
    nls
){
    var LoginDialog=declare( [_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container],{
        declaredClass:'LoginDialog',
        templateString:template,
        constructor:function(args){
            declare.safeMixin(this,args);
            this.nls = nls;
        },
        postCreate:function(){
            var _t=this;
            _t.msg_bar=new MessageBar(null,_t.msg_bar);
            on(_t.password,'keypress',function(event){
                if (event.keyCode == dojo.keys.ENTER) {
                    _t.login();
                }
            });
            on(_t.forget_password_btn,'click',function(){
                _t.hide();
                registry.byId('forgetPasswordDialog').show();
            });
        },
        show:function(){
            this.dialog.show();
        },
        hide:function(){
            this.dialog.hide();
        },
        login:function(){
            var _t=this;
            if(this.userForm.validate()){
                PortalStore.users.login( this.userForm.getValues()).then(function(user){
                    if(user){
                        _t.hide();
                        _t.afterLogin();
                    }
                },function(err){
                    _t.msg_bar.addMsg('error','login failed');
                });
            }
        },
        signUp:function(){
            this.hide();
            registry.byId('signUpDialog').show();
        },
        afterLogin:function(){
            location.reload();
        },
        loginWithUser:function(user){
            var _t=this;
            PortalStore.users.login(user).then(function(user){
                if(user){
                    _t.hide();
                    _t.afterLogin();
                }
            });
        }
    });

    return LoginDialog;

});