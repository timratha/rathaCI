define([
    'dojo/dom-class',
    'dojo/dnd/Moveable',
    'dojo/dom-style',
    'dstore/Trackable',
    'dijit/registry',
    'dojo/aspect',
    'dstore/Memory',
    'dgrid/Grid',
    'dgrid/OnDemandGrid',
    'dojo/_base/array',
    'portal/_base/common/Util',
    'dojo/text!./templates/DijitRegistryPane.html',
    'dojo/dom-geometry',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'xstyle/css!./css/DijitRegistryPane.css'
],function(domClass, Moveable, domStyle, Trackable, registry, aspect, Memory, Grid, OnDemandGrid, array, Util, template,domGeometry, declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase){

    return  declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
        declaredClass:'DijitRegistryPane',
        templateString:template,
        testInterval: 1000*10, //just for check timestamp.

        postCreate:function(){
            this.inherited(arguments);
            this.maxNum = 0;
            this.typeCountStore=new declare([Memory,Trackable])({
                idProperty:'type',
                data:[]
            });

            var _t=this;
            aspect.after(registry,'add',function(widget){
                var type = widget.declaredClass|| 'unknownClass';
                _t.typeCountStore.get(type).then(function(item){
                    if(item){
                        item.counts++;
                        if(item.counts > item.max){
                            item.max=item.counts;
                            item.maxUpdatedTime=Date.now();
                        }
                    }else{
                        item={
                            type:type,
                            counts:1,
                            max:1
                        }
                    }
                    item.updatedTime=Date.now();
                    return _t.typeCountStore.put(item)
                }).then(function(){
                    _t.renderNum();
                });
            },true)

            aspect.before(registry,'remove',function(itemID){
                var widget = dijit.registry._hash[itemID];
                if(widget){
                    var type = widget.declaredClass || 'unknownClass';
                    _t.typeCountStore.get(type).then(function(item){
                        if(item){
                            item.counts--;
                            item.updatedTime=Date.now();
                            return _t.typeCountStore.put(item)
                        }
                    }).then(function(){
                        _t.renderNum();
                    });
                }
            });

            this.countsGrid = new OnDemandGrid({
                columns : {
                    type: {
                        label: "type"
                    },
                    counts: {
                        label: "counts"
                    },
                    max: {
                        label: "max",
                        renderCell:function(object, value, node, options){
                            var newMax = Date.now()- object.maxUpdatedTime < _t.testInterval;
                            domClass.toggle(node,'error',newMax);
                            node.innerHTML=value;
                        }
                    }
                },
                collection: this.typeCountStore.filter(function(item){
                    // update in 1 min; //TODO settings , query ?
                    return Date.now() - item.updatedTime<  _t.testInterval
                })
            },this.countsGridNode);
            this.countsGrid.set("sort", 'max', true);
            new Moveable(this.domNode);
            // clear the items not fit the filter.
        },

        renderNum:function(){
            var currentNum=dijit.registry.length;
            if(currentNum>this.maxNum) {
                this.maxNum=currentNum;
                this.maxUpdatedTime=Date.now();
            }
            this.HashTotalNumber.innerHTML=currentNum;
            this.MaxTotalNumber.innerHTML=this.maxNum;
            domClass.toggle(this.MaxTotalNumber,'errorMax',Date.now() - this.maxUpdatedTime<  this.testInterval);
        },

        startup:function(){
            this.placeAt(document.body);
            this.countsGrid.startup();
            this.inherited(arguments);
            //this.startCount();
        }
    });
})