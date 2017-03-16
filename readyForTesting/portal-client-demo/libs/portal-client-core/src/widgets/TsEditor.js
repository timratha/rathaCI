define([
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/date',
    'dojo/date/locale',
    '../_base/common/CalendarPopup',
    'dojo/query',
    'dgrid/Selection',
    'dstore/Csv',
    'dstore/Memory',
    'dstore/Trackable',
    'dojo/on',
    'dojo/aspect',
    'dojo/text!./templates/TsEditorGridPane.html',
    'dojox/layout/ToggleSplitter',
    'dijit/form/Button',
    'dijit/layout/_LayoutWidget',
    'dijit/form/NumberTextBox',
    'dgrid/Editor',
    'dgrid/Keyboard',
    'dgrid/OnDemandGrid',
    'dijit/_Container',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'dijit/layout/AccordionContainer',
    'dojo/promise/all',
    '../_base/store/PortalStore',
    'dojo/_base/array',
    'dojo/topic',
    'dojo/_base/lang',
    'dojo/text!./templates/TsEditor.template.html',
    'dojo/dom-geometry',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'xstyle/css!./css/TsEditor.css',
    'xstyle/css!dojox/layout/resources/ToggleSplitter.css',
    'highcharts/highstockMore',
    'highcharts/draggable-points'

],function(domClass, domStyle, date, locale, CalendarPopup,query, Selection, Csv,Memory, Trackable, on, aspect, tseditorgridpaneTemplate, ToggleSplitter, Button, LayoutWidget, NumberTextBox,
           Editor, Keyboard, OnDemandGrid, Container, BorderContainer, ContentPane, AccordionContainer,  all, PortalStore,array,topic,
           lang, tseditorTemplate, domGeometry, declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase){

    //TODO nav sync, select series , records.
    // better adape highchart to be a widget of dojo. have widgetBase interface.

    var GridPane = declare([LayoutWidget,TemplatedMixin],{
        templateString:tseditorgridpaneTemplate,
        grid:null,
        diffStore:null,
        edited:false,
        handlers:null,
        postCreate:function(){
            this.inherited(arguments);
            this.createDropArear();
            var collection = this.collection   =  new declare([Memory,Trackable])({idProperty:"x",data:[]})
        },
        addRow:function(){
            var ts = new Date().getTime();
            this.series.addPoint([ts,0],true);
            var pointId = this.series.processedXData.indexOf(ts)
            this.collection.put(this.series.data[pointId]);
        },
        createGrid:function(series, editable) {
            var _t = this;
            var dec = this.seriesConf.decimals;
            this.series =series;

            this.watch("edited",function(attr, oldVal, newVal){
                //console.log("this.watch(edited");
                if(newVal){
                    topic.publish("TsEditor_valueEdited",{val:newVal});
                    _t.set("title",_t.title + "<i title='This series has been edited' class='fa fa-pencil-square-o editedIcon'></i>");
                }else{
                    _t.set("title",_t.title.replace("<i title='This series has been edited' class='fa fa-pencil-square-o editedIcon'></i>",""));
                }
            })
            series.legendItem.parentGroup.element.id = "legendItem_"+series.index;
            var xTranslate =  (series.legendItem.parentGroup.translateX*(-1))+7;
            var yTranslate =  series.legendItem.parentGroup.translateY*(-1);
            this.set('title','<svg width="26px" height="16px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <use xlink:href="#'+series.legendItem.parentGroup.element.id+'" transform="translate('+xTranslate+','+yTranslate+')" /></svg> ' +this.title);


            //       if(series.cropped) {
            this.collection.setData(series.points);
            //       }else{
            //          this.collection.setData(series.data);
            //      }

            var deps = [OnDemandGrid, Selection];

            if (editable) {
                deps.push(Editor);
                this.diffStore = new Memory({ idProperty: "x",data:[]});
            }
            var inputDateFormat = this.chartOptions && this.chartOptions.rangeSelector && this.chartOptions.rangeSelector.inputDateFormat || '%b %e, %Y';



            this.own(topic.subscribe("tsEditor/resetData",function(obj){
                if(series.cropped) {
                    _t.grid.set("collection", new declare([Memory, Trackable])({
                        idProperty: "x",
                        data: _t.series.points
                    }));
                }else{
                    _t.grid.set("collection",_t.collection.filter(function(item){
                        return (item.x>= obj.min &&  item.x<= obj.max);
                    }));
                }
            }));
            var valFormatter =function(val){return (val) ? parseFloat(val).toFixed(dec) :""};
            var cols = [{
                field: "x",
                label: "Timestamp",
                formatter: function (v) {
                    return locale.format(new Date(v))
                }
            }];
            if (series.type == "line") {
                cols.push({
                    field: 'y',
                    className:"valueField",
                    label: 'Value',
                    editor:"number",autoSave:true,editOn:"dblclick",
                    formatter:(dec) ? valFormatter:null
                })
            }else if(series.type=="arearange"){
                cols.push({
                    className:"valueField",
                    field: 'low',
                    label: 'Min',
                    formatter:(dec) ? valFormatter:null
                },{
                    className:"valueField",
                    field: 'high',
                    label: 'Max',
                    formatter:(dec) ? valFormatter:null
                })

            }
            var grid = this.grid = new  declare(deps)({
                collection:this.collection,
                selectionMode: 'single',
                deselectOnRefresh:false,
                noDataMessage: this.seriesConf.noDataMessage || 'No Data Found',
                columns: cols
            },this.gridNode);



            /*    if (editable) {
             grid.on("dgrid-datachange",function(e){
             var data = e.cell.row.data;
             _t.diffStore.put({x:data.x,oldValue: e.oldValue,value: parseFloat(e.value)})
             })

             }*/

            this.collection.on("scrollToRow",function(point){
                _t.accContainer.selectChild(_t)
                grid.bodyNode.scrollTop  = grid.rowHeight*grid.collection.storage.index[point.x];


            });

            this.collection.on("update",function(event){
                event.target.update(parseFloat(event.target.y));
                event.target.select(true,true);
                if(!_t.edited) {
                    _t.set("edited", true);
                }
                _t.diffStore.put({x:event.target.x,value: parseFloat(event.target.y)})
                setTimeout(function(){grid.select(grid.row(event.target.x))},400);
            });


            this.collection.on("add",function(event){
                event.target.select(true,true);
                if(!_t.edited) {
                    _t.set("edited", true);
                }
                _t.diffStore.put({x:event.target.x,value: parseFloat(event.target.y)})
                setTimeout(function(){grid.select(grid.row(event.target.x))},400);
            });


            this.grid.startup();
            this.resize();

        },
        refresh:function(){
            this.grid.set("collection", new declare([Memory, Trackable])({
                idProperty: "x",
                data: this.series.points
            }));
        },
        createDropArear:function(){
            var _t=this;
            var csvParser = new Csv();
            csvParser.newline="\n";
            csvParser.fieldNames = ["Timestamp","Value"];

            var findDelimiter = function(line){
                var delimiter = ",";
                if(line.indexOf(",")>-1){
                    delimiter = ",";
                }else if(line.indexOf(";")>-1){
                    delimiter = ";";
                }else if(line.indexOf("\t")>-1){
                    delimiter = "\t";
                }else if(line.indexOf(" ")>-1){
                    delimiter = "\t";
                }
                return delimiter;
            }

            var csvParser = function(text){
                text = text.split("\n");
                var data = []
                var delimiter = null;
                array.forEach(text,function(item){
                    if(item[0].charAt(0)!="#"){
                        if(!delimiter){
                            delimiter = findDelimiter(item);
                        }
                        data.push(item.split(delimiter))

                    }
                })
                return data;
            }
            if(this.editable){

                on(this.dataDropAreaNode,'dragover',function(e){
                    domClass.add(this,'filehover');
                    e.preventDefault();
                });

                on(this.dataDropAreaNode,'dragleave',function(e){
                    domClass.remove(this,'filehover');
                    e.preventDefault();
                });

                on(this.dataDropAreaNode,'dragend',function(e){
                    domClass.remove(this,'filehover');
                    e.preventDefault();
                });

                on(this.dataDropAreaNode,'drop',function(e){
                    e.preventDefault();
                    domClass.remove(this,'filehover');
                    topic.publish("portal/systemMessage", {type: 'success', content: 'Processing new data, please wait'});

                    var fileList = e.dataTransfer.files;
                    if(fileList.length == 0){
                        return false;
                    }

                    var file=fileList[0];
                    setTimeout(function() {
                        var reader = new FileReader();//Firefox 3.6 Chrome	7 Internet Explorer	10 Opera 12.02 Safari 6.0.2
                        reader.onloadend = function (e) {
                            //TODO
                            var data = csvParser(e.currentTarget.result);

                            var ids = array.map(data, function (item) {
                                var ts = new Date(item[0]).getTime();
                                if (!isNaN(ts)) {

                                    _t.series.addPoint([ts, parseFloat(item[1])], false);
                                    return ts;

                                }
                            });
                            _t.series.chart.redraw()
                            var cnt = 0;
                            array.forEach(ids, function (id) {
                                var pointId = _t.series.processedXData.indexOf(id);
                                if (pointId > -1 && _t.series.data[pointId]) {
                                    _t.collection.putSync(_t.series.data[pointId]);
                                    cnt++;
                                }
                            });
                            topic.publish("portal/systemMessage", {
                                type: 'success',
                                content: 'Added ' + cnt + ' datapoints to ' + _t.series.options.name
                            });

                            topic.publish("TsEditor_valueEdited", _t.diffStore);

                        }
                        reader.readAsText(file);
                    },1000);

                });
                on(this.dataDropAreaNode,'dragenter',function(e){
                    e.preventDefault();
                });
                on(this.dataDropAreaNode,'dragover',function(e){
                    e.preventDefault();
                })
            }else{
                domStyle.set(this.dataDropAreaNode,{
                    display:'none'
                })
                domStyle.set(this.domNode,'padding-bottom',"");
            }
        },
        startup:function(){
            this.inherited(arguments);
            //console.log("STARTUP GRIDPANE")

        },
        layout:function(){
            if(this.grid){
                var cb=domGeometry.getContentBox(this.domNode)
                domGeometry.setMarginBox(this.grid.domNode,{
                    w:cb.w,
                    h:cb.h
                });
                this.grid.resize()
                this.grid.refresh();
            }
        },
        resetEdit:function(){
            if (this.seriesConf.editable) {
                this.diffStore.setData([]);
                this.grid.clearSelection();
                this.set("edited",false)
            }
        },
        resize:function(){
            this.inherited(arguments);

        },
        onHide:function(){
            this.inherited(arguments);
            this.visible=false;
        },
        onShow:function(){
            this.inherited(arguments);
            this.visible=true;
        }
    });




    var ChartPane= declare([LayoutWidget],{
        chart:null,
        postCreate:function(){
            this.inherited(arguments);
            lang.mixin(this.chartOptions.chart,{
                renderTo: this.domNode
            });
            var chart= this.chart=new Highcharts.StockChart(this.chartOptions);

        },
        startup:function(){
            this.inherited(arguments);

            this.chart.showLoading("Loading data...");
        },
        _createChart:function(){


        },
        addSeries:function(sc,collection){
            var clickDetected = false;
            lang.mixin(sc,{
                point: {
                    events: {
                        click: function(e) {
                            if(clickDetected) {
                                collection.emit('scrollToRow', e.point);
                                clickDetected = false;
                            } else {
                                clickDetected = true;
                                setTimeout(function() {
                                    clickDetected = false;
                                }, 500);
                            }

                        }

                    }
                }
            });

            if(sc.draggableY) {
                sc.point.events.drop = function (e) {
                    e.target.y = e.target.y.toFixed(3);

                    collection.emit('update', {target: e.target});
                    collection.emit('scrollToRow', e.target);
                }
            }
            return this.chart.addSeries(sc,true,false);

        },
        layout:function(){
            var dim = domGeometry.getContentBox(this.domNode);//TODO
            if(this.chart && this.chart.container){
                this.chart.setSize(dim.w,dim.h,false);
            }else{
                // need create after dom displayed , or will have problem with input group,(or use skipClone:true)
                this._createChart();
            }
        }
    });


    return  declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,Container],{
        templateString:tseditorTemplate,
        chartOptions:null,
        graphs:null,
        chartObj:null,
        declaredClass:"TsEditor",
        postCreate:function(){
            var _t=this;
            this.inherited(arguments);
            this.chartObj= []
            this.seriesConf = this.chartOptions.series || [];
            delete(this.chartOptions.series);
            this.chartPane = new ChartPane({
                chartOptions:this.chartOptions,
                region:'center'
            },this.chartPaneNode);

            _t.showButtons(this.seriesConf);

        },
        startup:function(){
            this.inherited(arguments);
            var _t=this;
            this.chartPane.startup();
            if(this.seriesConf.length>0){
                this.addSeries(this.seriesConf,true)
            }else{
                _t.zoomEvents()
            }
            this.own(topic.subscribe("TsEditor_valueEdited",function(e){
                _t.saveBtn.set("disabled",false)
            }))

        },
        addSeries:function(conf,inital){
            var _t=this;
            var ret = [];
            array.forEach(conf,function(ser,i){
                var retObj = {};
                var _gridPane = _t.createGridPane(ser);

                var serie =  _t.chartPane.addSeries(ser,_gridPane.collection);
                Highcharts.addEvent(serie,"afterAnimate",function(){
                    _gridPane.placeAt(_t.grids);
                    _t.grids.resize()
                    _gridPane.createGrid(serie,ser.editable);
                    _t.chartPane.chart.hideLoading();
                });
                retObj.series = serie;
                retObj.gridPane =  _gridPane;
                retObj.seriesConfig = ser
                ret.push(retObj);
                _t.chartObj.push(retObj);
            });
            if(!inital) {
                this.chartPane.chart.redraw()
            }else{
                _t.zoomEvents()
            }

            _t.showButtons(conf);
            return ret;
        },
        zoomEvents:function(){
            var _refreshTimer;
            Highcharts.addEvent(this.chartPane.chart.xAxis[0],"afterSetExtremes",function(e){
                clearTimeout(_refreshTimer);
                _refreshTimer= setTimeout(function(){
                    topic.publish("tsEditor/resetData",{min: e.min,max: e.max})
                },500)
            })
        },
        createGridPane:function(serie){


            var pane=new GridPane({
                title:serie.label || "",
                seriesConf:serie,
                editable:serie.editable || false,
                accContainer:this.grids
            });

            return pane;

        },
        showButtons:function(seriesConf){
            var editable=array.some(seriesConf,function(g){
                return g.editable
            });
            if(!editable){
                domStyle.set(this.buttonBar.domNode,'display','none');
            }else{
                domStyle.set(this.buttonBar.domNode,'display','block');
                this.resize()
            }
        },
        resize:function(dim){
            this.inherited(arguments);
            this.borderContainer.resize(dim);
            var centralWidget = this.borderContainer.getChildren('center').filter(function(c){
                return c.region=='center'
            })[0];
            if(dim){
                // just do it after set size.
                //    this.borderContainer.getSplitter('right').set('state','full')
                var splitter =  this.borderContainer.getSplitter('right')
                if(centralWidget && domGeometry.getMarginBox(centralWidget.domNode).w <500 && splitter.get("state")!="collapse"){
                    splitter.set('state','collapse')
                }else if(splitter.get("state")!="full"){
                    splitter.set('state','full')
                }
            }
        },

        _save: function() {
            this.save();
        },

        save:function(){
            this.chartPane.chart.showLoading("Saving data, please wait...");
            //      topic.publish("portal/systemMessage",{type:'success',content:'Saving data, please wait...'});
        },

        onSaved:function(error){
            var _t= this;
            if(error){
                topic.publish("portal/systemMessage",{type:'error',content:'Error saving changes to server'});
            }else {
                topic.publish("portal/systemMessage", {type: 'success', content: 'All changes successfully saved'});

                array.forEach(_t.chartObj, function (item) {
                    if (item.seriesConfig.editable) {
                        item.gridPane.resetEdit();
                    }
                })

                array.forEach(_t.chartPane.chart.getSelectedPoints(), function (point) {
                    point.select(false, false)
                });
            }
            this.chartPane.chart.hideLoading();
        },
        reset:function(){
            //console.log("resetdata")
        },
        close:function(){
            this.emit("close");
            this.destroyRecursive();
        }

    });
})