// TODO name just for temp, need change later.
define([
    'dojo/topic',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./templates/ResetPasswordDialog.template.html",
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
],function(topic, declare,
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
    var ResetPasswordDialog=declare( [_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container],{
        templateString:template,
        declaredClass:'ResetPasswordDialog',

        constructor:function(args){
            declare.safeMixin(this,args);
        },
        postCreate:function(){
            var _t=this;
            this.msg_bar=new MessageBar(null,this.msg_bar);
            // TODO better way?

            //Password must include: Minimum 8 characters at least 1 Alphabet, 1 Number or 1 Special Character:
            this.password.set({
                pattern: "^(?=.*[A-Za-z])(?=.*[$@$!%*#?&])[A-Za-z$@$!%*#?&]{8,}$|^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$|^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$",
                invalidMessage: "Kennwortrichtlinie: Min 8 Zeichen mit Ziffer oder Sonderzeichen" //TODO add in nls file
            });

            this.verify_password.set({
                invalidMessage: "Passwörter nicht gleich", //TODO add in nls file
                validator: function(value) {
                    return _t.password.getValue() === value;
                }
            });
        },
        show:function(){
            this.userForm.reset();
            this.dialog.show();
        },
        hide:function(){
            this.dialog.hide();
        },
        resetPassword:function(){
            var _t=this;
            var token=ioQuery.queryToObject(location.search.substring(1)).token;
            if(this.userForm.validate()){
                var values=this.userForm.getValues();
                PortalStore.users.resetPassword(values).then(function(){
                    topic.publish('portal/systemMessage',{
                        type:'success',
                        content:'Your password has been reset successfully!'
                    });
                    _t.hide();
                },function(err){
                    //console.log(err)
                    topic.publish('portal/systemMessage',{
                        type:'error',
                        content:'User does not exist or missing/invalid old password.'
                    });
                });
            }
        },
        cancel:function(){
            this.hide();
        }

    });

    return new ResetPasswordDialog();

});