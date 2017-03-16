define([
    'dojo/_base/array',
    'dijit/MenuSeparator',
    '../common/PortalHashHelper',
    'dojo/window',
    'dojo/hash',
    'dojo/io-query',
    'dojo/topic',
    '../store/PortalStore',
    'dijit/MenuItem',
    'dijit/Menu',
    'dojo/_base/declare',
    'dijit/PopupMenuBarItem',
    'dojo/i18n!./nls/DashboardSelector'
],function(array, MenuSeparator, PortalHashHelper,window, hash, ioQuery, topic, PortalStore,MenuItem, Menu, declare, PopupMenuBarItem,nls){
    return declare([PopupMenuBarItem],{
        declaredClass:'DashboardSelector',
        label:'<i class="shutCutIcon fa fa-th"></i>',
        'class':'shortCut',
        postCreate:function(){
            this.inherited(arguments);
            this._reCreatePopupMenu();
            this._initListeners();
        },
        _reCreatePopupMenu:function(){
            var _t = this;
            this.popup=new Menu();
            this.popup.addChild(new MenuSeparator());
            this.popup.addChild(new MenuItem({
                iconClass:'fa fa-plus',
                label:nls.addNew,
                onClick:function(){
                    PortalHashHelper.switchTo('userspace','DashboardFactoryView');
                }
            }));
            PortalStore.dashboards.fetch().forEach(function(dash){
                _t._addItem(dash);
            })
        },
        _createItem:function(options){
            var item =  new MenuItem({
                iconClass:options.iconClass,
                key:options.key,
                dashId:options.id, //key is not unique?
                label:options.label
            });
            item.on("Click",function(){
                PortalHashHelper.switchTo('userspace',this.key);
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
        _getItem:function(dash){
            var popup = this.popup;
            if(popup){
                return array.filter(popup.getChildren(),function(item){
                    return item.dashId == dash.id;
                })[0]
            }
        },
        _initListeners:function(){
            var _t = this;
            //TODO update
            PortalStore.dashboards.on('add',function(e){
                _t._addItem(e.target);
            });
            PortalStore.dashboards.on('delete',function(e){
                _t._removeItem(e.target);
            });
            PortalStore.dashboards.on('update',function(e){
                _t._updateItem(e.target);
            });
        }
    })
});