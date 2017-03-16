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
            this.target = basePath+"/rest/system/";
            this.headers = { 'Content-Type': 'application/json' };
        },

        about: function(){
            return request.get(this.target + 'about', {handleAs:'json'});
        },

        status: function(){
            return request.get(this.target + "serverStatus", {handleAs:'json'});
        }
    })
});