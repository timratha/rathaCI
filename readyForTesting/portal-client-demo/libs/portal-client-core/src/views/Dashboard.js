// summary:
//    show scroll bar inside dashboard when layout is bigger.
define([
    'dojo/topic',
    'dijit/form/Form',
    'dijit/_Container',
    'dojo/dom-geometry',
    'dojo/on',
    'dojo/_base/array',
    'dojo/_base/declare',
    '../_base/common/RequirePromise',
    '../_base/common/Util',
    'dijit/_WidgetBase',
    "dojo/i18n!./nls/Dashboard",
    'xstyle/css!./css/dashboard.css'
], function (topic, Form, Container, domGeometry, on, array, declare, RequirePromise,Util,WidgetBase,nls) {
    return declare([WidgetBase,Container], {
        baseClass:'dashboard',
        declaredClass:'Dashboard',
        postCreate:function(){
            var _t = this;
            this.inherited(arguments);
            this._initLayout();
            this._initWidgets();
            this._initListeners();
        },
        _initLayout:function(){
            console.debug('layout model:',this.layoutModel);
            this.layout = new this.layoutType(this.layoutModel.config);
            this.addChild(this.layout);
            var _t = this;
            on(_t.layout,'portal/layout/update',function(){
                _t.saveModel();
            });
            on(_t.layout,'portal/layout/widget/remove',function(widgetId){
                _t.removeWidgetModel(widgetId);
                _t.saveModel();
            });
        },
        getLayoutChildConfig:function(id){
            var _t=this;
            var widget = _t.layout.getWidgetById(id);
            return _t.layout.getLayoutChildConfig(widget);
        },
        _initWidgets:function(){
            console.debug('layout widgetModels:',this._widgets);
            var _t=this;
            this._widgets.sort(function(w1,w2){
                return w1.layoutConf.index - w2.layoutConf.index; // use layoutConf.index to order widget.
            });
            //MARK in dashboard _widget is an array , to avoid use key (may not unique);
            array.forEach(_t._widgets,function(widgetData){
                var w=_t.layout.createWidget(widgetData.model);
                _t.layout.addWidget(w,widgetData.layoutConf);
            });
            _t.resize();
        },
        _initListeners:function(){

        },
        resize:function(){
            if(this.layout){
                this.layout.resize();
            }
        },
        getActions:function(){
            var actions = [],_t=this;
            if(this.layout && this.layout.getActions){
                array.forEach(this.layout.getActions(),function(item){
                    actions.push(item);
                });
            }
            return actions;
        },
        getConfigSchema:function(){
            return [
                {
                    name: "style.backgroundColor",
                    label: 'Background Color',
                    type: 'string',
                    help: "Set the color of background"
                },
                {
                    name: "style.backgroundImage",
                    label: 'Background Image',
                    type: 'string',
                    help: "Set the color of background"
                },
                {
                    name: "style.backgroundRepeat",
                    label: 'Background Repeat',
                    type: 'selector',
                    options:[
                        {
                            label:'no-repeat',
                            value:'no-repeat'
                        },
                        {
                            label:'repeat-x',
                            value:'repeat-x'
                        },
                        {
                            label:'repeat-y',
                            value:'repeat-y'
                        },
                        {
                            label:'repeat',
                            value:'repeat'
                        }
                    ],
                    defaultValue:'no-repeat',
                    help: "Set the color of background"
                },
                {
                    name: "style.backgroundPosition",
                    label: 'Background Position',
                    defaultValue:'center',
                    type: 'string',
                    help: "Set the color of background"
                }

            ]
        }
    });
});
