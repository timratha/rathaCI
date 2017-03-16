define([
    'dojo/when',
    'dojo/json',
    'dojo/request',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable'
], function(when, JSON, request, declare, Rest, Trackable) {

    return declare([Rest, Trackable],{

        about: function(){
            return when(true).then(function(){
                return {
                    "name": "KISTERS Web Portal",
                    "dbDriver": "mock",
                    "copyright": "KISTERS AG",
                    "builddate": new Date().toLocaleDateString(),
                    "version": "mock-version"
                }
            });
        },

        status: function(){
            return when(true).then(function(){
                return {
                    "cpu_cores": "4",
                    "maxavailable_mem_mb": "227",
                    "threads": "25",
                    "remaining_mem_mb": "131"
                }
            });
        }
    })
});