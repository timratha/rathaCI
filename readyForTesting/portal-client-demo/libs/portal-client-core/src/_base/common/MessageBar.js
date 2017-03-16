define([
    'dojo/_base/fx',
    'dojo/fx',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    'xstyle/css!./css/MessageBar.css'
],function(baseFx, fx, declare,
                   _WidgetBase,
                   _TemplatedMixin,
                   _WidgetsInTemplateMixin,
                   _Container
){
//TODO use Notify
    var Alert= declare([_WidgetBase,_TemplatedMixin],{
        templateString:'<div class="msgAlert"><div class="alert alert-${type}"><span class="alertContent" data-dojo-attach-point="msgNode"></span> <i class="fa fa-close" data-dojo-attach-event="click:close"></i></div></div>',
        declaredClass:'Alert',

        wipeIn:function(){
            var _t = this;
            _t.domNode.style.display='none';
            var f = fx.wipeIn({
                node: _t.domNode,
                duration: 200
            });
            f.play();
        },

        close:function(){
            var _t = this;
            var f = fx.wipeOut({
                node: _t.domNode,
                duration: 200,
                onEnd:function(){
                    _t.getParent().removeChild(_t);
                    _t.destroy();
                }
            });
            f.play();
        },

        _setMsgAttr: { node: "msgNode", type: "innerHTML" }
    });

    return declare([_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container],{
        templateString:'<div class="MessageBar"></div>',
        declaredClass:'MessageBar',

        addMsg:function(type,msg,delay){
            var alert=new Alert({
                type:type||"success",
                msg:msg
            });
            var _t=this;
            _t.addChild(alert,0);
            alert.wipeIn();
            if(delay>0){
                setTimeout(function(){
                    alert.close();
                },delay);
            }
        }
    })
});