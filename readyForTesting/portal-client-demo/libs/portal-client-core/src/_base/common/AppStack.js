define([
    './Util',
    'dojo/topic',
    '../../apps/Models',
    '../../apps/UserSpace',
    'dojo/when',
    './AppWrapper',
    '../store/PortalStore',
    '../../views/NotFoundView',
    '../viewWrappers/ViewWrapper',
    'dojo/_base/array',
    'dijit/layout/StackContainer',
    'dojo/_base/declare'
],function(Util, topic, Models, UserSpace, when, AppWrapper, PortalStore, NotFoundView, ViewWrapper, array, StackContainer, declare){

    return  declare([StackContainer],{
        declaredClass:'AppStack',

        postCreate:function(){
            this.inherited(arguments);
            this._initBuildInApps();
            this._initListeners();
        },
        select:function(key){
            var _t=this;
            return when(array.filter(_t.getChildren(),function(app){

                    return app.key == key;
                })[0]).then(function(app){
                return app || PortalStore.appStore.getAppByKey(key).then(function(model){
                    return Util.requirePackageResource(model.packageName).then(function(){
                        var app = new AppWrapper({
                            model:model,
                            key:model.key,
                            appId:model.id,
                            theme:model.config && model.config.theme,
                            localDataId:model.localDataId
                        });  // also can use appId.
                        _t.addChild(app);

                        return app;
                    })
                })
            }).then(function(app){
                if(app){
                    console.debug('select app ',key,app);
                    //TODO animation
                    _t.selectChild(app,true).then(function(){
                        topic.publish('portal/theme',{
                            theme:app.theme,
                            callback:function(){
                                //TODO consider if it's good way.
                                app._updatePromise.then(function(){
                                    app.switchViewToHash();
                                });
                            }
                        });
                    });
                }else{
                    //TODO
                }
            })
        },
        _initBuildInApps:function(){
            console.debug('creating user space ');
            if(PortalStore.users.checkPermission('portal-client-core.userspace')>0) {//TODO remove after seperate userspace
                var userSpace=Models.getUserSpace();
                this.addChild(new AppWrapper({
                    instanceType: UserSpace,
                    model: userSpace,
                    key: userSpace.key,
                    appId: userSpace.id,
                    localDataId: userSpace.localDataId
                }));
            }
        },
        _getSelectedApplication: function () {
            return this.selectedChildWidget.instance;
        },
        _initListeners:function(){
            var _t=this;

            //resize current application.
            topic.subscribe('portal/app/resize',function(){
                _t.resize();
            });

            topic.subscribe('portal/nav/show',function(){ //TODO consider save nav state back to server or client storage.
                var app = _t._getSelectedApplication();
                app.navBar.show().then(function(){
                    app.resize();
                });
            });
            topic.subscribe('portal/nav/hide',function(){
                var app = _t._getSelectedApplication();
                app.navBar.hide().then(function(){
                    app.resize();
                });
            });
            topic.subscribe('portal/nav/collapse',function(flag){
                var app = _t._getSelectedApplication();
                app.navBar.collapse(flag).then(function(){
                    app.resize();
                });
            });
            topic.subscribe('portal/nav/toggleVisible',function(){
                var app = _t._getSelectedApplication();
                app.navBar.toggleVisible().then(function(){
                    app.resize();
                });
            });
        }
    });
})