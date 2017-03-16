define([
    'dojo/_base/declare',
    'dstore/Memory',
    'dojo/request',
    'dstore/QueryResults',
    'dojo/Deferred'
], function(declare, Memory, request,QueryResults,Deferred) {
    // custom store that fetche result from server on first fetch, and the responds from Memory.
    //  Based on RequestMemory example but does not load data until first fetch is called
    // Supports sync methods once the inital .fetch() is done.
    return declare([ Memory], {
        isValidFetchCache: false,
        __ready:null,
        postscript: function () {
            this.inherited(arguments);
            this.__ready = new Deferred();
        },
        _request:function(kwArgs){
            var _t =this;
            var res= request.get(this.target,{handleAs:"json",headers:{Accept:"application/json"}});
            res.then(function(data){
                _t.setData(data || []);
                if(_t.dataCallback){
                    _t.dataCallback(data);
                }
                _t.__ready.resolve(_t.data);
                _t.isValidFetchCache =true;
            });

            return {response:res}
        },
        fetch:function(kwArgs){
            if(!this.isValidFetchCache) {
                var results = this._request(kwArgs);
            }
            return this.__ready

        }
    });
});
