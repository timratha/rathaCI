
define([
    'dojo/_base/array',
    'dojo/on',
    'dojo/_base/declare',
    '../title-bar/SendToAction',
    '../store/PortalStore',
    '../common/Util'
],function(array, on, declare,SendToAction,PortalStore,Util
){
    // summary: it's better way to listen on the wrapper instead listen on the instance.
    return declare([],{
        bubble:true,
        _listeners:null,
        constructor:function(){
          this._listeners={};
        },
        on:function(type, listener){
            this._listeners[type] = this._listeners[type] ||[];
            this._listeners[type].push(listener);
            if(this.instance){
                on(this.instance,type,listener);
            }
        },
        _setInstanceAttr:function(){
            this.inherited(arguments);
            var _t=this;
            array.forEach(Util.keys(_t._listeners),function(type){
                array.forEach(_t._listeners[type],function(listener){
                    on(_t.instance,type,listener);
                })
            })
        }
    });
});