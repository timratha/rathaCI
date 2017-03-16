define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./templates/ResetPasswdByTokenDialog.template.html",
    "dijit/Dialog",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/Form",
    "dojo/_base/array",
    '../store/PortalStore',
    "dojo/dom-form",
    "dijit/registry",
    "../common/MessageBar",
    "dojo/io-query",
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
    MessageBar,
    ioQuery
){
    var ResetPasswdByTokenDialog=declare( [_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container],{
        templateString:template,
        declaredClass:'ResetPasswdByTokenDialog',

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
        resetPassword:function(){
            var _t=this;
            var token=ioQuery.queryToObject(location.search.substring(1)).token;
            if(this.userForm.validate()){
                var user=this.userForm.getValues();
                PortalStore.users.resetPasswordByToken(token,user).then(function(user){
                    if(user){
                        _t.msg_bar.addMsg('success','reset password success',1000);
                    }
                },function(err){
                    _t.msg_bar.addMsg('error','reset password failed');
                });
            }
        },
        home:function(){
            this.hide();
            location.href=location.href.substr(0,location.href.indexOf('?'));
        }

    });

    return new ResetPasswdByTokenDialog();

});