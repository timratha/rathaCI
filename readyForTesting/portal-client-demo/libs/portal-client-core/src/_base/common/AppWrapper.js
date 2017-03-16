define([
    '../wrapperMixins/LocalDataWrapperMixin',
    './Application',
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
],function(LocalDataWrapperMixin, Application, GlobalConfigWrapperMixin, TemplatedTitleWrapperMixin, ViewQueryWrapperMixin, Util, PortalHashHelper, domClass, topic, RequirePromise,lang, array, PortalStore,Deferred, request, declare,ModelWrapper,StoreModelWrapperMixin
){
    // summary:
    //
    return declare([ModelWrapper,StoreModelWrapperMixin,TemplatedTitleWrapperMixin,GlobalConfigWrapperMixin,LocalDataWrapperMixin],{
        instanceType:Application,
        titleBarVisible:false ,
        _idProperty:'appId',
        declaredClass:'AppWrapper',

        getStore:function(){
            return PortalStore.appStore._applicationStore;
        },
        prepareInstanceParams:function(){
            var _t=this;
            return this.inherited(arguments).then(function(params){
                return lang.mixin({
                        menu: _t.model.menu,
                        packageName:_t.model.packageName,
                        version:_t.model.version,
                        creationTime:_t.model.creationTime,
                        key:_t.model.key,
                        views:_t.model.views,
                        defaultView:_t.model.defaultView
                },params);
            });
        },
        switchViewToHash:function(){
            if(this.instance && this.instance.switchViewToHash){
                this.instance.switchViewToHash();
            }
        }
    });
});