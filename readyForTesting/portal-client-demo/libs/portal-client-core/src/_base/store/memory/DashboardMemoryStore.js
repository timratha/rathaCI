define([
    'dojo/_base/lang',
    'dstore/Rest',
    "dstore/Memory",
    "./_Memory",
    'dstore/Tree',
    'dstore/Trackable',
    'dojo/_base/declare',
    '../common/DashboardStore',
    '../common/DashboardsInstallerMixin'
], function(lang, Rest, Memory,_Memory, Tree, Trackable,declare, DashboardStore,DashboardsInstallerMixin) {
    return declare([ _Memory, Trackable,DashboardStore,DashboardsInstallerMixin],{
        data:[],
        _widgetStore : new declare([ _Memory, Trackable])({
            getItems:function(ids){
                var filter = new this.Filter();
                return this.filter(filter["in"]('id',ids)).fetch();
            }
        })
    })

});

