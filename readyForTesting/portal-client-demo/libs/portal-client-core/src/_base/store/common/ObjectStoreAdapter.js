define([
    'dojo/_base/declare',
    '../PortalStore',
    'dstore/legacy/DstoreAdapter'
],function(declare, PortalStore, DstoreAdapter){
    return declare([DstoreAdapter],{
        getLabel:function(item){
            return item[ this.store.labelProperty];
        }
    });
});