//TODO restructure the folder.

define([
    'dojo/topic',
    'dojo/Deferred',
    '../common/Register',
    'dojo/_base/array',
    "../common/Util",
    "dojo/_base/declare",
    "./_ViewConfigurableWrapper",
    '../store/PortalStore'
],function(topic, Deferred, Register,array, Util,declare,ViewConfigurableWrapper,PortalStore
){
    var ViewCacheQueue = declare([],{
        cacheSize:1, //TODO have bug when set to 1. (not cause from here ,just mark here);
        _queue:[],
        constructor:function(args){
            declare.safeMixin(this,args);
        },
        add:function(view){
            var index=this._queue.indexOf(view);
            if(index>=0){
                this._queue.splice(index,1);
            }
            this._queue.push(view);
            this.cacheSize=this.cacheSize>1?this.cacheSize:1;// at least have one
            if(this._queue.length > this.cacheSize){
                //console.log(this.length,' size is up to ',this.cacheSize);
                this.shiftOne();
            }
            //console.log('add one',this._queue.length);
        },
        shiftOne:function(){
            var view = this._queue.shift();
            view.destroyInstance();
            //console.log('remove one');
        }
     });

    return declare( [ViewConfigurableWrapper],{
        viewCacheQueue:new ViewCacheQueue(),
        loadModel:function(){
            var _t=this;
            if(_t.viewId){ //TODO consider install build in views to store
                return  PortalStore.appStore.getView(_t.viewId).then(function(model){
                    _t.model=Util.merge([_t.defaultModel,model]);
                    _t._widgets={};
                    return  PortalStore.appStore.getWidgets(model).then(function(widgets){
                        array.map(widgets, function (item) {
                            _t._widgets[item.key]=item;
                        });
                    });
                });
            }else{//TODO
                var ready=new Deferred();
                _t.model=Util.merge([_t.defaultModel,{}]);
                ready.resolve();
                return ready.promise;
            }

        },
        newInstance:function(cb){
            var _t=this;
            return  Register.view(_t.model.viewType).then(function(viewType){
                if(viewType){
                    return new viewType(
                        Util.merge([_t.model.config,
                            {
                                _widgets: _t._widgets
                            }])
                    );
                }else{
                    throw 'view type not found'+_t.model.widgetType

                }
            })
        },
        show:function(){
            topic.publish("/portal/menu/resize","auto");
            this.inherited(arguments);
            this.viewCacheQueue.add(this);
        },
        save:function(){
            PortalStore.appStore.putView(this.model);
        }
    });
});