define([
    'xstyle/css',
    'dojo/_base/array',
    '../_base/common/Util',
    '../_base/widgetWrappers/WidgetWrapper',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase'],function(css, array, Util,WidgetWrapper,declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase){

    // config : cssPath, templatePath,
    //


    return  declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
        _items:null,
        declaredClass:'TemplateView',

        constructor:function(){
          this._items=[];
        },
        postMixInProperties: function () {
            //TODO ?
            this.inherited(arguments);
            if(this.templatePath){
                var module = this.templatePath.split("/")[0]
                var path = require.toUrl(module);
                this.templatePath= this.templatePath.replace(module,path)
            }
        },
        postCreate:function(){
            this.inherited(arguments);
            var _t=this;
            if(this.cssPath){
                css.load(this.cssPath,require,function(){
                    _t._initWidgets();
                });
            }else{
                _t._initWidgets();
            }
        },
        _initWidgets:function(){
            var _t=this;
            array.forEach(Util.keys(_t._widgets),function(key){
                var model = _t._widgets[key];
                _t[key]=new WidgetWrapper({
                    model:model
                },_t[key]);
                _t[key].startup();
                _t._items.push(_t[key]);
            })
        },
        resize:function(){
            this.inherited(arguments);
            var _t=this;
            array.forEach(_t._items,function(w){
                w.resize();
            })
        }
    });
})