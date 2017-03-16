define([
    'dijit/MenuSeparator',
    '../../apps/Models',
    'dojo/on',
    '../common/PortalHashHelper',
    'dojo/window',
    'dojo/hash',
    'dojo/io-query',
    'dojo/topic',
    '../store/PortalStore',
    'dijit/MenuItem',
    'dijit/Menu',
    'dojo/dom-style',
    'dojo/text!./templates/ApplicationSelector.template.html',
    'dojo/_base/declare',
    'dijit/PopupMenuBarItem',
    'dojo/i18n!./nls/ApplicationSelector'
],function(MenuSeparator, Models,on, PortalHashHelper,window, hash, ioQuery, topic, PortalStore,MenuItem, Menu, domStyle, template, declare, PopupMenuBarItem,nls){
    return declare([PopupMenuBarItem],{
        templateString:template,
        baseClass:"ApplicationSelector",
        declaredClass:'ApplicationSelector',
        label:'',
        nls:nls,
        postCreate:function(){
            this.inherited(arguments);
            this.popup=new Menu();
            this._initListeners();
        },
        _initListeners:function(){
            var _t=this;
            on(PortalStore.appStore._applicationStore,'update',function(e){
                _t._updateItem(e.target);
            });
            on(PortalStore.appStore._applicationStore,'delete',function(e){
                _t._removeItem(e.target);
            });
            on(PortalStore.appStore._applicationStore,'add',function(e){
                _t._addItem(e.target);
            });
            topic.subscribe('/dojo/hashchange',function(key){
                _t._switchToHash();
            });
            _t._switchToHash();
        },
        _addItem:function(app,index){
            var _t = this;
            var item =  new MenuItem({
                iconClass:app.iconClass,
                key:app.key,
                "packageName":app['packageName'],
                label:app.applicationType ? "<b>"+app.applicationType+"</b>| "+app.label : app.label //+" ("+app.applicationType+")" TODO need applicationType returned in list
            });
            item.on("Click",function(){
                PortalHashHelper.switchApp(this.key);
                if(!_t.singlePageMode){
                    location.reload();
                }
            });
            this.popup.addChild(item,index);
        },
        _removeItem:function(app){
            this.popup.removeChild(this._getItem(app.key));
        },
        _updateItem:function(app){
            if(app.key == this.currentAppKey){ //TODO maybe have better way.
                this.set('label',"<b>"+app.applicationType+"</b>| "+app.label);
            }else{
                var item = this._getItem(app.key);
                var index = this.popup.getIndexOfChild(item);
                if(index !=-1){
                    this._removeItem(app);
                    this._addItem(app,index);
                }
            }
        },
        _getItem:function(key){
            return this.popup.getChildren().filter(function(item){
                return item.key == key
            })[0];
        },
        _reCreatePopupMenu:function(){
            var _t = this;
            PortalStore.appStore.getApps().then(function(apps){ //TODO not good for performance, get every time.

                _t.popup.destroyRecursive();
                _t.popup=new Menu();
                apps.forEach(function(app,i,arr){
                    if(app.key != _t.currentAppKey){
                        _t._addItem(app);
                    }
                });

                // user space.
                if(PortalStore.users.checkPermission('portal-client-core.userspace')>0) {//TODO remove after seperate userspace
                    if(_t.currentAppKey != 'userspace'){// try to build a store build apps if have multi apps.
                        _t.popup.addChild(new MenuSeparator());
                        _t._addItem(Models.getUserSpace());
                    }
                }
                if(_t.popup.getChildren().length==0){
                    domStyle.set(_t.selectIcon,"display","none")
                }
            });
        },
        _switchToHash:function(){
            var key = PortalHashHelper.getAppKey();
            var _t=this;
            if(key && key != _t.currentAppKey){
                if(key=='userspace'){ //TODO maybe not good.
                    _t.set('label',Models.getUserSpace().label);
                    _t.currentAppKey='userspace';
                    _t._reCreatePopupMenu();
                }else{
                    PortalStore.appStore.getAppByKey(key).then(function(app){
                        _t.set('label',"<b>"+app.applicationType+"</b> | "+app.label);
                        _t.currentAppKey=app.key;
                        _t._reCreatePopupMenu();
                    })
                }
            }
        }
    })
});