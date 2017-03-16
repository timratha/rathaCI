define([
    'dojo/on',
    '../title-bar/TitleBar',
    'dojo/topic',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dstore/Memory",
    "dojo/request",
    "dojo/promise/all",
    "dojo/text!./templates/view.template.html",
    "../common/_ConfigurableMixin",
    "dojo/json",
    "dojo/dom-class",
    "dojo/_base/fx",
    "dojo/Deferred",
    "dojo/fx/easing",
    "dojo/dom-geometry",
    "dojo/window",
    "../common/Register",
    "../common/Util",
    "dojo/_base/array",
    "../store/PortalStore",
    "../widgetWrappers/WidgetWrapper"
],function(on, TitleBar,
    topic,
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _Container,
    Memory,
    request,
    all,
    template,
    _ConfigurableMixin,
    json,
    domClass,
    fx,
    Deferred,
    easing,
    domGeometry,
    window,
    Register,
    Util,
    array,
    PortalStore,
    WidgetWrapper
){

    return declare( [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, _ConfigurableMixin],{
        templateString:template,
        declaredClass:"ViewConfigurableWrapper",
        constructor:function(args){
            declare.safeMixin(this,args);
        },
        postCreate:function(){
            var _t=this;
            this.inherited(arguments);
            this.wrapperTitleBar=new TitleBar(null, this.titleBar);
            on(this,'wrapper/afterCreate',function(){
                _t.reloadActions();
                _t.wrapperTitleBar.set('titleIcon',_t.model.iconClass);
                _t.wrapperTitleBar.set('title',_t.model.label);
                this.resize();
            });
        },
        load:function(){
            var _t=this;
            return this.loadModel().then(function(){
                _t.reCreateInstance();
            },function(err){
                console.warn('can not load model for',_t.key ,err);
            });
        },
        loadModel:function(){
            //implement in subclass
        },
        save:function(){
            //implement in subclass
        },
        getConfig:function(){
            return this.model.config;
        },
        setConfig:function(config){
            this.model.config=config;
            this.reCreateInstance();
        },
        newInstance:function(){
            //implement in subclass
        },
        reloadActions:function(){
            var _t=this;
            _t.wrapperTitleBar.clearActions();
            var actions=Util.concatArray([_t._buildInActions(),this.instance.getActions?this.instance.getActions():[]]);
            array.forEach(actions,function(action){
                _t.wrapperTitleBar.addAction(action);
            });
            //TODO consider
            if(actions.length ==0){
                _t.wrapperTitleBar.hide();
            }else{
                _t.wrapperTitleBar.show();
            }
        },
        _buildInActions:function(){
            return [];
        },
        //TODO move to a mixin

        hide:function(){
            var deferred = new Deferred();
            var _t =this;
            if(!this.viewTransition){
                domClass.remove(_t.domNode,'active');
                deferred.resolve(true);
            }else {
                 fx.animateProperty({
                    // TODO: add else if for different tranistion options
                     node:_t.domNode,
                     properties:{
                        left:{start:0,end:window.getBox().w}
                    },
                    onEnd:function(){
                        domClass.remove(_t.domNode,'active');
                        deferred.resolve(true); //TODO need consider use which mode
                    },
                    duration:500
                }).play();
            }
            return deferred.then(function(){
                _t.emit('hide');
            });
        },
        show:function(){
            var deferred = new Deferred();
            var _t =this;
            domClass.add(_t.domNode, 'active');
            if(!_t.instance){
                domClass.add(_t.loaderIndicator,'loading');
                // use async ,don't freeze the ui
                _t.load().then(function(){
                    domClass.remove(_t.loaderIndicator,'loading');
                });
            }
            if(!_t.viewTransition){    // TODO: add else if for different tranistion options

            }else {
                fx.animateProperty({
                    node:_t.domNode,
                    properties:{
                        left:{start:-window.getBox().w,end:0}
                    },
                    duration:500
                }).play();
            }
            _t.resize()
            return deferred;
        },
        resize:function(dim){
            dim=dim||domGeometry.getContentBox(this.domNode);
            var h=domGeometry.getMarginBox(this.wrapperTitleBar.domNode).h;

            if(this.instance&& this.instance.resize){
                var size={
                    h:dim.h-h,
                    w:dim.w
                }
                domGeometry.setMarginBox(this.instancePoint,size);
                this.instance.resize({
                    h:dim.h-h,
                    w:dim.w
                });
            }
        }

    });
});