define([
    'dojo/_base/lang',
    'dstore/Rest',
    "dstore/Memory",
    'dstore/Tree',
    'dstore/Trackable',
    'dojo/_base/declare',
    '../common/AppStore',
    './_Memory'
], function(lang, Rest, Memory, Tree, Trackable,declare, AppStore,_Memory) {
    return declare([ _Memory, Trackable],{
        getItems:function(ids){
            var filter = new this.Filter();
            return this.filter(filter["in"]('id',ids)).fetch();
        }
    })
});

