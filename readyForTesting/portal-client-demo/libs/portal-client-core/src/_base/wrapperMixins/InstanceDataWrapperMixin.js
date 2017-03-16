// let instance can save some useful data. need implemented ModelWrapper

define([
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/_base/declare',
    '../title-bar/SendToAction',
    '../store/PortalStore'
],function(array, lang, on, declare,SendToAction,PortalStore
){
    // summary:
    //
    return declare([],{
        instanceDataSaveAble:true,
        _setInstanceAttr:function(){
            this.inherited(arguments);
            var _t=this;
            this.own(on(this.instance,'update_instance_data',function(e){
                var inst=_t.instance;
                if(_t.instanceDataSaveAble){
                    lang.mixin(_t.model.config, e.data);
                    _t.setConfig(_t.model.config,true);
                }
            }))
        }

    });
});