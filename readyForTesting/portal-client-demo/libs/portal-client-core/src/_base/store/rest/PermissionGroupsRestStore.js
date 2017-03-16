define([
    'dojo/request',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable'
], function(request, declare, Rest, Trackable) {
    var basePath = "";
    return declare([Rest, Trackable],{
        constructor: function(args){
            this.inherited(arguments);
            basePath = args.basepath + "/rest/permissionGroups";
            this.functionalGroup.target = basePath + "/functional/";
            this.portalObjectGroup.target = basePath + "/portalObject/";
            this.dataSourceObjectGroup.target = basePath + "/datasourceObject/";
        },

        functionalGroup: new declare([ Rest, Trackable])({
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            getPermissions: function(id) {
                return request(this.target + id + "?includeFunctionalPermissions=true", {headers:this.headers, handleAs:'json'});
            },
            setFunctionalPermissions: function(id,data){
                return request.put(this.target + id + "/functionalPermissions", {headers:this.headers, data: JSON.stringify(data)});
            }
        }),

        portalObjectGroup: new declare([ Rest, Trackable])({
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            getPermissions: function(id) {
                return request(this.target + id + "?includePortalObjectPermissions=true", {headers:this.headers, handleAs:'json'});
            },
            setPortalObjectPermissions: function(id,data){
                return request.put(this.target + id + "/portalObjectPermissions", {headers:this.headers, data: JSON.stringify(data)});
            }
        }),

        dataSourceObjectGroup: new declare([ Rest, Trackable])({
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            getPermissions: function(id) {
                return request(this.target + id + "?includeDatasourceObjectPermissions=true", {headers:this.headers, handleAs:'json'});
            },
            setDSOP: function(id,data){
                return request.put(this.target + id + "/datasourceObjectPermissions", {headers:this.headers, data: JSON.stringify(data)});
            }
        })
    })
});