define([
    'dojo/_base/Deferred',
    'dojo/promise/all',
    'dojo/dom-style',
    'dojo/dom-geometry',
    'dojo/_base/fx',
    'dijit/Tooltip',
    'dijit/_Container',
    'dojo/text!./templates/IconDock.template.html',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/_base/array',
    'dojo/_base/declare',
    'xstyle/css!./css/IconDock.css'

],function(Deferred, all, domStyle, domGeometry, fx, Tooltip, Container, icondockTemplate, WidgetBase, TemplatedMixin, array, declare){

    var DockNode = declare([WidgetBase, TemplatedMixin], {
        declaredClass:'IconDockContainer',
        templateString: '<div class="DockNode" style="visibility: hidden;" data-dojo-attach-event="click:onClick"><div class="${iconClass}"></div>',
        startup: function () {
            this.inherited(arguments);
            this.tooltip = new Tooltip({
                connectId: [this.domNode],
                label: this.label
            });
            var _t=this;
            this.dockAnim(function(){
                _t.widget.hide();
            }).play()
        },
        onClick: function () {
            this.restore();
        },
        restore:function(){
            var ready=new Deferred();
            this.widget.restore();
            var _t=this;
            this.restoreAnim(function(){
                _t.parent.removeChild(_t);
                _t.destroyRecursive();
                ready.resolve();
            }).play();
            return ready.promise;
        },
        destroy:function(){
            this.tooltip.destroy();
            this.inherited(arguments);
        },
        dockAnim:function(cb){
            var p,ol,ot,_t=this;
            var widgetPos = domGeometry.position(this.widget.domNode);
            var nodePos = domGeometry.position(this.domNode);
            return fx.animateProperty({
                node:this.widget.domNode,
                beforeBegin:function(){
                    p=this.node.style.position;
                    ol=this.node.style.left;
                    ot=this.node.style.top;
                    this.node.style.position='fixed';
                },
                properties: {
                    opacity: { start: 1, end: 0.2 },
                    top:{start:widgetPos.y,end:nodePos.y,unit:'px'},
                    left:{start:widgetPos.x,end:nodePos.x,unit:'px'}
                },
                onEnd:function(){
                    _t.domNode.style.visibility='';
                    this.node.style.position = p;
                    this.node.style.opacity='';
                    this.node.style.left=ol;
                    this.node.style.top=ot;
                    cb();
                }
            })
        },
        restoreAnim:function(cb){
            var p,ol,ot,_t=this;
            var widgetPos = domGeometry.position(this.widget.domNode);
            var nodePos = domGeometry.position(this.domNode);

            return fx.animateProperty({
                node:this.widget.domNode,
                beforeBegin:function(){
                    p=this.node.style.position;
                    ol=this.node.style.left;
                    ot=this.node.style.top;
                    this.node.style.position='fixed';
                    _t.domNode.style.visibility='hidden';
                },
                properties: {
                    opacity: { start:0.2, end: 1},
                    top:{start:nodePos.y,end:widgetPos.y,unit:'px'},
                    left:{start:nodePos.x,end:widgetPos.x,unit:'px'}
                },
                onEnd:function(){
                    this.node.style.position = p;
                    this.node.style.opacity='';
                    this.node.style.left=ol;
                    this.node.style.top=ot;
                    cb();
                }
            });
        }
    });

    return declare([WidgetBase,TemplatedMixin,Container],{
        templateString:icondockTemplate,
        declaredClass:'IconDock',

        //override
        addNode: function(widget){
            var node = new DockNode({
                parent:this,
                iconClass:widget.titleIcon || widget.iconClass,
                label:widget.title,
                widget:widget
            });
            this.addChild(node);
            node.startup();
        },
        restoreAll:function(){
            return all(array.map(this.getChildren(),function(item){
                return item.restore();
            }))
        }
    })
})