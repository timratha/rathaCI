define([
    '../wrapperMixins/GlobalConfigWrapperMixin',
    'dojo/dom-class',
    'dijit/_base/manager',
    'dojo/_base/declare',
    './WidgetWrapperBase',
    '../wrapperMixins/FullScreenAbleWrapperMixin',
    '../wrapperMixins/SendableWrapperMixin',
    '../wrapperMixins/TittleBarToggleMixin',
    '../wrapperMixins/EventWrapperMixin',
    'xstyle/css!./css/WidgetWrapper.css'
],function(GlobalConfigWrapperMixin, domClass, manager,declare,
           WidgetWrapperBase,
           FullScreenAbleWrapperMixin,
           SendableWrapperMixin,
           TittleBarToggleMixin,
           EventWrapperMixin
){
    return declare([WidgetWrapperBase,
        FullScreenAbleWrapperMixin,
        SendableWrapperMixin,
        TittleBarToggleMixin,
        EventWrapperMixin,
        GlobalConfigWrapperMixin
    ], {
        declaredClass:'WidgetWrapper',
        postCreate:function(){
            this.inherited(arguments);
            domClass.add(this.domNode,"widgetWrapper");
        }
    });
});