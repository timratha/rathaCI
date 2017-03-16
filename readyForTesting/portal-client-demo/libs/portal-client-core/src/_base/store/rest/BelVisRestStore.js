define([
    'dstore/Tree',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable'
],function(Tree, declare, Rest, Trackable){
    var basePath ="";
    return declare(null,{
        constructor:function(args){
            this.inherited(arguments);
            basePath = args.basepath;
            this.meteringPoints.target =  basePath+"/rest/belvis3/dataSources/0/meteringPoints/";
        },
        meteringPoints : new declare([ Rest, Trackable, Tree])({
            idProperty: "metcode",
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            getChildren: function(obj){
                var tsStore = new declare([Rest, Trackable])({
                    idProperty: "ts_id",
                    target: this.target + obj.metcode + "/timeSeries",
                    headers: {'Content-Type': 'application/json;charset=utf-8'}
                });
                //console.log(obj);
                return tsStore;
            },
            getTsData: function(obj) {
                var tsDataStore = new declare([Rest, Trackable])({
                    idProperty: "ts_id",
                    target: this.target + obj.metcode + "/timeSeries/" + obj.ts_id + "/data/",
                    headers: {'Content-Type': 'application/json;charset=utf-8'}
                });
                return tsDataStore;
            }
        })
    })
});