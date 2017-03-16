define([
    "dijit/form/NumberTextBox",
    'dijit/form/ValidationTextBox',
    'dijit/form/DropDownButton',
    'dijit/TooltipDialog',
    'dijit/Tooltip',
    'dojo/dom-style',
    'dijit/ColorPalette',
    'dojo/topic',
    '../_base/store/PortalStore',
    'dojo/_base/array',
    'dojo/on',
    'dojo/text!./templates/DashboardFactoryView.template.html',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    '../_base/common/Util',
    '../_base/common/RequirePromise',
    '../_base/common/IconPicker',
    "dojo/i18n!./nls/DashboardFactoryView",
    'xstyle/css!./css/DashboardFactoryView.css',
    'dijit/form/Form',
    'dijit/form/TextBox',
    'dijit/form/Select'
],function(NumberTextBox,ValidationTextBox, DropDownButton, TooltipDialog, Tooltip,domStyle, ColorPalette, topic, PortalStore,array, on, template,declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase,Util,RequirePromise,IconPicker,nls){

    return  declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
        templateString: template,
        declaredClass:"DashboardFactoryView",
        refreshOnShow:true, //TODO?small bug: create two time when init, because wrapper with model will auto create , and refreshOnShow will create it again.
        nls:nls,
        postCreate:function(){
            this.inherited(arguments);
            this._initIconSelector();
            this._initBackgroundColorSelector();
            this._initValidator();
        },
        _initValidator:function(){
                //TODO little risk if get dashboards on begin.
            var _t=this;
            PortalStore.dashboards.fetch().then(function(data) {
                _t.keyField.validator=function(value){
                    if(/^[\w]+$/.test(value)){
                        _t.keyField.set('invalidMessage',nls.alreadyUsedKey);
                        return !array.some(data,function(item){
                            return item.key == value;
                        })
                    }else{
                        _t.keyField.set('invalidMessage',nls.NoSpace);
                        return false
                    }
                };
            })
        },
        startup:function(){
            var _t=this;
            this.layoutType_field.startup();
            this.iconSelect.startup();
            PortalStore.layouts.fetch().then(function(layouts){
                _t.layoutType_field.set('options',array.map(layouts,function(item){
                    return {label: nls[item.layoutType], value: item.layoutType };
                }));
                on(_t.layoutType_field,'change',function(layoutType){
                    _t._reCreateLayoutConfigForm(layoutType);
                });
                _t.layoutType_field.set('value','portal/layouts/GridLayout');
            });
        },
        _reCreateLayoutConfigForm:function(layoutType){
            var _t=this;
            this.own(RequirePromise.require(layoutType).then(function(layoutClass){
                if(_t.layout_form){
                    _t.layout_form.destroyRecursive();
                }
                _t.layout_form=layoutClass.getSettingForm();
                _t.layout_form.placeAt(_t.layout_form_container);
            }))
        },
        createDashboard:function(){
            if(this.DashboardCreationForm.validate() && this.layout_form.validate() ){
                var _t=this;
                var values=this.DashboardCreationForm.getValues();
                var layoutConfig=this.layout_form.getValues();
                var config={
                    key:values.key,
                    version:1, // required ?
                    "label":values.label,
                    "iconClass":values.iconClass,
                    "layout":{
                        type:values.layoutType,
                        config:layoutConfig
                    },
                    widgets:[],
                    config:{
                        backgroundColor:values.backgroundColor //TODO
                    }
                };
                PortalStore.dashboards.add(config).then(function(){
                    topic.publish('portal/systemMessage',{
                        type:'success',
                        content:'success send to dashboard:'+ config.label
                    });
                    setTimeout(function(){//TODO
                        window.history.back();
                        window.location.reload();
                    },1000)
                },function(err){
                    _t.err_msg.innnerHTML = err; //TODO
                });
            }
        },
        cancel:function(){
            this.DashboardCreationForm.reset();
            window.history.back();
        },
        _initIconSelector:function(){
            this.iconSelect=new IconPicker({
                name:'iconClass'
            },this.iconSelect);
        },
        _initBackgroundColorSelector:function(){
            var selector = new DropDownButton({
                name:'backgroundColor',
                iconClass:'fa fa-square',
                dropDown:new ColorPalette({
                    onChange: function(val){
                        selector.set('value',val);
                        domStyle.set(selector.iconNode,'color',val);
                    }
                })
            },this.backgroundColorSelector);
            selector.set('value','white');
            domStyle.set(selector.iconNode,'color','white');
            selector.startup();
        },
        destroy:function(){
            this.inherited(arguments);
        }
    });
})