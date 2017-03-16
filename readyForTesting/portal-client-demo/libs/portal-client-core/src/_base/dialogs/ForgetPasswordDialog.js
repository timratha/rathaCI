define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./templates/ForgetPasswordDialog.template.html",
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
    "dojox/validate/web",
    "dojox/validate/check"
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
    on
){
    var ForgetPasswordDialog=declare( [_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container],{
        templateString:template,
        declaredClass:'ForgetPasswordDialog',

        constructor:function(args){
            declare.safeMixin(this,args);
        },
        postCreate:function(){
            var _t=this;
            _t.msg_bar=new MessageBar(null,_t.msg_bar);
        },
        show:function(){
            this.dialog.show();
        },
        hide:function(){
            this.dialog.hide();
        },
        sendEmail:function(){
            var _t=this;
            if(this.userForm.validate()){
                PortalStore.users.resetTokens( this.userForm.getValues()).then(function(user){
                    if(user){
                        _t.hide();
                    }
                },function(err){
                    _t.msg_bar.addMsg('error',err.response.data.message);
                });
            }
        },
        cancel:function(){
            this.hide();
            registry.byId('loginDialog').show();
        }
    });
    var dialog=new ForgetPasswordDialog();

    // keep single instance mode.
    return dialog;

});