define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./templates/SignUpDialog.template.html",
    "dijit/Dialog",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/Form",
    "dojo/_base/array",
    '../store/PortalStore',
    "dojo/dom-form",
    "dijit/registry",
    "../common/MessageBar",
    "dojox/validate/web",
    "dojox/validate/check",
    "dojox/form/PasswordValidator",
    "dijit/form/ValidationTextBox"
],function(
    declare,
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
    MessageBar
){
    var SignUpDialog=declare( [_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container],{
        templateString:template,
        declaredClass:'SignUpDialog',

        constructor:function(args){
            declare.safeMixin(this,args);
        },
        postCreate:function(){
            var _t=this;
            this.msg_bar=new MessageBar(null,this.msg_bar);
            // TODO better way?
            this.verify_password.validator=function(value){
                return _t.password.getValue()==value;
            };
        },
        show:function(){
            this.dialog.show();
        },
        hide:function(){
            this.dialog.hide();
        },
        signUp:function(){
            var _t=this;
            if(this.userForm.validate()){
                var user=this.userForm.getValues();
                user.settings={};//TODO temp
                PortalStore.users.registerUser(user).then(function(user){
                    if(user){
                        _t.msg_bar.addMsg('success','signUp success',1000);
                    }
                },function(err){
                    _t.msg_bar.addMsg('error','signUp failed');
                });
            }
        },
        login:function(){
            this.hide();
            registry.byId('loginDialog').show();
        }

    });

    return new SignUpDialog();

});