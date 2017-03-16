define([
    'dojo/json',
    'dojo/request',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable'
], function(JSON, request, declare, Rest, Trackable) {
    var basePath ="";
    return declare([Rest, Trackable],{
        constructor: function(args){
            this.inherited(arguments);
            basePath = args.basepath;
            this.target = basePath+"/rest/packages/";
            this.headers = { 'Content-Type': 'application/json' };
        },

        upload: function(data){
            return request.post(this.target, {data: data});
        },

        update: function(data){
            return request.post(this.target + "update", {data: data});
        }
    })
});