define([
    'dstore/Trackable',
    'dstore/Rest',
    'dojo/promise/all',
    'dojo/_base/array',
    'dojo/json',
    'dojo/request',
    'dojo/_base/declare'
], function(Trackable, Rest, all, array, json, request, declare) {
    return declare([Rest, Trackable],{
        basepath:"",
        constructor:function(args){
            declare.safeMixin(this,args);
            this.target = this.basepath+"/rest/configs/widgets?type=class";
        },
        addWidgetType:function(data){
            return this.put(data);
        },
        install:function(config){
            var _t=this;
           return all(array.map(config,function(data){
                _t.addWidgetType(data);
            }));
        }
    })
});

