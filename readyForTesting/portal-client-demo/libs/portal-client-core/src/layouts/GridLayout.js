define([
    'dojo/on',
    'dojo/text!./templates/GridLayout.setting.template.html',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/array',
    'dojox/layout/GridContainerLite',
    'dojo/_base/lang',
    'dojox/layout/GridContainer',
    'dojo/_base/declare',
    './Layout',
    '../_base/widgetWrappers/WidgetWrapperBase',
    '../_base/wrapperMixins/RemoveAbleWrapperMixin',
    '../_base/wrapperMixins/FullScreenAbleWrapperMixin',
    '../_base/wrapperMixins/ToggleAbleWrapperMixin',
    '../_base/wrapperMixins/TittleBarToggleMixin',
    '../_base/title-bar/TitleAction',
    './GridContainerPatchMixin',
    'xstyle/css!dojox/layout/resources/GridContainer.css',
    'xstyle/css!./css/GridLayout.css'
],function(on, GridlayoutSettingTemplate,WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, array, GridContainerLite, lang, GridContainer, declare,Layout,WidgetWrapperBase,RemoveAbleWrapperMixin,FullScreenAbleWrapperMixin,ToggleAbleWrapperMixin,TittleBarToggleMixin,TitleAction,GridContainerPatchMixin){

    var GridLayout = declare([GridContainer,GridContainerPatchMixin,Layout],{
        baseClass:'gridLayout',
        declaredClass:'GridLayout',

        postCreate:function(){
            this.inherited(arguments);
            this.createToggleAction();
        },
        getLayoutChildConfig:function(widget){
            return {
                column:widget.column,
                index:this.getIndexOfChild(widget),
                dragRestriction:widget.dragRestriction
            }
        },
        createWidget:function(widgetModel){
            var _t=this;
            console.debug('creating widget',widgetModel);
            return new declare([WidgetWrapperBase,RemoveAbleWrapperMixin,FullScreenAbleWrapperMixin,ToggleAbleWrapperMixin],{
                declaredClass:'GridLayout.ChildWidget',
                removeAble:true,
                removeFromParent:function(){
                    _t.removeWidget(this);
                }
            })({
                model:widgetModel
            });
        },
        addWidget:function(widget,layoutConf){
            this.inherited(arguments);
            var _t=this;
            lang.mixin(widget,layoutConf);
            this.addChild(widget);
            on(widget,'toggle',function(){
                _t.toggleAction.refresh();
            });
            this.toggleAction.refresh();
        },
        removeWidget:function(widget){
            console.debug('remove widget',widget);
            this.removeChild(widget);
            this.emit('portal/layout/widget/remove',{widgetId:widget.model.id});
        },
        startup:function(){
            var _t=this;
            this.inherited(arguments);
            if(!_t.started){
                this.subscribe("/dojox/mdnd/drop", function (e){
                    console.debug('grid layout update');
                    _t.emit('portal/layout/update');
                });
            }
        },
        createToggleAction:function(){
            var _t=this;
            this.toggleAction = new TitleAction(
                {
                    icon: "fa fa-minus",
                    isAllFolded:function(){
                        var someOpen = array.some(_t.getChildren(),function(w){
                            return w.open;
                        });
                        return !someOpen;
                    },
                    onClick: function () {
                        var ac = this;
                        if(this.isAllFolded()){
                            array.forEach(_t.getChildren(),function(w){
                                w.set('open',true);
                            });
                        }else{
                            array.forEach(_t.getChildren(),function(w){
                                w.set('open',false);
                            });
                        }
                        this.refresh();
                    },
                    refresh:function(){
                        this.set('icon',this.isAllFolded()?'fa fa-plus':'fa fa-minus');
                    }
                }
            );
        },
        getActions: function () {
            var _t=this;
            var actions= this.inherited(arguments);
            actions.push(this.toggleAction);
            return actions;
        }
    });

    var SettingForm=declare([WidgetBase,TemplatedMixin,WidgetsInTemplateMixin],{
        declaredClass:'GridLayout.SettingForm',
        templateString: GridlayoutSettingTemplate,
        postCreate: function() {
            this.inherited(arguments);
            this.imageNode.src = require.toUrl("portal/layouts/images/gridLayout.png");
        },
        getValues:function(){
            var values= this.form.getValues();
            return {
                nbZones:values.column,
                isAutoOrganized:false,
                doLayout:false
            }
        },
        validate:function(){
            return this.form.validate();
        }
    });

    GridLayout.getSettingForm=function(){
        return new SettingForm();
    };
    return GridLayout;
});