define(['dijit/registry',
    'dojo/dom-style',
    '../store/PortalStore',
    'dojo/_base/lang',
    'dojo/_base/array',
    './NavGroup',
    'dojo/on',
    'dojo/query',
    '../common/PortalHashHelper',
    'dojo/dom-class',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/NavMenuItem.template.html'
],function(registry, domStyle, PortalStore, lang, array,  NavGroup, on, query, PortalHashHelper, domClass, TemplatedMixin, WidgetBase, declare,template){
    var NavItem = declare([WidgetBase,TemplatedMixin],{
        declaredClass:'NavItem',
        iconClass:'',
        templateString:template,
        navBar:null,
        parentItem:null,
        postCreate:function(){
            this.inherited(arguments);
            if(this._isPermitted()){
                this.createSubMenu();
                this._initListeners();
                if(this.key){
                    domClass.add(this.domNode,'item-'+this.key);
                }
            }else{
                domStyle.set(this.domNode,'display','none');
            }
        },
        createSubMenu:function(){
            this.subMenu = new NavGroup({
                'class':'navSubMenu',
                groupName:this.label
            });
            var _t= this;
            if(this.items){
                array.forEach(this.items,function(item) {
                    if (item.length || item.fetch) {//store or array
                        _t._createSubMenuGroup(item);
                    }else{
                        _t.createMenuItem(item);
                    }
                });
            }
            this.subMenu.placeAt(this.subMenuNode);
        },

        _createSubMenuGroup:function(items){
            var _t= this;
            //TODO remember the index . can use separator
            if(items.length){//array
                array.forEach(items,function(options){
                    _t.createMenuItem(options)
                });
            }else if(items.fetch){//store
                items.fetch().then(function(items){
                    array.forEach(items,function(item){
                        _t.createMenuItem({
                            key:item.key,
                            label:item.label,
                            iconClass:item.iconClass
                        })
                    });
                })
                // TODO update selected mark.
                items.on('add',function(e){
                    _t.createMenuItem(e.target);
                });
                items.on('delete',function(e){
                    _t.removeMenuItem(e.target);
                });
                items.on('update',function(e){
                    _t.updateMenuItem(e.target);
                });
            }
        },

        createMenuItem:function(options,index){
            var _t= this;
            _t.subMenu.addChild(new NavItem(lang.mixin({
                'class':'navSubMenuItem',
                parentItem:_t,
                navBar:_t.navBar
            },options)),index);
            this._updateHasSubMenu();
        },
        removeMenuItem:function(options){
            var item = this.getItemByKey(options.key);
            var index = this.subMenu.getIndexOfChild(item);
            this.subMenu.removeChild(item);
            item.destroy();
            this._updateHasSubMenu();
            return index;
        },
        updateMenuItem:function(options){
            var index = this.removeMenuItem(options);
            this.createMenuItem(options,index);
            this._updateHasSubMenu();
        },
        _updateHasSubMenu:function(){
            domClass.toggle(this.domNode,'hasSubMenu',this.subMenu.hasChildren())
        },
        setChildSelected:function(){
            domClass.add(this.domNode,'childSelected');//child selected
            if(this.parentItem){
                this.parentItem.openSubMenu();
                this.parentItem.setChildSelected();
            }
        },
        setSelected:function(){
            this.navBar.reset();
            domClass.add(this.domNode,'selected');
            if(this.parentItem){
                this.parentItem.setChildSelected();
            }
        },
        openSubMenu:function(){
            domClass.add(this.domNode,'showSubMenu');// item selected to open menu
            if(this.parentItem){
                this.parentItem.openSubMenu();
            }
            query(this.domNode).siblings().forEach(function(nd){
                domClass.remove(nd,'showSubMenu');
            });
        },
        _initListeners:function(){
            var _t=this;
            on(_t.domNode,'click',function(e){
                if(_t.subMenu && _t.subMenu.hasChildren()){
                    _t.openSubMenu();
                }else if(_t.key){
                    PortalHashHelper.switchView(_t.key);
                }
            });
        },
        _isPermitted:function(){
            if(this.key && this.permissionKeys){
                //check permissions
                return array.some(this.permissionKeys,function(key){
                    return PortalStore.users.checkPermission(key);
                });
            }
            return true;
        },
        getItemByKey:function(key) {//TODO
            var node = query('.item-'+key,this.domNode)[0];
            return node?registry.byNode(node):null
        }
    });
    return NavItem;
})