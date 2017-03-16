define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container"
],function(
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _Container
){
//TODO use Notify
    var Alert= declare([_WidgetBase,_TemplatedMixin],{
        templateString:'<div class="alert alert-${type}">${msg} <i class="fa fa-close" style="float:right;" data-dojo-attach-event="click:close"></i></div>',
        close:function(){
            this.getParent().removeChild(this);
        }
    });

    return declare([_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container],{
        templateString:'<div></div>',
        addMsg:function(type,msg,autoClose){
            var alert=new Alert({
                type:type,
                msg:msg
            });
            var _t=this;
            _t.addChild(alert);
            if(autoClose){
                setTimeout(function(){
                    _t.removeChild(alert);
                },5000);
            }
        }
    })
});