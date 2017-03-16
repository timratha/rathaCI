define([
    'dijit/_FocusMixin',
    'dijit/Menu',
    'dojo/topic',
    'dojo/_base/lang',
    'dojo/mouse',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/on',
    'dojo/_base/declare',
    'dojo/_base/array',
    'dijit/MenuItem',
    './TitleAction',
    '../store/PortalStore',
    "dijit/DropDownMenu",
    'xstyle/css!./css/SendToActon.css'
],function(FocusMixin, Menu, topic, lang, mouse, domClass, domStyle, on, declare, array, MenuItem, TitleAction,PortalStore,DropDownMenu){

    //TODO?consider customize the menu bar
    return declare([TitleAction,FocusMixin],{
        icon:'fa fa-share',
        baseClass:'SendToAction',
        declaredClass:'SendToAction',

        postCreate:function(){
            this.inherited(arguments);
            this._initPopup();
        },
        startup:function(){
            this.inherited(arguments);
            var _t=this;
            PortalStore.dashboards.fetch().then(function(data){
                array.forEach(data,function(options){
                    _t._addItem(options);
                });
                _t._autoHide();
            });
            PortalStore.dashboards.on('delete, add, update', function(e){
                if(e.type=="add" ) {
                    _t._addItem(e.target)
                }else if(e.type=="update" ) {
                    _t._updateItem(e.target);
                }else if(e.type=="delete"){
                    _t._removeItem(e);
                }
                _t._autoHide();
            });
            this.popup.startup();
        },
        _getItem:function(dash){
            var popup = this.popup;
            if(popup){
                return array.filter(popup.getChildren(),function(item){
                    return item.dashId == dash.id;
                })[0]
            }
        },
        _createItem:function(options){
            var _t=this;
            var item =  new MenuItem({
                iconClass:options.iconClass,
                dashId:options.id, //key is not unique?
                label:options.label
            });
            item.on("click",function(){
                _t.sendTo(options.id);
            });
            return item;
        },
        _addItem:function(options){
            this.popup.addChild(this._createItem(options),0);
        },
        _removeItem:function(dash){
            if(this.popup){
                this.popup.removeChild(this._getItem(dash));
            }
        },
        _updateItem:function(dash){
            var item = this._getItem(dash);
            var index = this.popup.getIndexOfChild(item);
            this.popup.removeChild(item);
            this.popup.addChild(this._createItem(dash),index);
        },
        _autoHide:function(){
            if(this.popup.getChildren().length){
                domStyle.set(this.domNode,'display','');
            }else{
                domStyle.set(this.domNode,'display','none');
            }
        },
        sendTo:function(dashboardId){
            var _t=this;
            var data=lang.clone(_t.getModel());
            data.id=undefined;
            PortalStore.dashboards.addWidget2Dashboard(dashboardId,data).then(function(d){
                topic.publish('portal/systemMessage',{
                    type:'success',
                    content:'success send to dashboard:'+ d.label
                })
            },function(err){
                topic.publish('portal/systemMessage',{
                    type:'error',
                    content:'send widget failed:'+err.message
                })
            });
        },
        getModel:function(){
            throw 'must be implement by instance';
        },
        _initPopup:function(){
            this.popup=new Menu({
                baseClass:'sentToMenu'
            });
            this.popup.placeAt(this.domNode);
        }
    })
});