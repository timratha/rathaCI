define([
    '../wrapperMixins/AsyncResizeWrapperMixin',
    '../wrapperMixins/GlobalConfigWrapperMixin',
    '../wrapperMixins/TemplatedTitleWrapperMixin',
    '../wrapperMixins/ViewQueryWrapperMixin',
    '../common/Util',
    '../common/PortalHashHelper',
    'dojo/dom-class',
    'dojo/topic',
    '../common/RequirePromise',
    'dojo/_base/lang',
    'dojo/_base/array',
    '../store/PortalStore',
    'dojo/Deferred',
    'dojo/request',
    'dojo/_base/declare',
    '../common/ModelWrapper',
    '../wrapperMixins/StoreModelWrapperMixin'
],function(AsyncResizeWrapperMixin, GlobalConfigWrapperMixin, TemplatedTitleWrapperMixin, ViewQueryWrapperMixin, Util, PortalHashHelper, domClass, topic, RequirePromise, lang, array, PortalStore, Deferred, request, declare, ModelWrapper, StoreModelWrapperMixin
){
    // summary:
    //
    return declare([ModelWrapper,StoreModelWrapperMixin,ViewQueryWrapperMixin,TemplatedTitleWrapperMixin,GlobalConfigWrapperMixin,AsyncResizeWrapperMixin],{
        declaredClass:'ViewWrapper',

        instanceTypeFieldName:'viewType',

        _idProperty:'viewId',

        titleBarVisible:false ,//TODO check by permission

        postCreate:function(){
            this.inherited(arguments);
            domClass.add(this.domNode,'TopicScope');
        },

        getStore:function(){
            return PortalStore.appStore._viewStore;
        },

        prepareInstanceParams:function(){
            var _t=this;
            return this.inherited(arguments).then(function(params){
                return _t._getWidgetModels().then(function(widgetModels) {
                    return lang.mixin({
                        _widgets: widgetModels
                    },params);
                });
            });
        },

        _getWidgetModels:function(){
            var _t=this;
            return PortalStore.appStore.getWidgets(this.model.widgets).then(function(widgets){
                var widgetModels={};
                array.forEach(widgets,function(w){
                    widgetModels[w.key]=w;
                });
                //console.debug('loaded widget models',widgetModels);
                return widgetModels;
            })
        },
        _buildInActions:function(){
            var _t=this;
            var actions= this.inherited(arguments);
            actions.push({
                icon:'fa fa-expand',
                fullScreened:false,
                onClick:function(){
                    this.fullScreened=!this.fullScreened;
                    topic.publish('portal/view/fullScreen',this.fullScreened);
                    this.set('icon',this.fullScreened?'fa fa-compress':'fa fa-expand');
                }
            });
            return actions;
        }
    });
});