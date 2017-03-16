define([
    'dojo/dom-class',
    '../_base/title-bar/TitleAction',
    'dojo/on',
    'dijit/layout/_LayoutWidget',
    'dojo/_base/array',
    'dojo/_base/declare',
    'xstyle/css!./css/Layout.css'
], function (domClass, TitleAction, on, LayoutWidget, array, declare) {

    var Layout = declare([LayoutWidget],{
        declaredClass:'Layout',

        getLayoutChildConfig:function(widget){
            throw 'getLayoutChildConfig need to be implement';
        },
        createWidget:function(widgetModel){
            throw 'createWidget need to be implement';
        },
        addWidget:function(widget,layoutConf){
            console.debug('add widget ',widget,layoutConf);
            var _t=this;
            on(widget,'collapseTitle',function(){
                _t.tittleBarToggleAction.refresh();
            });
            this.tittleBarToggleAction.refresh();
        },
        postCreate:function(){
            this.inherited(arguments);
            domClass.add(this.domNode,'Layout');
            this.createTittleBarToggleAction();
        },
        getWidgetById:function(id){
            var re=array.filter(this.getChildren(),function(item){
                return id && item.model && item.model.id == id
            });
            return re[0];
        },
        createTittleBarToggleAction:function(){
            var _t=this;
            this.tittleBarToggleAction=new TitleAction({
                icon:'fa fa-angle-double-left',
                index:9999,
                style:"display:none;",
                onClick:function(){
                    if(this.isAllCollapsed()){
                        array.forEach(_t.getChildren(),function(w){
                            w.tittleBarToggleAble ? w.collapseTitleBar(false):0;
                        });
                    }else{
                        array.forEach(_t.getChildren(),function(w){
                            w.tittleBarToggleAble ? w.collapseTitleBar(true):0;
                        });
                    }
                    this.refresh();
                },
                isAllCollapsed:function(){
                    var someOpen = array.some(_t.getChildren(),function(w){
                        return ! (w.tittleBarToggleAble && w._titleBarToggle);
                    });
                    return !someOpen;
                },
                refresh:function(){
                    this.set('icon',this.isAllCollapsed()?'fa fa-angle-double-right':'fa fa-angle-double-left')
                }
            })
        },
        getActions: function () {
            var _t=this;
            return [
                // disable it for now ; TODO check , if no need anymore.
                //this.tittleBarToggleAction
                {
                    locked:false,
                    onClick: function () {
                        this.set('locked',!this.locked);
                    },
                    _setLockedAttr:function(flag){
                        this.locked = flag;
                        this.set('icon','action-icon fa '+ (this.locked ? 'fa-lock':'fa-unlock-alt') );
                        _t.lock(flag);
                    }
                }
            ];
        },
        lock:function(flag){
            domClass.toggle(this.domNode,'locked',flag);
        }
    });

    Layout.getSettingForm=function(){
        throw 'to be implement';
    };

    return Layout;
});
