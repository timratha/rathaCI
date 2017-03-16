define([
    '../_base/common/Util',
    '../_base/wrapperMixins/DockAbleWrapperMixin',
    '../_base/common/IconDock',
    'dijit/_WidgetBase',
    'dojo/_base/array',
    'dojo/dom-geometry',
    'dojo/on',
    'dojo/query',
    'dojo/dom-style',
    'dijit/_Container',
    'dojo/text!./templates/FreeLayout.template.html',
    'dojo/text!./templates/FreeLayout.setting.template.html',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    './Layout',
    '../_base/widgetWrappers/WidgetWrapperBase',
    '../_base/wrapperMixins/RemoveAbleWrapperMixin',
    '../_base/wrapperMixins/ResizeAbleWrapperMixin',
    '../_base/wrapperMixins/MoveAbleWrapperMixin',
    '../_base/wrapperMixins/FullScreenAbleWrapperMixin',
    '../_base/wrapperMixins/TittleBarToggleMixin',
    '../_base/title-bar/TitleAction',
    'xstyle/css!./css/FreeLayout.css'
],function(Util, DockAbleWrapperMixin,IconDock,WidgetBase, array, domGeometry, on, query, domStyle, Container, freelayoutTemplate,freelayoutSettingTemplate, declare, WidgetsInTemplateMixin, TemplatedMixin, Layout,WidgetWrapperBase,RemoveAbleWrapperMixin,ResizeAbleWrapperMixin,MoveAbleWrapperMixin,FullScreenAbleWrapperMixin,TittleBarToggleMixin,TitleAction){

    var ChildWidget = declare([WidgetWrapperBase,
        RemoveAbleWrapperMixin,
        ResizeAbleWrapperMixin,
        FullScreenAbleWrapperMixin,
        MoveAbleWrapperMixin,
        DockAbleWrapperMixin
    ],{
        declaredClass:'FreeLayout.ChildWidget',
        style:'position:absolute;',
        removeAble:true,
        zIndex:100, //default on the top;
        removeFromParent:function(){
            this.getParent().removeWidget(this);
        },
        _setZIndexAttr:function(index){
            this.zIndex=index;
            domStyle.set(this.domNode,'zIndex',index);
        }
    })

    var layout = declare([Layout,TemplatedMixin,WidgetsInTemplateMixin,Container],{
        templateString:freelayoutTemplate,
        declaredClass:'FreeLayout',
        postCreate:function(){
            this.inherited(arguments);
            var _t=this;
            this.dock = new declare([IconDock],{
                addNode:function(widget){
                    widget.originPos=_t._getWidgetPosition(widget);
                    this.inherited(arguments);
                }
            })(null,this.dockNode);
            this.createDockAction();
        },
        getLayoutChildConfig:function(widget){
            return {
                docked:widget.docked,
                pos:widget.docked? widget.originPos:this._getWidgetPosition(widget),
                zIndex:widget.get('zIndex')
            }
        },
        _getWidgetPosition:function(widget){
            var dim1=domGeometry.position(this.domNode, true);
            var dim2=domGeometry.position(widget.domNode, true);
            var mbox = domGeometry.getMarginBox(widget.domNode);
            return {w:mbox.w, h:mbox.h, l: dim2.x-dim1.x, t:dim2.y-dim1.y};
        },
        _setWidgetPosition:function(widget,pos){
            domStyle.set(widget.domNode,'top',    pos.t +'px');
            domStyle.set(widget.domNode,'left',   pos.l +'px');
            domGeometry.setMarginBox(widget.domNode,{w:pos.w,h:pos.h});
        },
        createWidget:function(widgetModel){
            var _t=this;
            console.debug('creating widget',widgetModel);
            return new ChildWidget({
                model:widgetModel,
                dockTo:_t.dock,
                getParent:function(){
                    return _t;
                }
            });
        },
        addWidget:function(widget,layoutConf){
            this.inherited(arguments);
            var _t=this;
            this.addChild(widget);
            var pos= layoutConf.pos ||{ t: 0, l: 0, w: 400, h: 400};
            this._setWidgetPosition(widget,pos);
            if(layoutConf.docked){
                widget.dock();
            }
            widget.set('zIndex',layoutConf.zIndex);
            on(widget,'resize',function(){
                _t.emit('portal/layout/update');
            });
            on(widget,'movestop',function(){
                _t.bringToTop(widget);
                _t.emit('portal/layout/update');
            });
            on(widget,'docked',function(){
                _t.emit('portal/layout/update');
                _t.dockAction.refresh();
            });
            on(widget,'restored',function(){
                _t.emit('portal/layout/update');
                _t.dockAction.refresh();
            });
            _t.dockAction.refresh();
        },
        removeWidget:function(widget){
            console.debug('remove widget',widget);
            this.removeChild(widget);
            this.emit('portal/layout/widget/remove',{widgetId:widget.model.id});
        },
        layout:function(){
            array.forEach(this.getChildren(),function(w){
                w.resize();
            })
        },
        destroy:function(){
            this.inherited(arguments);
        },
        createDockAction:function(){
            var _t=this;

            this.dockAction= new TitleAction({
                //bug when continue click quick
                icon: "fa fa-minus",
                isAllDocked:function(){
                    var someNotDocked = array.some(_t.getChildren(),function(w){
                        return !w.docked;
                    });
                    return !someNotDocked;
                },
                onClick:function(){
                    if(this.isAllDocked()){
                        _t.dock.restoreAll();
                        this.set('icon','fa fa-minus')
                    }else{
                        array.forEach(_t.getChildren(),function(w){
                            w.dock();
                        });
                        this.set('icon','fa fa-plus')
                    }
                    this.refresh();
                },
                refresh:function(){
                    this.set('icon',this.isAllDocked()?'fa fa-plus':'fa fa-minus')
                }
            });
        },
        getActions: function () {
            var _t=this;
            var actions= this.inherited(arguments);
            actions.push(this.dockAction);
            actions.push({
                icon: "fa fa-columns",
                onClick: function () {
                    _t.dock.restoreAll().then(function(){
                        _t.autoPosition();
                    });
                }
            });
            return actions;
        },
        lock:function(flag){
            this.inherited(arguments);
            array.forEach(this.getChildren(),function(item){
                item.set('moveAble',!flag);
                item.set('resizeAble',!flag);
            });
        },
        autoPosition:function(){
            var _t=this;

            // set position relative.
            array.forEach(this.getChildren(),function(item){
                domStyle.set(item.domNode,{
                    position:"relative",
                    'vertical-align':'top',
                    display:'inline-block',
                    top :"0px",
                    left: "0px"
                });
            });

            // get the position.
            array.forEach(_t.getChildren(),function(item){
                item.pos = _t._getWidgetPosition(item);
            });
            // set the position
            array.forEach(_t.getChildren(),function(item){
                domStyle.set(item.domNode,{
                    position:"absolute"
                });
                _t._setWidgetPosition(item,item.pos);
                item.pos=null;
            });
            _t.emit('portal/layout/update');
        },
        bringToTop:function(widget){
            var widgets=this.getChildren();
            widgets = widgets.sort(function(w1,w2){
                return w1.get('zIndex') - w2.get('zIndex');
            });
            Util.removeFromArray(widgets,widget);
            widgets.push(widget);
            for(var i= 0;i<widgets.length;i++){
                widgets[i].set('zIndex',i);
            }
        }
    });


    var SettingForm=declare([WidgetBase,TemplatedMixin,WidgetsInTemplateMixin],{
        declaredClass:'FreeLayout.SettingForm',
        templateString:freelayoutSettingTemplate,
        postCreate: function() {
            this.inherited(arguments);
            this.imageNode.src = require.toUrl("portal/layouts/images/freeLayout.png");
        },
        getValues:function(){
            return {
            }
        },
        validate:function(){
            return this.form.validate();
        }
    });

    // TODO consider register setting form . consider generate form
    layout.getSettingForm=function(){
        return new SettingForm();
    };
    return layout;
});