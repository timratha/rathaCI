define([
    './storeMixins/_filterGet',
    'dojo/json',
    'dojo/_base/lang',
    'dojo/request',
    'dstore/Rest',
    'dstore/Tree',
    'dstore/Trackable',
    'dojo/_base/declare',
    './_ModelRest'
], function(filterGet, JSON, lang, request, Rest, Tree, Trackable, declare,_ModelRest) {
    return declare([_ModelRest, filterGet, Trackable],{
        constructor:function(args){
            this.inherited(arguments);
            this.target =args.basepath+"/rest/configs/views/";
        },
        getItems:function(ids){
            return this.filter({viewID:ids.join()}).fetch();
        },

        //override
        //TODO  override the get,update,delete or just for add ? better way is server side solution.

        get:function(id,storeType){
            return this.inherited(arguments,[id,{query:{
                type:storeType || 'user'
            }}]).then(function(obj){
                obj.storeType=storeType;
                return obj;
            });
        },

        put: function (object, options) {
            options = options ||{};
            options.query= lang.mixin(options.query||{},{
                type:object.storeType //Override  dashboard,user,global.
            });
            return this.inherited(arguments,[object, options]);
        }
    })
});

