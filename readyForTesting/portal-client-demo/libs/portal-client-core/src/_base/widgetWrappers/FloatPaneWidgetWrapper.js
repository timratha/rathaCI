define([
    'dojo/aspect',
    'dojo/dom-class',
    'dojox/layout/ResizeHandle',
    './WidgetWrapper',
    'dojo/_base/lang',
    'dojo/_base/fx',
    'dojo/query',
    'dojo/NodeList-traverse',
    'dojo/topic',
    'dojo/_base/array',
    "./DialogWidgetWrapper",
    'dijit/BackgroundIframe',
    'dojo/dom-geometry',
    'dojo/dnd/Moveable',
    'dojo/on',
    'dojo/_base/declare',
    'dojox/layout/FloatingPane',
    './WidgetConfigurableMixin',
    "dojo/text!./templates/FloatPaneWidgetWrapper.template.html",
    '../store/PortalStore'
], function (aspect, domClass, ResizeHandle, WidgetWrapper, lang, baseFx, query, NodeListTraverse, topic, array, DialogWidgetWrapper, BackgroundIframe, domGeometry, Moveable, on, declare, FloatingPane, WidgetConfigurableMixin, FloatPaneWidgetWrapperTemplate, PortalStore) {

    return declare([WidgetWrapper], {
        templateString: FloatPaneWidgetWrapperTemplate,
        layoutContainerNode:null,// set by layout , and use for get relative location.
        docked:false,
        dockable:true,
        resizeAxis:'xy',
        duration: 400,

        postCreate: function () {
            this.inherited(arguments);
            var _t=this;
            var mover = this.mover =new Moveable(this.domNode, {
                handle: this.wrapperTitleBar
            });
            mover.onMoving=function(mover, leftTop){
                //limit the moving area inside container
                leftTop.l=leftTop.l>=0?leftTop.l:0;
                leftTop.t=leftTop.t>=0?leftTop.t:0;
            };
            aspect.after(mover, "onMoveStop", function(mover){
                _t.pos=_t._getPosition();
                _t.onStateChanged();
            }, true);
            this.domNode.style.position = "absolute";

            this.resizeHandle = new ResizeHandle({
                targetId: this.id,
                resizeAxis: this.resizeAxis
            },this.resizeHandle);
            on(this.resizeHandle, "resize", function (e) {
                _t.pos=_t._getPosition();
                _t.onStateChanged();
            });
        },
        startup:function(){
            this.inherited(arguments);
            var _t=this;
            if(this.docked){
                this._dock();
                this.hide();
            }
            on(this.wrapperTitleBar.domNode,'mousedown',function(){
                _t.bringToTop();
            });
            on(this.domNode,'mousedown',function(){
                _t.bringToTop();
            });
            on(this.resizeHandle.domNode,'mousedown',function(){
                _t.bringToTop();
            });
        },
        onStateChanged:function(){
        },
        _getPosition:function(){
            // for internal use
            var dim1=domGeometry.position(this.layoutContainerNode, true);
            var dim2=domGeometry.position(this.domNode, true);
            return {w:dim2.w, h:dim2.h, l: dim2.x-dim1.x, t:dim2.y-dim1.y};
        },
        _buildInActions:function(){
            var _t=this;
            var actions= this.inherited(arguments);
            actions.push({
                icon:'fa fa-minus',
                onClick:function(){
                    _t.minimize();
                }
            });
            return actions;
        },
        bringToTop:function(){
            query(this.layoutContainerNode).children('.float-widget-wrapper').removeClass('top');
            domClass.add(this.domNode,'top');
        },
        destroy: function(){
            if(this._resizeHandle){
                this._resizeHandle.destroy();
            }
            this.inherited(arguments);
        },
        hide: function(/* Function? */ callback){
            // summary:
            //		Close, but do not destroy this FloatingPane
            baseFx.fadeOut({
                node:this.domNode,
                duration:this.duration,
                onEnd: lang.hitch(this,function() {
                    this.domNode.style.display = "none";
                    this.domNode.style.visibility = "hidden";
                    if(this.dockTo && this.dockable){
                        this.dockTo._positionDock(null);
                    }
                    if(callback){
                        callback();
                    }
                })
            }).play();
        },
        show: function(/* Function? */callback){
            var _t=this;
            // summary:
            //		Show the FloatingPane
            var anim = baseFx.fadeIn({node:this.domNode, duration:this.duration,
                beforeBegin: lang.hitch(this,function(){
                    this.domNode.style.display = "";
                    this.domNode.style.visibility = "visible";
                    if (this.dockTo && this.dockable) { this.dockTo._positionDock(null); }
                    if (typeof callback == "function") { callback(); }
                    this.docked = false;
                    if (this._dockNode) {
                        this._dockNode.destroy();
                        this._dockNode = null;
                    }
                    _t.resize();
                })
            }).play();
        },
        _dock: function(){
            if(this.dockable){
                this.title=this.wrapperTitleBar.title;//TODO
                this._dockNode = this.dockTo.addNode(this);
            }
        },
        minimize: function () {
            if(!this.docked&&this.dockable){
                this.hide(lang.hitch(this,"_dock"));
                this.docked = true;
                this.onStateChanged();
            }
        },
        moveTo:function(pos){
            this.domNode.style.top=pos.t+'px';
            this.domNode.style.left=pos.l+'px';
        }
    });
})
