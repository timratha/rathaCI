define([
    'dojo/topic',
    'dojo/json',
    'dojo/promise/all',
    'dojo/on',
    '../common/RequirePromise',
    'dojo/_base/lang',
    'dojo/_base/array',
    '../store/PortalStore',
    'dojo/Deferred',
    'dojo/request',
    'dojo/_base/declare',
    './ViewWrapper',
    '../../views/Dashboard',
    '../common/Util',
    '../wrapperMixins/ConfigureAbleMixin'
],function(topic, json, all, on, RequirePromise,lang, array, PortalStore,Deferred, request, declare,ViewWrapper,Dashboard,Util,ConfigureAbleMixin
){
    // summary:
    //
    // Mark: just edit model inside wrapper to keep same behavior when use setting dialog ?
    //
    //
    return declare([ViewWrapper],{
        declaredClass:'DashboardWrapper',

        instanceType:Dashboard,

        titleBarVisible:true,

        getStore:function(){
            return PortalStore.dashboards;
        },

        startup:function(){
            this.inherited(arguments);
            this._initListeners();
        },

        prepareInstanceParams:function(){
            var _t=this;
            return _t.inherited(arguments).then(function(params){

                    return all({
                        widgetModels:_t._getWidgetModels(),
                        layoutType:RequirePromise.require(_t.model.layout.type)
                    }).then(function(results) {
                        return lang.mixin({
                            _widgets: results.widgetModels,
                            layoutType:results.layoutType,
                            layoutModel:_t.model.layout,
                            saveModel:function(){
                                array.forEach(_t.model.widgets,function(item){
                                    item.layoutChildConfig=_t.instance.getLayoutChildConfig(item.id)
                                });
                                _t.saveModel();
                            },
                            removeWidgetModel:function(e){
                                Util.removeFromArray(_t.model.widgets,function(item){
                                    return item.id == e.widgetId;
                                });
                            }
                        },params);
                    });
            });
        },

        _getWidgetModels:function(){
            var _t=this;
            return PortalStore.dashboards.getWidgets(this.model.widgets).then(function(widgets){
                var widgetModels=[];
                array.forEach(widgets,function(item){
                    //mark: user key will have issue ,when key is not unique. TODO?consider no key for dashboard widget.
                    widgetModels.push({
                        model:item,
                        layoutConf:_t.model.widgets.filter(function(w){
                            return item.id == w.id;
                        })[0].layoutChildConfig
                    });

                });
                console.debug('loaded widget models',widgetModels);
                return widgetModels;
            });
        },

        onShow:function(){
            this.inherited(arguments);
            setTimeout(function(){
                //onShow already inside resize process sometime. so need put this to another event loop, TODO maybe not good.
                topic.publish('portal/nav/collapse',true);
            },0)
        }
    });
});