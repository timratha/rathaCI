define([
    'dojo/json',
    'dojo/request',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable'
], function(JSON, request, declare, Rest, Trackable) {
    var basePath = "";
    return declare([Rest, Trackable],{
        constructor: function(args){
            this.inherited(arguments);
            basePath = args.basepath + "/rest/dataSources";
            this.target = basePath;
            this.headers =  {'Content-Type': 'application/json;charset=utf-8'};
        },

        functional: new declare([ Rest, Trackable])({
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            setFunctionalPermissions: function(id,data){
                return request.put(this.target + id + "/functionalPermissions", {data: data});
            }
        }),

        portalObject: new declare([ Rest, Trackable])({
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        }),

        dataSourceObject: new declare([ Rest, Trackable])({
            headers: {'Content-Type': 'application/json;charset=utf-8'}

        })
    })
});