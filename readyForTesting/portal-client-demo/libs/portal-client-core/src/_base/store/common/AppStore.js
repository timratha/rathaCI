define([
    'dojo/Deferred',
    'dojo/_base/array',
    'dstore/Rest',
    'dstore/Tree',
    'dstore/Trackable',
    'dojo/_base/declare',
    './AppInstallerMixin'
], function(Deferred, array, Rest, Tree, Trackable, declare,AppInstallerMixin) {
    return declare([AppInstallerMixin],{
            _applicationStore: null,
            _viewStore : null,
            _widgetStore : null,
            constructor:function(args){
                declare.safeMixin(this,args);
            },
            getApps:function(){
                return this._applicationStore.fetch();
            },
            getApp:function(id){
                return this._applicationStore.get(id);
            },
            removeApp:function(id,options){
                return this._applicationStore.remove(id,options);
            },
            removeAppByKey:function(key){
                var _t=this;
                return this.getAppByKey(key).then(function(app){
                    return app?_t.removeApp(app.id):0;
                })
            },
            getAppByKey:function(key){
                var _t=this;
                return this._applicationStore.fetch().then(function(apps){
                    var selectedApp =  array.filter(apps,function(app){
                        return key==app.key; //TODO consider server support query with key.
                    })[0];
                    //need get by id again to get more detail in app.
                    return _t._applicationStore.get(selectedApp.id).then(function(app){
                        return app; //workaround until server supports query with key.
                    })
                });
            },
            putApp:function(app){
                return this._applicationStore.put(app);
            },
            postApp:function(app){
                return this._applicationStore.add(app);
            },
            getViews: function(){
                var _ret = new Deferred();
                var ids = [];
                array.forEach(app.views,function(_v){
                    ids.push(_v.id);
                });
                if(ids.length>0) {
                    _ret = this._viewStore.getItems(ids);;
                }else{
                    _ret.resolve([])
                }
                return _ret;
            },
            getView:function(id){
                return this._viewStore.get(id);
            },
            putView:function(obj){
                return this._viewStore.put(obj,{id:obj.id});
            },
            postView:function(obj){
                return this._viewStore.add(obj);
            },
            deleteView:function(id){
                return this._viewStore.remove(id);
            },
            getWidget:function(id){
                return this._widgetStore.get(id)
            },
            getWidgets:function(widgets){
                var _ret = new Deferred();
                var ids = array.map(widgets,function(_w){
                    return _w.id || _w;
                });
                if(ids.length>0) {
                    _ret = this._widgetStore.getItems(ids,'user');
                }else{
                    _ret.resolve([])
                }
                return _ret;
            },
            putWidget:function(obj){
                return this._widgetStore.put(obj,{id:obj.id})
            },
            postWidget:function(obj){
                return this._widgetStore.add(obj);
            },
            deleteWidget:function(id){
                return this._widgetStore.remove(id)
            },
            addTypeWidget:function(){
                throw 'need to be implement'
            }
        })
});

