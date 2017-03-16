define([
    '../wrapperMixins/AsyncResizeWrapperMixin',
    '../wrapperMixins/TemplatedTitleWrapperMixin',
    'dojo/dom-class',
    'dojo/_base/lang',
    '../common/RequirePromise',
    '../store/PortalStore',
    'dojo/Deferred',
    'dojo/request',
    'dojo/_base/declare',
    '../common/ModelWrapper',
    '../wrapperMixins/StoreModelWrapperMixin',
    '../wrapperMixins/InstanceDataWrapperMixin',
    'xstyle/css!./css/WidgetWrapperBase.css'
],function(AsyncResizeWrapperMixin, TemplatedTitleWrapperMixin, domClass, lang, RequirePromise, PortalStore, Deferred, request, declare, ModelWrapper, StoreModelWrapperMixin, InstanceDataWrapperMixin
){
    // summary:
    //
    return declare([ModelWrapper,StoreModelWrapperMixin,InstanceDataWrapperMixin,TemplatedTitleWrapperMixin,AsyncResizeWrapperMixin],{
        declaredClass:'WidgetWrapperBase',

        instanceTypeFieldName:'widgetType',

        _idProperty:'widgetId',

        getStore:function(){
            return PortalStore.widgets;
        },
        postCreate:function(){
            this.inherited(arguments);
            domClass.add(this.domNode,"WidgetWrapperBase");
        }
    });
});