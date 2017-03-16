define([
    'dijit/form/NumberTextBox',
    'dojo/dom-class',
    'dojo/dom-style',
    'dijit/registry',
    'dojo/on',
    'dojo/text!./templates/RasterLayout.template.html',
    'dojo/text!./templates/RasterLayout.setting.template.html',
    'dojo/dom-geometry',
    'dojo/dom-construct',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/dnd/Source',
    './Layout',
    '../_base/widgetWrappers/WidgetWrapperBase',
    '../_base/wrapperMixins/RemoveAbleWrapperMixin',
    '../_base/wrapperMixins/FullScreenAbleWrapperMixin',
    '../_base/wrapperMixins/TittleBarToggleMixin',
    'xstyle/css!./css/RasterLayout.css'
],function(NumberTextBox, domClass, domStyle, registry, on, rasterlayoutTemplate, settingFormTemplate, domGeometry, domConstruct, declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, Source, Layout, WidgetWrapperBase, RemoveAbleWrapperMixin, FullScreenAbleWrapperMixin, TittleBarToggleMixin){

    var Cell=declare([Source],{
        declaredClass:'RasterLayoutCell',
        _widget:null,
        row:0,
        col:0,
        withHandles:true,
        swappable:true,
        addWidget:function(widget){
            return this.insertNodes(false,[widget.domNode]);
        },
        resize:function(dim){
            if(dim){
                domGeometry.setMarginBox(this.node,dim);
                if(!!this._widget){
                    var computedStyle = domStyle.getComputedStyle(this.node);
                    var pd = domGeometry.getPadBorderExtents(this.node, computedStyle);
                    var size ={};
                    dim.w ? size.w = dim.w-pd.w : 0;
                    dim.h ? size.h = dim.h-pd.h : 0;
                    this._widget.resize(size);
                }
            }
        },
        insertNodes: function(addSelected, data, before, anchor){
            var w=registry.byNode(data[0]);
            if(!this._widget || (this.swappable && w.parentCell )){
                this._oldWidget = this._widget;
                this._widget=w;
                this._widget.parentCell=this;
                this.inherited(arguments);
                this.resize();
                return true;
            }else{
                return false;
            }
        },
        delItem:function(id){
            this.inherited(arguments);
            if(this._widget && this._widget.id==id ){
                this._widget=null;
            }
        },
        removeWidget:function(){
            var _id=this._widget.domNode.id;
            this._widget.destroyRecursive();
            this.delItem(_id);
        },
        onDrop: function(source, nodes, copy){
            if(source != this){
                this.inherited(arguments);
                if(this._oldWidget){
                    source.onDrop(this,[this._oldWidget.domNode],false);
                    this._oldWidget=null;
                }
                this.emit('drop');//TODO submit twice
            }
        }
    });
    var layout = declare([Layout,TemplatedMixin,WidgetsInTemplateMixin],{
        cols:2,
        rows:2,
        _gridCells:null,
        templateString:rasterlayoutTemplate,
        declaredClass:'RasterLayout',

        postCreate:function(){
            this._initGrid();
            this.inherited(arguments);
        },
        getLayoutChildConfig:function(widget){
            return {
                col:widget.parentCell.col,
                row:widget.parentCell.row
            };
        },
        createWidget:function(widgetModel){
            var _t=this;
            console.debug('creating widget',widgetModel);
            return new declare([WidgetWrapperBase,RemoveAbleWrapperMixin,FullScreenAbleWrapperMixin],{
                declaredClass:'RasterLayout.ChildWidget',
                removeAble:true,
                removeFromParent:function(){
                    _t.removeWidget(this);
                }
            })({
                model:widgetModel
            });
        },
        addWidget:function(widget,layoutConf){
            this.inherited(arguments);
            var row=layoutConf.row;
            var col=layoutConf.col;
            if( row !=undefined && col !=undefined){
                this._gridCells[row][col].addWidget(widget);
                return;
            }
            // if no layoutChildConfig
            for(var i= 0;i<this.rows;i++ ){
                for(var j= 0;j<this.cols;j++ ){
                    if(this._gridCells[i][j].addWidget(widget)){
                        return;
                    }
                }
            }
            throw 'this dashboard is full';//TODO
        },
        _initGrid:function(){
            var _t=this;
            this._gridCells=[];
            for(var i= 0;i<this.rows;i++ ){
                var tr=domConstruct.create('tr',null,this.containerNode);
                this._gridCells[i]=[];
                for(var j= 0;j<this.cols;j++ ){
                    var td=domConstruct.create('td',{'class':'cell'},tr);
                    this._gridCells[i][j]=new Cell(td,{
                        row: i,
                        col:j
                    });
                    on(this._gridCells[i][j],'drop',function(){
                        _t.emit('portal/layout/update');
                        _t.resize();
                    })
                }
            }
            //console.log(this._gridCells);
        },
        layout:function(){
            var dim = domGeometry.getContentBox(this.domNode);
            var grid_dim={
                w:parseInt(dim.w/this.cols),
                h:parseInt(dim.h/this.rows)
            };
            for(var i= 0;i<this.rows;i++ ){
                for(var j= 0;j<this.cols;j++ ){
                    this._gridCells[i][j].resize(grid_dim);
                }
            }
        },
        removeWidget:function(widget){
            console.debug('remove widget',widget);
            widget.parentCell.removeWidget();
            this.emit('portal/layout/widget/remove',{widgetId:widget.model.id});
            this.resize();
        }
    });

    var SettingForm=declare([WidgetBase,TemplatedMixin,WidgetsInTemplateMixin],{
        declaredClass:'RasterLayout.SettingForm',
        templateString: settingFormTemplate,
        postCreate: function() {
            this.inherited(arguments);
            this.imageNode.src = require.toUrl("portal/layouts/images/rasterLayout.png");
        },
        getValues:function(){
            var values = this.form.getValues();
            values.maxNum=values.cols * values.rows;
            return values;
        },
        validate:function(){
            return this.form.validate();
        }
    });

    layout.getSettingForm=function(){
        return new SettingForm();
    };
    return layout;
});