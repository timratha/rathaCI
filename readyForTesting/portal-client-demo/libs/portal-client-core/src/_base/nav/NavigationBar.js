define([
    'dijit/registry',
    './NavItem',
    './NavGroup',
    'dojo/Deferred',
    'dojo/aspect',
    'dojo/_base/fx',
    'dojo/NodeList-traverse',
    'dojo/query',
    'dojo/on',
    'dojo/dom-attr',
    '../common/PortalHashHelper',
    'dojo/hash',
    'dojo/dom-class',
    'xstyle/css!./css/NavigationBar.css',
    'dojo/text!./templates/NavigationBar.template.html',
    'dijit/_Container',
    'dojo/_base/lang',
    'dijit/PopupMenuItem',
    'dojo/_base/array',
    'dijit/layout/ContentPane',
    'dijit/DropDownMenu',
    'dijit/MenuBar',
    'dojo/topic',
    'dojo/dom-style',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare'
],function (registry, NavItem, NavGroup, Deferred, aspect, baseFx, NodeListTraverse, query, on, domAttr, PortalHashHelper,hash, domClass, css, template, Container, lang, PopupMenuItem, array, ContentPane,DropDownMenu, MenuBar, topic, domStyle, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare){

    //TODO?have bug with singlePageMode ,after switch back.

    //TODO need rework , try build a store menu.

    return declare([WidgetBase,TemplatedMixin,WidgetsInTemplateMixin,Container],{
        declaredClass:'NavigationBar',

        templateString:template,

        // position: String
        //          can be set to left,right,top
        position:'left',

        collapsed:false,

        fullAppWidth:1280,

        smallAppWidth:800,

        menuSize:'responsive', // full,collapsed,full,responsive

        items:[],

        _setPositionAttr:function(position){
            this.position=this.region=position;
        },

        postCreate:function(){
            this._initMenus();
            this._initListeners();
        },

        getItemByKey:function(key) {//TODO
            var node = query('.item-'+key,this.domNode)[0];
            return node?registry.byNode(node):null
        },

        _resetAllItemClass:function(className){
            query('.navMenuItem.'+className,this.domNode).forEach(function(nd){
                domClass.remove(nd,className);
            });
        },

        //TODO key can not contain space. set validate for dashboard key,

        // now just support two level.
        _initMenus:function(){
            var _t=this;
            _t.mainNavGroup = new NavGroup({
                'class':'navMainMenu'
            },this.menuNode);
            array.forEach(this.items,function(options){
                var item = new NavItem(lang.mixin({
                    'class':'navMainMenuItem',
                    navBar:_t
                },options));
                _t.mainNavGroup.addChild(item);
            });
            if(_t.items.length ==0){
                domStyle.set(_t.domNode,'display','none');
            }
        },
        //tag: public
        collapse:function(flag){
            var ready=new Deferred();
            if(this.collapse == !!flag){
                ready.resolve();
            }else{
                this._collapseAnim(function(){
                    ready.resolve();
                }).play();
            }
            return ready.promise;
        },
        _setCollapsedAttr:function(flag){
            this.collapsed=flag;
            if(this.collapsed){
                domClass.add(this.domNode,'collapsed');
            }else{
                domClass.remove(this.domNode,'collapsed');
            }
        },
        _setMenuSizeAttr:function(menuSize){
            var _t =this;
            switch(menuSize){
                case 'full':{
                    this.show();
                    this.set('collapsed',false);
                    break;
                }
                case 'collapsed':{
                    this.show();
                    this.set('collapsed',true);
                    break;
                }
                case 'hidden':{
                    domClass.add(_t.domNode,'hide');
                    break;
                }
                default:{}
            }
        },
        //tag: public
        hide:function(){
            var _t=this;
            var ready= new  Deferred();
            baseFx.fadeOut({
                node:_t.domNode,
                onEnd:function(){
                    _t.domNode.opacity = '';
                    domClass.add(_t.domNode,'hide');
                    ready.resolve();
                }
            }).play();
            return ready.promise;
        },
        //tag: public
        show:function(){

            var _t=this;
            var ready= new  Deferred();
            baseFx.fadeIn({
                node:_t.domNode,
                beforeBegin:function(){
                    domClass.remove(_t.domNode,'hide');
                },
                onEnd:function(){
                    _t.domNode.opacity = '';
                    ready.resolve();
                }
            }).play();
            return ready.promise;

        },
        //tag:public
        toggleVisible:function(){
            if(domClass.contains(this.domNode,'hide')){
                return this.show();
            }else{
                return this.hide();
            }
        },
        _initListeners:function(){
            var _t=this;
            on(this.collapseToggle,'click',function(){
                _t.collapse(!_t.collapsed).then(function(){
                    topic.publish('portal/app/resize');
                });
            });
            topic.subscribe('portal/switchView',function(viewKey){
                _t.selectItem(viewKey);
            })
        },
        selectItem:function(key){
            this.reset();
            var item = this.getItemByKey(key);
            if(item){
                item.setSelected();
            }
        },
        reset:function(){
            this._resetAllItemClass('selected');
            this._resetAllItemClass('showSubMenu');
            this._resetAllItemClass('childSelected');
        },
        _autoSize:function(appWidth){
            if(this.menuSize == "responsive"){
                if(appWidth){
                    if(appWidth>=this.fullAppWidth){
                        this.set('menuSize','full');
                    }else if(appWidth>=this.smallAppWidth){
                        this.set('menuSize','collapsed');
                    }else{
                        this.set('menuSize','hidden');
                    }
                }
            }
        },

        _collapseAnim:function(cb){
            var _t=this;
            var startWidth = domStyle.getComputedStyle(this.domNode).width;
            this.set('collapsed',!this.collapsed);
            var endWidth = domStyle.getComputedStyle(this.domNode).width;
            //console.debug('collapse',startWidth,endWidth);

            var o, l,bs,anim = baseFx.animateProperty({
                node:this.domNode,
                //duration:500,
                properties: {
                    minWidth: {
                        start: parseInt(startWidth),
                        end: parseInt(endWidth),
                        units:"px"
                    },
                    maxWidth: {
                        start: parseInt(startWidth),
                        end: parseInt(endWidth),
                        units:"px"
                    }
                }
            });

            var s =this.domNode.style;
            aspect.after(anim, "beforeBegin", function(){
                o = s.overflow;
                s.overflow='hidden';

                if(_t.region == 'right') {
                    l = s.left;
                    s.left = '';
                    s.right = 0;
                }

            }, true);
            var fini = function(){
                s.overflow = o;
                s.minWidth="";
                s.maxWidth="";

                if(_t.region == 'right'){
                    s.left=l;
                    s.right='';
                }
                cb();
            };
            aspect.after(anim, "onStop", fini, true);
            aspect.after(anim, "onEnd", fini, true);

            return anim;
        }
    })
});