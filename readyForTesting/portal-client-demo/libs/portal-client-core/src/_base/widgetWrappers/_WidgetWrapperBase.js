define([
    'dojo/dom-style',
    'dojo/dom-geometry',
    'dijit/layout/utils',
    "../common/Util",
    '../title-bar/TitleBar',
    '../title-bar/SendToAction',
    'dojo/topic',
    'dojo/_base/declare',
    'dojo/dom-construct',
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./templates/WidgetWrapperBase.template.html",
    "./WidgetConfigurableMixin",
    "../common/Register",
    "dojo/_base/array",
    "dijit/MenuItem",
    "../store/PortalStore",
    "dojo/_base/lang",
    "dojo/on"
], function (domStyle, domGeometry, utils, Util,
    TitleBar,
    SendToAction,
    topic,
    declare,
    domConstruct,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _Container,
    template,
    WidgetConfigurableMixin,
    Register,
    array,
    MenuItem,
    PortalStore,
    lang,
    on
) {
    return declare([_WidgetBase,_Container,_TemplatedMixin ,_WidgetsInTemplateMixin,WidgetConfigurableMixin], {
        templateString: template,
        removeAble:false,
        sendAble:false,
        _dim:null,
        postCreate:function(){
            var _t=this;
            this.wrapperTitleBar=new TitleBar(null, this.titleBar);
            on(this,'wrapper/afterCreate',function(){//TODO consider make async
                _t.reloadActions();
                _t.wrapperTitleBar.set('titleIcon',_t.model.iconClass);
                _t.wrapperTitleBar.set('title',_t.instance.label || _t.model.config.label ||_t.model.label);//TODO label is a special field
                _t.resize();
            });
            _t.inherited(arguments);
        },
        reloadActions:function(){
            var _t=this;
            _t.wrapperTitleBar.clearActions();
            var actions=Util.concatArray([_t._buildInActions(),this.instance.getActions?this.instance.getActions():[]]);
            array.forEach(actions,function(action){
                _t.wrapperTitleBar.addAction(action);
            });
        },
        removeFromParent:function(){
            throw 'need be implement if removeAble set to ture';
        },
        setTitleFull:function(flag){
            this.wrapperTitleBar.set('fullTitle',flag);
            this.resize();
        },
        _buildInActions:function(){
            var _t=this;
            var actions=[];
            if(this.removeAble){
                actions.push({
                    icon:'fa fa-close',
                    onClick:function(){
                        _t.removeFromParent();
                    }
                });
            }
            if(this.sendAble){
                actions.push( new SendToAction({
                    key:'sendTo', //identify the action.
                    getModel:function(){
                        return _t.model;
                    }
                }));
            }
            if(this.instance.getConfigSchema){
                actions.push({
                    icon:'fa fa-gears',
                    onClick:function(){
                        _t.openSetting();
                    }
                });
            }
            actions.push({
                icon:'fa fa-eye-slash',
                key:'toggle-title-bar',
                onClick:function(){
                    _t.setTitleFull(!_t.wrapperTitleBar.fullTitle);
                    this.set('icon',_t.wrapperTitleBar.fullTitle?'fa fa-eye':'fa fa-eye-slash');
                }
            });
            return actions;
        },
        resize:function(dim){
            // description:
            //   about what's wrapper do when resize
            //   case dim != null :  set size to wrapper, calculate size for instance. instance.resize(size)
            //   case dim == null :
            //          get size of current wrapper if set , calculate size for instance.
            //          if not set size ,just call instance.resize()

            //TODO consider the dim== null, and the parent size may be not correct. so need to set natural size
            if(dim){
                domGeometry.setMarginBox(this.domNode,dim);
                this._dim=dim;
            }
            if(this._dim){
                dim=this._dim;
                var c_dim=domGeometry.getContentBox(this.domNode);
                var h=this.wrapperTitleBar.fullTitle?domGeometry.getMarginBox(this.wrapperTitleBar.domNode).h:0;
                if(this.instance&& this.instance.resize){
                    var size={};
                    if(dim.h){
                        size.h=c_dim.h-h
                    }
                    if(dim.w){
                        size.w=c_dim.w
                    }
                    domGeometry.setMarginBox(this.containerNode,size);
                    this.instance.resize(size);
                }
            }else{
                if(this.instance&& this.instance.resize){
                    this.instance.resize();
                }
            }

        }
    });
});
