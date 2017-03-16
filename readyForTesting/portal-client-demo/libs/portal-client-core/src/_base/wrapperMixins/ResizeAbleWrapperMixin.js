define([
    'dojo/dom-geometry',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/on',
    'dojox/layout/ResizeHandle',
    'dojo/dom-construct',
    'dijit/_base/manager',
    'dojo/_base/declare',
    'xstyle/css!dojox/layout/resources/ResizeHandle.css',
    'xstyle/css!./css/ResizeAbleWrapperMixin.css'
],function(domGeometry, domStyle, domClass, on, ResizeHandle, domConstruct, manager,declare
){
    // summary:
    //
    return declare([],{

        resizeAble:true,

        resizeAxis:'xy',

        postCreate:function(){
            var _t=this;
            this.inherited(arguments);
            domClass.add(this.domNode,'ResizeAbleWrapperMixin');
            this.resizeHandle=new ResizeHandle({
                targetId: this.id,
                resizeAxis: this.resizeAxis
            }).placeAt(this.domNode);
            on(this.resizeHandle, "resize", function (e) {
                _t.emit('resize');
            });
            domStyle.set(this.resizeHandle.domNode,'display',this.resizeAble?"":"none");
        },
        _setResizeAbleAttr:function(val){
            this.resizeAble=val;
            this.resizeHandle && domStyle.set(this.resizeHandle.domNode,'display',this.resizeAble?"":"none");
        },
        _setInstanceAttr:function(){
            this.inherited(arguments);

            var _titleHeight = domStyle.get(this.wrapperTitleBar.domNode,"height");
            var maxHeight = domStyle.get(this.instance.domNode,"max-height");
            var maxWidth = domStyle.get(this.instance.domNode,"max-width");
            this.defer(function(){ // use defer to ensure resizeHandle already created.
                this.resizeHandle.minSize = {
                    w:domStyle.get(this.instance.domNode,"min-width") || 100,
                    h:(domStyle.get(this.instance.domNode,"min-height") || 100) + _titleHeight
                }
                if(maxWidth || maxHeight){
                    this.resizeHandle.constrainMax =  true;
                    this.resizeHandle.maxSize = {
                        w:maxWidth || 5000,
                        h:(maxHeight) ? (maxHeight-_titleHeight) :5000
                    }
                }
            })
        },
        startup:function(){
            this.inherited(arguments);
            this.resizeHandle.startup();
        }
    });
});