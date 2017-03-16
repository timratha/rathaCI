define([
    'dojo/json',
    'dojo/_base/lang',
    'dojo/request',
    'dstore/Rest',
    'dstore/Tree',
    'dstore/Trackable',
    'dojo/_base/declare',
    '../common/AppStore'
], function(JSON, lang, request, Rest, Tree, Trackable, declare,AppStore) {
    return declare([AppStore],{
        basepath:"",
        constructor:function(args){
            this.inherited(arguments);
            this.basepath=args.basepath;
            this._applicationStore.target =args.basepath+"/rest/configs/applications/";
        },

        _applicationStore: new declare([ Rest, Trackable, Tree])({
            headers: { 'Content-Type': 'application/json' },

            put:function(object, options){
                if(!!options && !!options.query && !!options.id) {
                    return request.put(this.target + options.id,{
                        headers: this.headers,
                        data: JSON.stringify(object),
                        query: options.query
                    })
                } else {
                    return this.inherited(arguments);
                }
            },

            remove: function (id, options) {
                var store = this;
                if(!!options && !!options.query) {
                    return request(this.target + id, {
                        method: 'DELETE',
                        headers: lang.mixin({}, this.headers, options.headers),
                        query: options.query
                    }).then(function (response) {
                        var target = response && store.parse(response);
                        store.emit('delete', {id: id, target: target});
                        return response ? target : true;
                    });
                } else {
                    return this.inherited(arguments);
                }


            }
        })
    })
});

