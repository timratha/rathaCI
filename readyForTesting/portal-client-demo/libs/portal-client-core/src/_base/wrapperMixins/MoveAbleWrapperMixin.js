define([
    'dojo/aspect',
    'dojo/on',
    'dojo/dom-class',
    'dojo/query',
    'dojo/dnd/Moveable',
    'dojox/layout/ResizeHandle',
    'dojo/dom-construct',
    'dijit/_base/manager',
    'dojo/_base/declare',
    'xstyle/css!./css/MoverAbleWrapperMixin.css'
],function(aspect, on, domClass, query, Moveable, ResizeHandle, domConstruct, manager,declare
){
    // summary:
    //
    return declare([],{
        moveAble:true,
        limitedInParent:true,
        postCreate:function(){
            this.inherited(arguments);
            if(this.moveAble){
                var _t=this;
                domClass.add(this.domNode,'MoveAbleWrapperMixin');
                this.movehandle=new declare([Moveable],{
                    onDragDetected:function(){
                        if(_t.moveAble){
                            this.inherited(arguments);
                        }
                    }
                })(this.domNode, {
                    handle: this.titleBarContainerNode
                });
                if(_t.limitedInParent){
                    aspect.after(this.movehandle, "onMoving", function(mover, leftTop){
                        leftTop.l=leftTop.l>=0?leftTop.l:0;
                        leftTop.t=leftTop.t>=0?leftTop.t:0;
                    }, true);
                }
                aspect.after(this.movehandle, "onMoveStop", function(){
                    _t.emit('movestop');
                }, true);
            }
        }
    });
});