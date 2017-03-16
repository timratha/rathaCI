define([
    '../wrapperMixins/ResizeAbleWrapperMixin',
    'dojo/dom-class',
    'dijit/DialogUnderlay',
    'dojo/on',
    'dojo/text!./templates/DialogWidgetWrapper.template.html',
    'dijit/Dialog',
    '../store/PortalStore',
    'dojo/Deferred',
    'dojo/request',
    'dojo/_base/declare',
    './WidgetWrapperBase',
    '../wrapperMixins/SendableWrapperMixin',
    'xstyle/css!./css/DialogWidgetWrapper.css'
],function(ResizeAbleWrapperMixin, domClass, DialogUnderlay, on, dialogwidgetwrapperTemplate, Dialog, PortalStore,Deferred, request, declare,WidgetWrapperBase,SendableWrapperMixin
){
    // summary:
    //
    return declare([Dialog,WidgetWrapperBase,SendableWrapperMixin,ResizeAbleWrapperMixin],{
        declaredClass:'DialogWidgetWrapper',
        templateString:dialogwidgetwrapperTemplate,
        closeOnBlur:false,
        resizeAble:false,

        postCreate:function(){
            this.inherited(arguments);
            this.titleBar=this.wrapperTitleBar.domNode;
            domClass.add(this.domNode,"DialogWidgetWrapper");
        },
        _buildInActions:function(){
            var _t=this;
            var actions= this.inherited(arguments);
            actions.unshift({
                icon:'fa fa-compress',
                index:11,
                onClick:function(){
                    _t.onCancel();
                }
            });
            return actions;
        },
        // disable some function of Dialog
        cssStateNodes:{},
        _setClosableAttr: function(val){//override.
            this._set("closable", val);
        },
        resize:function(){
            this.inherited(arguments);
            this._shrunk=false; //TODO temp fix bug: after change config.
        },
        show:function(){
            this.inherited(arguments);
            var _t=this;
            if(this.closeOnBlur){
                //TODO check if have some official solution.
               _t._blurHanlder = on(DialogUnderlay._singleton.domNode,'click',function(){
                    _t.onCancel();
                })
            }
        },
        hide:function(){
            this.inherited(arguments);
            if(this._blurHanlder){this._blurHanlder.remove()};
        }
    });
});