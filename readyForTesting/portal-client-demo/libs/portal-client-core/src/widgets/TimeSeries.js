define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/on',
    'dojo/_base/array',
    'dijit/layout/ContentPane',
    'dijit/layout/BorderContainer',
    'dijit/layout/AccordionContainer',
    'dijit/form/SimpleTextarea',
    'dijit/form/Form',
    'dijit/form/TextBox',
    'dijit/form/Button',
    '../_base/store/PortalStore',
    'dstore/Memory',
    'dstore/Trackable',
    'dgrid/OnDemandGrid',
    'dgrid/Selector',
    'dgrid/Selection',
    'dgrid/Editor',
    'dgrid/extensions/DijitRegistry',
    'dojo/request',
    'dojo/promise/all',
    'dojo/text!./templates/TimeSeries.html',
    'highcharts/highstock',
    'dojo/domReady!'
], function (WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare, dom, on, array, ContentPane, BorderContainer, AccordionContainer, SimpleTextarea, Form, TextBox, Button, PortalStore, Memory, Trackable, OnDemandGrid, Selector,
             Selection, Editor, DijitRegistry, request, all, template) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        version:"0.0.1",
        baseClass:"timeSeries",
        _timerange: null, //{from:"",to:"",period:""},
        _timeseries: null, //{name:{$name},graphType:"line|bar|scatter"} //Timeseries array
        maxNumTimeseries: 5, //Max number of timeseries
        _chart: null,
        _chartOptions: null,

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
            var container = dom.byId(this.id);
            this.divBorderContainer.placeAt(container);
            this.divBorderContainer.startup();

            if (this.timerange) {
                this._timerange = this.timerange;
            }
            if (this.timeseries) {
                this._timeseries = this.timeseries;
            }

            this._doLogin();
            this._loadTimeSeries();
        },

        startup: function () {
            this.inherited(arguments);
        },

        _doLogin: function() {
            var url = "/KiWebPortal/rest/auth/login";
            var formdata = {
                userName:"Angel",
                password:"123"
            };

            request.post(url , {
                data: JSON.stringify(formdata),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json;charset=utf-8'
                }
            }).then(function(response) {
                    //Login successful
                    var obj = JSON.parse(response);
                    //console.log('TimeSeries. Logged with id: ' + obj.userName);
                },
                function (error) {
                    //console.debug('TimeSeries. Login incorrect: ' + error.message);
                    throw new Error(error.message);
                });
        },

        _loadTimeSeries: function() {

            var myTimeSeries = PortalStore.myTimeSeries;
            var promises=[];
            var _t=this;
            var query = _t._timerange;

            var afterAllPromises = function(promises) {
                all(promises).then(function(results){
                    //console.log('Results: ' + results);
                    array.forEach(results, function(result){
                        var obj = JSON.parse(result);
                        var records = [];
                        array.forEach(obj.data,function(record){
                            var id=Date.parse(record[0]);
                            records.push({id:id , timestamp:record[0], value:record[1]});
                        });
                        var tsStore = new declare([Memory, Trackable])({
                            data: records,
                            idProperty: 'id',
                            tsId: obj.id,
                            name: obj.name
                        });

                        _t._createTimeSeriesGrids(tsStore);
                        _t._addChartSerie(tsStore);
                        _t._manageTsStoreChanges(tsStore);
                    });

                    //console.log('chartOptions: ' + JSON.stringify(_t._chartOptions));
                    _t._chart = new Highcharts.StockChart(_t._chartOptions);
                    //_t._chart = new Highcharts.Chart(_t._chartOptions);

                });

            }

            //Check if number of timeseries passed excedes maxNumber of timeseries.
            if (this._timeseries.length > this.maxNumTimeseries) {
                this._timeseries = this._timeseries.slice(0,this.maxNumTimeseries);
            }

            var numCalls = this._timeseries.length;
            array.forEach(this._timeseries,function(ts) {
                var tsData = myTimeSeries.filter({name: ts.name});
                tsData.fetch().forEach(function (data) {
                    promises.push(myTimeSeries.getData(data.id, query));
                    if (promises.length==numCalls) {
                        afterAllPromises(promises);
                    }
                });

            });

        },

        _createTimeSeriesGrids: function(tsStore) {
            var _t=this;
            var grid = new (declare([OnDemandGrid, DijitRegistry, Editor, Selection, Selector ]))({
                collection: tsStore,
                selectionMode: 'none',
                showHeader: true,
                columns:
                    [
                        {id: 'timestamp', label:'Timestamp', field: 'timestamp', className:'timestampClass' },
                        {id: 'value', label: 'Value', field: 'value', className:'valueClass', editor: "text", editOn: "dblclick", autoSave: true}
                    ]
            });

            grid.set('sort', [ {property: 'id', descending: false } ]);

            grid.on('dgrid-datachange', function(event) {
                var cell = grid.cell(event);
                var value = event.value;
                var regexp = new RegExp(/^[+-]?\d+(\.\d+)?$/);
                if (!(regexp.test(value))) {
                    // prevent the value from changing
                    //console.log('Value not valid: ' + value);
                    event.preventDefault();
                }
            });
            grid.on('dgrid-error', function(event) {
                //console.log('Grid Error: ' + event);
            });
            grid.startup();

            //Add Grid and TextArea to AccordionContainer.
            var cp = new ContentPane({
                title: tsStore.name,
                content: grid
            });
            cp.startup();

            //Add TextArea
            var textArea = new SimpleTextarea({
                name: "myarea",
                rows: "3",
                style: "width:100%",
                value: "Drop file or paste data here"
            });
            textArea.startup();
            textArea.placeAt(cp.containerNode,'last');
            //Attach method for enter text and files for adding CSV data
            _t._parseNewData(textArea,tsStore);

            //Add content pane to accordion container
            _t.divAccordionContainer.addChild(cp);
        },

        _addChartSerie: function(tsStore) {
            var _t = this;

            if(!this._chartOptions) {
                this._chartOptions = {
                    chart: {
                        renderTo: _t.timeSeriesChart,
                        zoomType: 'x'
                    },
                    title: {
                        text: 'Test Chart for Time Series'
                    },
                    subtitle: {
                        text: document.ontouchstart === undefined ?
                            'Click and drag in the plot area to zoom in' :
                            'Pinch the chart to zoom in'
                    },
                    xAxis: {
                        type: 'datetime',
                        minRange: 3600000 //one hour //1 * 24 * 3600000 // one day
                    },
                    scrollbar: {
                        enabled: true
                    },
                    yAxis: {
                        title: {
                            text: ''
                        }
                    },
                    legend: {
                        enabled: true
                    },
                    tooltip: {
                        shared: false,
                        formatter: function() {
                            return  '<b>' + this.series.name +'</b><br/>' +
                                Highcharts.dateFormat('%e-%b-%Y %H:%M',
                                    new Date(this.x))
                                + ' <b>Value: ' + this.y + '</b>';
                        }

                    },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        },
                        spline: {
                            marker: {
                                enabled: true
                            }
                        }

                    },

                    series: []
                };

            }

            //Search graph type.
            var graphType;
            array.forEach(_t._timeseries,function(tsInfo){
                if (tsInfo.name==tsStore.name) {
                    graphType=tsInfo.graphType;
                }
            });

            //Populate series array in charOptions;
            var valuesArray = [];
            var storeData = tsStore.filter().sort('id');
            storeData.forEach(function(tsData) {
                valuesArray.push([Date.parse(tsData.timestamp),parseFloat(tsData.value)]);
            });

            //Create new serie
            var obj = {
                id: tsStore.tsId,
                type: graphType,
                name: tsStore.name,
                pointInterval: 5 * 60 * 1000, //5minutos //3600 * 1000, //1day //24 * 3600 * 1000,
                pointStart: Date.parse([valuesArray[0][0]]),
                data: valuesArray
            }
            _t._chartOptions.series.push(obj);

        },

        _updateChartSerieFromStore: function(tsStore) {
            //Update serie
            var valuesArray = [];
            var storeData = tsStore.filter().sort('id');
            storeData.forEach(function(tsData) {
                //valuesArray.push(parseFloat(tsData.value));
                valuesArray.push([Date.parse(tsData.timestamp),parseFloat(tsData.value)]);
            });

            array.forEach(this._chart.series, function(serie) {
                if (serie.name == tsStore.name) {
                    serie.setData(valuesArray,true);
                }
            });
        },

        _parseNewData:function(element,tsStore) {
            var _t = this;

            //DRAG & DROP EVENT
            var holder = element.textbox; //Drag & Drop events are defined over the textbox of the textArea
            holder.ondragover = function () {
                this.className = this.className + ' filehover';
                return false;
            };
            holder.ondragend = function () {
                return false;
            };
            var readfiles = function (files) {
                for (var i = 0; i < files.length; i++) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        _t._addDataToStore(tsStore,event.target.result)

                    };
                    reader.readAsText(files[i])

                }
            }

            holder.ondrop = function (e) {
                this.className = '';
                e.preventDefault();
                readfiles(e.dataTransfer.files);
            }

            //PASTE TEXT EVENT
            on(element, "change", function (event) {
                if (element.value && element.value.length!=0 && element.value.indexOf("Drop file or paste data here")==-1) {
                    //console.log(element.value);
                    _t._addDataToStore(tsStore,element.value);
                }
                element.set("value","Drop file or paste data here");
            });
        },

        _addDataToStore: function(store,result) {
            var _t = this;
            if (result.indexOf('[')==-1) {
                //CSV FILE
                var allTextLines = result.split(/\r\n|\n/);
                var lines = [];
                for (var i = 0; i < allTextLines.length; i++) {
                    var tokens = allTextLines[i].split(',');
                    if (tokens[0].length>0 && tokens[0].indexOf('#') == -1 && this._validateTsRecord(tokens)) {
                        //console.log('Adding csv record to Store: ' + tokens[0] + ' ' + tokens[1]);
                        store.add({id: Date.parse(tokens[0]), timestamp: tokens[0], value: parseFloat(tokens[1])});
                    }
                }
            }
            else {
                //JSON FILE.
                //By now the JSON is just a simple array of records.
                var jsonData = JSON.parse(result);
                array.forEach(jsonData,function(record){
                    if (_t._validateTsRecord(record)) {
                        //console.log('Adding JSON record to Store: ' + record[0] + ' ' + record[1]);
                        store.add({id: Date.parse(record[0]), timestamp: record[0], value: parseFloat(record[1])});
                    }
                })
            }
        },

        _manageTsStoreChanges: function(tsStore) {
            var _t = this;
            tsStore.on('delete, add, update', function(event){
                if(event.type=="add" ) {
                    var data = _t._getStoreData(tsStore);
                    PortalStore.myTimeSeries.setData(tsStore.tsId,data);
                    _t._updateChartSerieFromStore(tsStore);
                    /*
                     console.log('Resp Index:' + event.index);
                     console.log('Resp PreviousIndex:'+event.previousIndex);
                     console.log("EventTarget: " + JSON.stringify(event.target));
                     */

                }else if(event.type=="update" ) {
                    //TODO: By now the update is done in the same way as the add; but should be different, just only update a value and not the entire data.
                    var data = _t._getStoreData(tsStore);
                    PortalStore.myTimeSeries.setData(tsStore.tsId,data);
                    _t._updateChartSerieFromStore(tsStore);
                }else if(resp.type=="delete"){
                    //console.log("TSSTORE DELETE");
                }
            })
        },

        _getStoreData: function(tsStore) {
            var data = [];
            var storeData = tsStore.filter().sort('id');
            storeData.forEach(function(tsData) {
                data.push([tsData.timestamp,tsData.value]);
            });
            return data;
        },

        _validateTsRecord: function(record) {
            //Validation function for timeseries record.
            var returnValue=false;
            //Date Validation.
            var timestamp = record[0];
            var valid = (Date.parse(timestamp) > 0);
            if (valid) {
                //Value Validation
                var value=record[1];
                var regexp = new RegExp(/^[+-]?\d+(\.\d+)?$/);
                if ((regexp.test(value))) {
                    returnValue=true;
                }
                else {
                    //console.log('Value ' + value + ' not valid');
                }
            }
            else {
                //console.log('Date ' + timestamp + ' not valid');
            }

            return returnValue;

        },

        trickyResponse: {
            "id": "33A2E4F6-39AF-4EA2-BECC-A65EA0602BEB",
            "name": "DMQaQc.Merged.AsStored.1",
            "measuringPoint": null,
            "parameter": "Q",
            "customKey": null,
            "unit": "m³/s",
            "lat": "-35.34605556",
            "lon": "148.88877778",
            "data": [
                ["2012-03-04T00:00:00.000+10:00",302.050],
                ["2012-03-04T00:15:00.000+10:00",298.285],
                ["2012-03-04T00:20:00.000+10:00",305.102],
                ["2012-03-04T00:25:00.000+10:00",293.570],
                ["2012-03-04T00:40:00.000+10:00",290.096],
                ["2012-03-04T00:55:00.000+10:00",285.207],
                ["2012-03-04T01:00:00.000+10:00",283.755],
                ["2012-03-04T01:05:00.000+10:00",280.125],
                ["2012-03-04T01:15:00.000+10:00",282.787],
                ["2012-03-04T01:20:00.000+10:00",286.175],
                ["2012-03-04T01:25:00.000+10:00",275.073],
                ["2012-03-04T01:30:00.000+10:00",268.467],
                ["2012-03-04T01:35:00.000+10:00",277.705],
                ["2012-03-04T01:50:00.000+10:00",273.657],
                ["2012-03-04T02:00:00.000+10:00",267.051],
                ["2012-03-04T02:05:00.000+10:00",269.882],
                ["2012-03-04T02:10:00.000+10:00",272.713],
                ["2012-03-04T02:15:00.000+10:00",268.467],
                ["2012-03-04T02:30:00.000+10:00",260.093],
                ["2012-03-04T02:35:00.000+10:00",266.107],
                ["2012-03-04T02:40:00.000+10:00",260.093],
                ["2012-03-04T02:45:00.000+10:00",262.622],
                ["2012-03-04T02:50:00.000+10:00",254.116],
                ["2012-03-04T02:55:00.000+10:00",256.875],
                ["2012-03-04T03:00:00.000+10:00",256.415],
                ["2012-03-04T03:05:00.000+10:00",250.291],
                ["2012-03-04T03:10:00.000+10:00",245.588],
                ["2012-03-04T03:20:00.000+10:00",242.901],
                ["2012-03-04T03:25:00.000+10:00",245.588],
                ["2012-03-04T03:40:00.000+10:00",238.965],
                ["2012-03-04T03:45:00.000+10:00",242.453],
                ["2012-03-04T03:50:00.000+10:00",234.168],
                ["2012-03-04T03:55:00.000+10:00",244.245],
                ["2012-03-04T04:00:00.000+10:00",232.206],
                ["2012-03-04T04:05:00.000+10:00",235.259],
                ["2012-03-04T04:10:00.000+10:00",239.183],
                ["2012-03-04T04:20:00.000+10:00",221.587],
                ["2012-03-04T04:25:00.000+10:00",227.315],
                ["2012-03-04T04:40:00.000+10:00",232.642],
                ["2012-03-04T04:45:00.000+10:00",225.194],
                ["2012-03-04T04:50:00.000+10:00",229.437],
                ["2012-03-04T04:55:00.000+10:00",216.217],
                ["2012-03-04T05:00:00.000+10:00",223.284],
                ["2012-03-04T05:05:00.000+10:00",213.741],
                ["2012-03-04T05:10:00.000+10:00",221.799],
                ["2012-03-04T05:15:00.000+10:00",218.280],
                ["2012-03-04T05:20:00.000+10:00",220.962],
                ["2012-03-04T05:30:00.000+10:00",217.042],
                ["2012-03-04T05:40:00.000+10:00",213.122],
                ["2012-03-04T05:50:00.000+10:00",216.836],
                ["2012-03-04T05:55:00.000+10:00",214.360],
                ["2012-03-04T06:00:00.000+10:00",212.709],
                ["2012-03-04T06:10:00.000+10:00",206.651],
                ["2012-03-04T06:20:00.000+10:00",210.061],
                ["2012-03-04T06:30:00.000+10:00",204.244],
                ["2012-03-04T06:35:00.000+10:00",206.651],
                ["2012-03-04T06:40:00.000+10:00",204.445],
                ["2012-03-04T06:45:00.000+10:00",202.038],
                ["2012-03-04T06:50:00.000+10:00",199.488],
                ["2012-03-04T06:55:00.000+10:00",204.846],
                ["2012-03-04T07:00:00.000+10:00",200.657],
                ["2012-03-04T07:05:00.000+10:00",198.124],
                ["2012-03-04T07:20:00.000+10:00",195.201],
                ["2012-03-04T07:55:00.000+10:00",186.590],
                ["2012-03-04T08:00:00.000+10:00",189.428],
                ["2012-03-04T08:10:00.000+10:00",187.536],
                ["2012-03-04T08:15:00.000+10:00",191.699],
                ["2012-03-04T08:20:00.000+10:00",185.644],
                ["2012-03-04T08:35:00.000+10:00",183.184],
                ["2012-03-04T08:50:00.000+10:00",181.147],
                ["2012-03-04T09:00:00.000+10:00",10.000],
                ["2012-03-04T09:10:00.000+10:00",20.000],
                ["2012-03-04T09:20:00.000+10:00",30.000],
                ["2012-03-04T09:25:00.000+10:00",40.000],
                ["2012-03-04T09:30:00.000+10:00",10.000],
                ["2012-03-04T09:35:00.000+10:00",340.000],
                ["2012-03-04T09:50:00.000+10:00",30.000],
                ["2012-03-04T10:00:00.000+10:00",20.000],
                ["2012-03-04T10:05:00.000+10:00",10.000],
                ["2012-03-04T10:20:00.000+10:00",10.000],
                ["2012-03-04T10:35:00.000+10:00",10.000],
                ["2012-03-04T10:40:00.000+10:00",430.000],
                ["2012-03-04T11:00:00.000+10:00",0.000],
                ["2012-03-04T11:15:00.000+10:00",0.000],
                ["2012-03-04T11:25:00.000+10:00",0.000],
                ["2012-03-04T11:30:00.000+10:00",0.000],
                ["2012-03-04T11:40:00.000+10:00",0.000],
                ["2012-03-04T11:50:00.000+10:00",0.000],
                ["2012-03-04T11:55:00.000+10:00",0.000],
                ["2012-03-04T12:00:00.000+10:00",0.000],
                ["2012-03-04T12:05:00.000+10:00",0.000],
                ["2012-03-04T12:10:00.000+10:00",0.000],
                ["2012-03-04T12:15:00.000+10:00",0.000],
                ["2012-03-04T12:20:00.000+10:00",0.000],
                ["2012-03-04T12:35:00.000+10:00",0.000],
                ["2012-03-04T12:50:00.000+10:00",0.000],
                ["2012-03-04T13:00:00.000+10:00",0.000],
                ["2012-03-04T13:15:00.000+10:00",0.000],
                ["2012-03-04T13:20:00.000+10:00",0.000],
                ["2012-03-04T13:25:00.000+10:00",0.000],
                ["2012-03-04T13:35:00.000+10:00",0.000],
                ["2012-03-04T13:40:00.000+10:00",0.000],
                ["2012-03-04T13:45:00.000+10:00",0.000],
                ["2012-03-04T13:55:00.000+10:00",0.000],
                ["2012-03-04T14:00:00.000+10:00",0.000],
                ["2012-03-04T14:10:00.000+10:00",0.000],
                ["2012-03-04T14:20:00.000+10:00",0.000],
                ["2012-03-04T14:25:00.000+10:00",0.000],
                ["2012-03-04T14:30:00.000+10:00",0.000],
                ["2012-03-04T14:35:00.000+10:00",0.000],
                ["2012-03-04T14:45:00.000+10:00",0.000],
                ["2012-03-04T14:50:00.000+10:00",0.000],
                ["2012-03-04T14:55:00.000+10:00",0.000],
                ["2012-03-04T15:00:00.000+10:00",0.000],
                ["2012-03-04T15:05:00.000+10:00",0.000],
                ["2012-03-04T15:10:00.000+10:00",0.000],
                ["2012-03-04T15:15:00.000+10:00",0.000],
                ["2012-03-04T15:20:00.000+10:00",0.000],
                ["2012-03-04T15:25:00.000+10:00",0.000],
                ["2012-03-04T15:30:00.000+10:00",0.000],
                ["2012-03-04T15:50:00.000+10:00",0.000],
                ["2012-03-04T16:00:00.000+10:00",0.000],
                ["2012-03-04T16:10:00.000+10:00",0.000],
                ["2012-03-04T16:15:00.000+10:00",0.000],
                ["2012-03-04T16:20:00.000+10:00",0.000],
                ["2012-03-04T16:25:00.000+10:00",0.000],
                ["2012-03-04T16:40:00.000+10:00",0.000],
                ["2012-03-04T17:00:00.000+10:00",0.000],
                ["2012-03-04T17:05:00.000+10:00",0.000],
                ["2012-03-04T17:10:00.000+10:00",0.000],
                ["2012-03-04T17:15:00.000+10:00",0.000],
                ["2012-03-04T17:20:00.000+10:00",0.000],
                ["2012-03-04T17:25:00.000+10:00",0.000],
                ["2012-03-04T17:30:00.000+10:00",0.000],
                ["2012-03-04T17:35:00.000+10:00",0.000],
                ["2012-03-04T17:40:00.000+10:00",0.000],
                ["2012-03-04T17:45:00.000+10:00",0.000],
                ["2012-03-04T17:50:00.000+10:00",0.000],
                ["2012-03-04T18:00:00.000+10:00",0.000],
                ["2012-03-04T18:10:00.000+10:00",0.000],
                ["2012-03-04T18:15:00.000+10:00",0.000],
                ["2012-03-04T18:25:00.000+10:00",0.000],
                ["2012-03-04T18:30:00.000+10:00",0.000],
                ["2012-03-04T18:35:00.000+10:00",0.000],
                ["2012-03-04T18:45:00.000+10:00",0.000],
                ["2012-03-04T18:50:00.000+10:00",0.000],
                ["2012-03-04T18:55:00.000+10:00",0.000],
                ["2012-03-04T19:00:00.000+10:00",0.000],
                ["2012-03-04T19:05:00.000+10:00",0.000],
                ["2012-03-04T19:10:00.000+10:00",0.000],
                ["2012-03-04T19:15:00.000+10:00",0.000],
                ["2012-03-04T19:20:00.000+10:00",0.000],
                ["2012-03-04T19:25:00.000+10:00",0.000],
                ["2012-03-04T19:30:00.000+10:00",0.000],
                ["2012-03-04T19:40:00.000+10:00",0.000],
                ["2012-03-04T19:45:00.000+10:00",0.000],
                ["2012-03-04T19:50:00.000+10:00",0.000],
                ["2012-03-04T19:55:00.000+10:00",0.000],
                ["2012-03-04T20:00:00.000+10:00",0.000],
                ["2012-03-04T20:20:00.000+10:00",0.000],
                ["2012-03-04T20:25:00.000+10:00",0.000],
                ["2012-03-04T20:30:00.000+10:00",0.000],
                ["2012-03-04T20:45:00.000+10:00",0.000],
                ["2012-03-04T20:50:00.000+10:00",0.000],
                ["2012-03-04T20:55:00.000+10:00",0.000],
                ["2012-03-04T21:00:00.000+10:00",0.000],
                ["2012-03-04T21:10:00.000+10:00",0.000],
                ["2012-03-04T21:15:00.000+10:00",0.000],
                ["2012-03-04T21:20:00.000+10:00",0.000],
                ["2012-03-04T21:30:00.000+10:00",0.000],
                ["2012-03-04T21:45:00.000+10:00",0.000],
                ["2012-03-04T21:55:00.000+10:00",0.000],
                ["2012-03-04T22:00:00.000+10:00",0.000],
                ["2012-03-04T22:20:00.000+10:00",0.000],
                ["2012-03-04T22:30:00.000+10:00",0.000],
                ["2012-03-04T22:35:00.000+10:00",0.000],
                ["2012-03-04T22:40:00.000+10:00",0.000],
                ["2012-03-04T22:50:00.000+10:00",0.000],
                ["2012-03-04T23:00:00.000+10:00",0.000],
                ["2012-03-04T23:10:00.000+10:00",305.611],
                ["2012-03-04T23:20:00.000+10:00",309.171],
                ["2012-03-04T23:25:00.000+10:00",306.119],
                ["2012-03-04T23:35:00.000+10:00",300.270],
                ["2012-03-04T23:40:00.000+10:00",309.680],
                ["2012-03-04T23:45:00.000+10:00",305.102],
                ["2012-03-04T23:50:00.000+10:00",302.305],
                ["2012-03-04T23:55:00.000+10:00",305.102],
                ["2012-03-05T00:00:00.000+10:00",302.050],
                ["2012-03-05T00:15:00.000+10:00",298.285],
                ["2012-03-05T00:20:00.000+10:00",305.102],
                ["2012-03-05T00:25:00.000+10:00",293.570],
                ["2012-03-05T00:40:00.000+10:00",290.096],
                ["2012-03-05T00:55:00.000+10:00",285.207],
                ["2012-03-05T01:00:00.000+10:00",283.755],
                ["2012-03-05T01:05:00.000+10:00",280.125],
                ["2012-03-05T01:15:00.000+10:00",282.787],
                ["2012-03-05T01:20:00.000+10:00",286.175],
                ["2012-03-05T01:25:00.000+10:00",275.073],
                ["2012-03-05T01:30:00.000+10:00",268.467],
                ["2012-03-05T01:35:00.000+10:00",277.705],
                ["2012-03-05T01:50:00.000+10:00",273.657],
                ["2012-03-05T02:00:00.000+10:00",267.051],
                ["2012-03-05T02:05:00.000+10:00",269.882],
                ["2012-03-05T02:10:00.000+10:00",272.713],
                ["2012-03-05T02:15:00.000+10:00",268.467],
                ["2012-03-05T02:30:00.000+10:00",260.093],
                ["2012-03-05T02:35:00.000+10:00",266.107],
                ["2012-03-05T02:40:00.000+10:00",260.093],
                ["2012-03-05T02:45:00.000+10:00",262.622],
                ["2012-03-05T02:50:00.000+10:00",254.116],
                ["2012-03-05T02:55:00.000+10:00",256.875],
                ["2012-03-05T03:00:00.000+10:00",256.415],
                ["2012-03-05T03:05:00.000+10:00",250.291],
                ["2012-03-05T03:10:00.000+10:00",245.588],
                ["2012-03-05T03:20:00.000+10:00",242.901],
                ["2012-03-05T03:25:00.000+10:00",245.588],
                ["2012-03-05T03:40:00.000+10:00",238.965],
                ["2012-03-05T03:45:00.000+10:00",242.453],
                ["2012-03-05T03:50:00.000+10:00",234.168],
                ["2012-03-05T03:55:00.000+10:00",244.245],
                ["2012-03-05T04:00:00.000+10:00",232.206],
                ["2012-03-05T04:05:00.000+10:00",235.259],
                ["2012-03-05T04:10:00.000+10:00",239.183],
                ["2012-03-05T04:20:00.000+10:00",221.587],
                ["2012-03-05T04:25:00.000+10:00",227.315],
                ["2012-03-05T04:40:00.000+10:00",232.642],
                ["2012-03-05T04:45:00.000+10:00",225.194],
                ["2012-03-05T04:50:00.000+10:00",229.437],
                ["2012-03-05T04:55:00.000+10:00",216.217],
                ["2012-03-05T05:00:00.000+10:00",223.284],
                ["2012-03-05T05:05:00.000+10:00",213.741],
                ["2012-03-05T05:10:00.000+10:00",221.799],
                ["2012-03-05T05:15:00.000+10:00",218.280],
                ["2012-03-05T05:20:00.000+10:00",220.962],
                ["2012-03-05T05:30:00.000+10:00",217.042],
                ["2012-03-05T05:40:00.000+10:00",213.122],
                ["2012-03-05T05:50:00.000+10:00",216.836],
                ["2012-03-05T05:55:00.000+10:00",214.360],
                ["2012-03-05T06:00:00.000+10:00",212.709],
                ["2012-03-05T06:10:00.000+10:00",206.651],
                ["2012-03-05T06:20:00.000+10:00",210.061],
                ["2012-03-05T06:30:00.000+10:00",204.244],
                ["2012-03-05T06:35:00.000+10:00",206.651],
                ["2012-03-05T06:40:00.000+10:00",204.445],
                ["2012-03-05T06:45:00.000+10:00",202.038],
                ["2012-03-05T06:50:00.000+10:00",199.488],
                ["2012-03-05T06:55:00.000+10:00",204.846],
                ["2012-03-05T07:00:00.000+10:00",200.657],
                ["2012-03-05T07:05:00.000+10:00",198.124],
                ["2012-03-05T07:20:00.000+10:00",195.201],
                ["2012-03-05T07:55:00.000+10:00",186.590],
                ["2012-03-05T08:00:00.000+10:00",189.428],
                ["2012-03-05T08:10:00.000+10:00",187.536],
                ["2012-03-05T08:15:00.000+10:00",191.699],
                ["2012-03-05T08:20:00.000+10:00",185.644],
                ["2012-03-05T08:35:00.000+10:00",183.184],
                ["2012-03-05T08:50:00.000+10:00",181.147],
                ["2012-03-05T09:00:00.000+10:00",178.944],
                ["2012-03-05T09:15:00.000+10:00",173.440],
                ["2012-03-05T09:25:00.000+10:00",175.638],
                ["2012-03-05T09:40:00.000+10:00",172.906],
                ["2012-03-05T09:50:00.000+10:00",166.139],
                ["2012-03-05T09:55:00.000+10:00",170.235],
                ["2012-03-05T10:00:00.000+10:00",169.522],
                ["2012-03-05T10:05:00.000+10:00",174.353],
                ["2012-03-05T10:25:00.000+10:00",169.166],
                ["2012-03-05T10:35:00.000+10:00",172.372],
                ["2012-03-05T10:50:00.000+10:00",169.522],
                ["2012-03-05T10:55:00.000+10:00",165.426],
                ["2012-03-05T11:00:00.000+10:00",165.961],
                ["2012-03-05T11:10:00.000+10:00",172.016],
                ["2012-03-05T11:15:00.000+10:00",158.506],
                ["2012-03-05T11:20:00.000+10:00",163.166],
                ["2012-03-05T11:25:00.000+10:00",167.563],
                ["2012-03-05T11:30:00.000+10:00",164.892],
                ["2012-03-05T11:35:00.000+10:00",161.958],
                ["2012-03-05T11:40:00.000+10:00",159.541],
                ["2012-03-05T11:45:00.000+10:00",164.892],
                ["2012-03-05T11:50:00.000+10:00",162.993],
                ["2012-03-05T11:55:00.000+10:00",159.541],
                ["2012-03-05T12:00:00.000+10:00",162.303],
                ["2012-03-05T12:05:00.000+10:00",156.952],
                ["2012-03-05T12:20:00.000+10:00",154.261],
                ["2012-03-05T12:35:00.000+10:00",159.196],
                ["2012-03-05T12:40:00.000+10:00",155.933],
                ["2012-03-05T12:45:00.000+10:00",158.851],
                ["2012-03-05T12:50:00.000+10:00",153.927],
                ["2012-03-05T12:55:00.000+10:00",156.607],
                ["2012-03-05T13:00:00.000+10:00",154.595],
                ["2012-03-05T13:05:00.000+10:00",152.088],
                ["2012-03-05T13:15:00.000+10:00",154.595],
                ["2012-03-05T13:25:00.000+10:00",144.683],
                ["2012-03-05T13:30:00.000+10:00",148.081],
                ["2012-03-05T14:00:00.000+10:00",143.388],
                ["2012-03-05T14:05:00.000+10:00",145.977],
                ["2012-03-05T14:10:00.000+10:00",140.006],
                ["2012-03-05T14:15:00.000+10:00",145.330],
                ["2012-03-05T14:30:00.000+10:00",141.608],
                ["2012-03-05T14:45:00.000+10:00",146.624],
                ["2012-03-05T14:50:00.000+10:00",140.961],
                ["2012-03-05T15:00:00.000+10:00",132.773],
                ["2012-03-05T15:05:00.000+10:00",141.285],
                ["2012-03-05T15:10:00.000+10:00",139.544],
                ["2012-03-05T15:20:00.000+10:00",138.005],
                ["2012-03-05T15:35:00.000+10:00",134.158],
                ["2012-03-05T15:40:00.000+10:00",139.236],
                ["2012-03-05T15:45:00.000+10:00",136.005],
                ["2012-03-05T15:55:00.000+10:00",133.850],
                ["2012-03-05T16:00:00.000+10:00",134.466],
                ["2012-03-05T16:10:00.000+10:00",136.313],
                ["2012-03-05T16:15:00.000+10:00",133.543],
                ["2012-03-05T16:20:00.000+10:00",131.234],
                ["2012-03-05T16:40:00.000+10:00",129.696],
                ["2012-03-05T17:00:00.000+10:00",129.080],
                ["2012-03-05T17:15:00.000+10:00",125.848],
                ["2012-03-05T17:20:00.000+10:00",127.541],
                ["2012-03-05T17:25:00.000+10:00",129.696],
                ["2012-03-05T17:30:00.000+10:00",126.618],
                ["2012-03-05T17:35:00.000+10:00",129.849],
                ["2012-03-05T17:40:00.000+10:00",125.087],
                ["2012-03-05T17:45:00.000+10:00",128.157],
                ["2012-03-05T17:50:00.000+10:00",122.750],
                ["2012-03-05T17:55:00.000+10:00",125.087],
                ["2012-03-05T18:00:00.000+10:00",124.503],
                ["2012-03-05T18:05:00.000+10:00",126.156],
                ["2012-03-05T18:15:00.000+10:00",122.165],
                ["2012-03-05T18:30:00.000+10:00",124.941],
                ["2012-03-05T18:35:00.000+10:00",121.435],
                ["2012-03-05T18:55:00.000+10:00",123.918],
                ["2012-03-05T19:00:00.000+10:00",121.143],
                ["2012-03-05T19:05:00.000+10:00",124.210],
                ["2012-03-05T19:10:00.000+10:00",119.682],
                ["2012-03-05T19:20:00.000+10:00",117.512],
                ["2012-03-05T19:30:00.000+10:00",119.098],
                ["2012-03-05T19:45:00.000+10:00",117.230],
                ["2012-03-05T19:50:00.000+10:00",113.565],
                ["2012-03-05T19:55:00.000+10:00",117.934],
                ["2012-03-05T20:00:00.000+10:00",115.538],
                ["2012-03-05T20:05:00.000+10:00",116.948],
                ["2012-03-05T20:10:00.000+10:00",114.552],
                ["2012-03-05T20:20:00.000+10:00",117.230],
                ["2012-03-05T20:25:00.000+10:00",115.538],
                ["2012-03-05T20:30:00.000+10:00",112.297],
                ["2012-03-05T20:35:00.000+10:00",114.975],
                ["2012-03-05T20:40:00.000+10:00",111.169],
                ["2012-03-05T20:45:00.000+10:00",114.975],
                ["2012-03-05T20:50:00.000+10:00",113.424],
                ["2012-03-05T21:00:00.000+10:00",108.044],
                ["2012-03-05T21:05:00.000+10:00",114.975],
                ["2012-03-05T21:15:00.000+10:00",111.169],
                ["2012-03-05T21:20:00.000+10:00",113.001],
                ["2012-03-05T21:25:00.000+10:00",109.539],
                ["2012-03-05T21:30:00.000+10:00",111.169],
                ["2012-03-05T21:35:00.000+10:00",113.847],
                ["2012-03-05T21:40:00.000+10:00",105.870],
                ["2012-03-05T21:45:00.000+10:00",113.283],
                ["2012-03-05T21:50:00.000+10:00",108.995],
                ["2012-03-05T21:55:00.000+10:00",112.156],
                ["2012-03-05T22:00:00.000+10:00",112.156],
                ["2012-03-05T22:05:00.000+10:00",109.946],
                ["2012-03-05T22:10:00.000+10:00",108.451],
                ["2012-03-05T22:15:00.000+10:00",110.897],
                ["2012-03-05T22:20:00.000+10:00",104.783],
                ["2012-03-05T22:25:00.000+10:00",106.685],
                ["2012-03-05T22:55:00.000+10:00",104.249],
                ["2012-03-05T23:00:00.000+10:00",106.142],
                ["2012-03-05T23:10:00.000+10:00",103.726],
                ["2012-03-05T23:50:00.000+10:00",102.155],
                ["2012-03-05T23:55:00.000+10:00",104.511],
                ["2012-03-06T00:00:00.000+10:00",102.155],
                ["2012-03-06T00:05:00.000+10:00",99.669],
                ["2012-03-06T00:10:00.000+10:00",101.893],
                ["2012-03-06T00:15:00.000+10:00",100.192],
                ["2012-03-06T00:30:00.000+10:00",97.846],
                ["2012-03-06T00:40:00.000+10:00",100.192],
                ["2012-03-06T00:45:00.000+10:00",97.846],
                ["2012-03-06T00:50:00.000+10:00",96.209],
                ["2012-03-06T01:00:00.000+10:00",95.831],
                ["2012-03-06T01:05:00.000+10:00",98.622],
                ["2012-03-06T01:15:00.000+10:00",96.965],
                ["2012-03-06T01:45:00.000+10:00",92.557],
                ["2012-03-06T01:50:00.000+10:00",95.453],
                ["2012-03-06T01:55:00.000+10:00",93.942],
                ["2012-03-06T02:00:00.000+10:00",93.942],
                ["2012-03-06T02:05:00.000+10:00",92.305],
                ["2012-03-06T02:25:00.000+10:00",88.174],
                ["2012-03-06T02:35:00.000+10:00",90.596],
                ["2012-03-06T02:50:00.000+10:00",93.438],
                ["2012-03-06T02:55:00.000+10:00",91.080],
                ["2012-03-06T03:00:00.000+10:00",90.111],
                ["2012-03-06T03:50:00.000+10:00",92.935],
                ["2012-03-06T03:55:00.000+10:00",89.506],
                ["2012-03-06T04:00:00.000+10:00",90.353],
                ["2012-03-06T04:05:00.000+10:00",88.174],
                ["2012-03-06T04:15:00.000+10:00",86.964],
                ["2012-03-06T04:25:00.000+10:00",89.506],
                ["2012-03-06T04:30:00.000+10:00",87.932],
                ["2012-03-06T04:40:00.000+10:00",89.143],
                ["2012-03-06T04:50:00.000+10:00",87.811],
                ["2012-03-06T05:00:00.000+10:00",89.022],
                ["2012-03-06T05:20:00.000+10:00",84.717],
                ["2012-03-06T05:25:00.000+10:00",87.448],
                ["2012-03-06T05:35:00.000+10:00",88.901],
                ["2012-03-06T05:40:00.000+10:00",87.690],
                ["2012-03-06T05:45:00.000+10:00",85.298],
                ["2012-03-06T06:00:00.000+10:00",85.414],
                ["2012-03-06T06:05:00.000+10:00",82.740],
                ["2012-03-06T06:10:00.000+10:00",84.484],
                ["2012-03-06T06:25:00.000+10:00",82.740],
                ["2012-03-06T06:30:00.000+10:00",85.298],
                ["2012-03-06T06:35:00.000+10:00",82.740],
                ["2012-03-06T06:40:00.000+10:00",84.252],
                ["2012-03-06T06:50:00.000+10:00",82.508],
                ["2012-03-06T07:00:00.000+10:00",83.787],
                ["2012-03-06T07:20:00.000+10:00",81.229],
                ["2012-03-06T07:25:00.000+10:00",82.624],
                ["2012-03-06T07:30:00.000+10:00",84.019],
                ["2012-03-06T07:40:00.000+10:00",79.965],
                ["2012-03-06T07:45:00.000+10:00",81.578],
                ["2012-03-06T08:00:00.000+10:00",81.345],
                ["2012-03-06T08:25:00.000+10:00",77.735],
                ["2012-03-06T08:30:00.000+10:00",80.880],
                ["2012-03-06T08:35:00.000+10:00",79.519],
                ["2012-03-06T08:40:00.000+10:00",75.282],
                ["2012-03-06T08:45:00.000+10:00",81.113],
                ["2012-03-06T08:55:00.000+10:00",78.069],
                ["2012-03-06T09:00:00.000+10:00",79.184]
            ]
        },

        trickyResponse2: {
            "id": "33A2E4F6-39AF-4EA2-BECC-A65EA0602BEC",
            "name": "DMQaQc.Merged.AsStored.1",
            "measuringPoint": null,
            "parameter": "Q",
            "customKey": null,
            "unit": "m³/s",
            "lat": "-35.34605556",
            "lon": "148.88877778",
            "data": [
                ["2012-03-04T00:00:00.000+10:00",102.050],
                ["2012-03-04T00:15:00.000+10:00",498.285],
                ["2012-03-04T00:20:00.000+10:00",345.102],
                ["2012-03-04T00:25:00.000+10:00",263.570],
                ["2012-03-04T00:40:00.000+10:00",230.096],
                ["2012-03-04T00:55:00.000+10:00",245.207],
                ["2012-03-04T01:00:00.000+10:00",263.755],
                ["2012-03-04T01:05:00.000+10:00",270.125],
                ["2012-03-04T01:15:00.000+10:00",282.787],
                ["2012-03-04T01:20:00.000+10:00",283.175],
                ["2012-03-04T01:25:00.000+10:00",235.073],
                ["2012-03-04T01:30:00.000+10:00",248.467],
                ["2012-03-04T01:35:00.000+10:00",256.705],
                ["2012-03-04T01:50:00.000+10:00",273.657],
                ["2012-03-04T02:00:00.000+10:00",247.051],
                ["2012-03-04T02:05:00.000+10:00",229.882],
                ["2012-03-04T02:10:00.000+10:00",212.713],
                ["2012-03-04T02:15:00.000+10:00",278.467],
                ["2012-03-04T02:30:00.000+10:00",261.093],
                ["2012-03-04T02:35:00.000+10:00",266.107],
                ["2012-03-04T02:40:00.000+10:00",265.093],
                ["2012-03-04T02:45:00.000+10:00",264.622],
                ["2012-03-04T02:50:00.000+10:00",254.116],
                ["2012-03-04T02:55:00.000+10:00",256.875],
                ["2012-03-04T03:00:00.000+10:00",256.415],
                ["2012-03-04T03:05:00.000+10:00",250.291],
                ["2012-03-04T03:10:00.000+10:00",245.588],
                ["2012-03-04T03:20:00.000+10:00",242.901],
                ["2012-03-04T03:25:00.000+10:00",245.588],
                ["2012-03-04T03:40:00.000+10:00",238.965],
                ["2012-03-04T03:45:00.000+10:00",242.453],
                ["2012-03-04T03:50:00.000+10:00",234.168],
                ["2012-03-04T03:55:00.000+10:00",244.245],
                ["2012-03-04T04:00:00.000+10:00",232.206],
                ["2012-03-04T04:05:00.000+10:00",235.259],
                ["2012-03-04T04:10:00.000+10:00",239.183],
                ["2012-03-04T04:20:00.000+10:00",221.587],
                ["2012-03-04T04:25:00.000+10:00",227.315],
                ["2012-03-04T04:40:00.000+10:00",232.642],
                ["2012-03-04T04:45:00.000+10:00",225.194],
                ["2012-03-04T04:50:00.000+10:00",229.437],
                ["2012-03-04T04:55:00.000+10:00",216.217],
                ["2012-03-04T05:00:00.000+10:00",223.284],
                ["2012-03-04T05:05:00.000+10:00",213.741],
                ["2012-03-04T05:10:00.000+10:00",221.799],
                ["2012-03-04T05:15:00.000+10:00",218.280],
                ["2012-03-04T05:20:00.000+10:00",220.962],
                ["2012-03-04T05:30:00.000+10:00",217.042],
                ["2012-03-04T05:40:00.000+10:00",213.122],
                ["2012-03-04T05:50:00.000+10:00",216.836],
                ["2012-03-04T05:55:00.000+10:00",214.360],
                ["2012-03-04T06:00:00.000+10:00",212.709],
                ["2012-03-04T06:10:00.000+10:00",206.651],
                ["2012-03-04T06:20:00.000+10:00",210.061],
                ["2012-03-04T06:30:00.000+10:00",204.244],
                ["2012-03-04T06:35:00.000+10:00",206.651],
                ["2012-03-04T06:40:00.000+10:00",204.445],
                ["2012-03-04T06:45:00.000+10:00",202.038],
                ["2012-03-04T06:50:00.000+10:00",199.488],
                ["2012-03-04T06:55:00.000+10:00",204.846],
                ["2012-03-04T07:00:00.000+10:00",200.657],
                ["2012-03-04T07:05:00.000+10:00",198.124],
                ["2012-03-04T07:20:00.000+10:00",195.201],
                ["2012-03-04T07:55:00.000+10:00",186.590],
                ["2012-03-04T08:00:00.000+10:00",189.428],
                ["2012-03-04T08:10:00.000+10:00",187.536],
                ["2012-03-04T08:15:00.000+10:00",191.699],
                ["2012-03-04T08:20:00.000+10:00",185.644],
                ["2012-03-04T08:35:00.000+10:00",183.184],
                ["2012-03-04T08:50:00.000+10:00",181.147],
                ["2012-03-04T09:00:00.000+10:00",10.000],
                ["2012-03-04T09:10:00.000+10:00",20.000],
                ["2012-03-04T09:20:00.000+10:00",30.000],
                ["2012-03-04T09:25:00.000+10:00",40.000],
                ["2012-03-04T09:30:00.000+10:00",10.000],
                ["2012-03-04T09:35:00.000+10:00",340.000],
                ["2012-03-04T09:50:00.000+10:00",30.000],
                ["2012-03-04T10:00:00.000+10:00",20.000],
                ["2012-03-04T10:05:00.000+10:00",10.000],
                ["2012-03-04T10:20:00.000+10:00",10.000],
                ["2012-03-04T10:35:00.000+10:00",10.000],
                ["2012-03-04T10:40:00.000+10:00",430.000],
                ["2012-03-04T11:00:00.000+10:00",10.000],
                ["2012-03-04T11:15:00.000+10:00",20.000],
                ["2012-03-04T11:25:00.000+10:00",30.000],
                ["2012-03-04T11:30:00.000+10:00",40.000],
                ["2012-03-04T11:40:00.000+10:00",50.000],
                ["2012-03-04T11:50:00.000+10:00",60.000],
                ["2012-03-04T11:55:00.000+10:00",50.000],
                ["2012-03-04T12:00:00.000+10:00",30.000],
                ["2012-03-04T12:05:00.000+10:00",20.000],
                ["2012-03-04T12:10:00.000+10:00",20.000],
                ["2012-03-04T12:15:00.000+10:00",30.000],
                ["2012-03-04T12:20:00.000+10:00",40.000],
                ["2012-03-04T12:35:00.000+10:00",50.000],
                ["2012-03-04T12:50:00.000+10:00",60.000],
                ["2012-03-04T13:00:00.000+10:00",70.000],
                ["2012-03-04T13:15:00.000+10:00",80.000],
                ["2012-03-04T13:20:00.000+10:00",30.000],
                ["2012-03-04T13:25:00.000+10:00",20.000],
                ["2012-03-04T13:35:00.000+10:00",20.000],
                ["2012-03-04T13:40:00.000+10:00",30.000],
                ["2012-03-04T13:45:00.000+10:00",40.000],
                ["2012-03-04T13:55:00.000+10:00",50.000],
                ["2012-03-04T14:00:00.000+10:00",60.000],
                ["2012-03-04T14:10:00.000+10:00",70.000],
                ["2012-03-04T14:20:00.000+10:00",70.000],
                ["2012-03-04T14:25:00.000+10:00",4.000],
                ["2012-03-04T14:30:00.000+10:00",30.000],
                ["2012-03-04T14:35:00.000+10:00",20.000],
                ["2012-03-04T14:45:00.000+10:00",30.000],
                ["2012-03-04T14:50:00.000+10:00",230.000],
                ["2012-03-04T14:55:00.000+10:00",120.000],
                ["2012-03-04T15:00:00.000+10:00",130.000],
                ["2012-03-04T15:05:00.000+10:00",10.000],
                ["2012-03-04T15:10:00.000+10:00",20.000],
                ["2012-03-04T15:15:00.000+10:00",6.000],
                ["2012-03-04T15:20:00.000+10:00",7.000],
                ["2012-03-04T15:25:00.000+10:00",8.000],
                ["2012-03-04T15:30:00.000+10:00",10.000],
                ["2012-03-04T15:50:00.000+10:00",20.000],
                ["2012-03-04T16:00:00.000+10:00",30.000],
                ["2012-03-04T16:10:00.000+10:00",40.000],
                ["2012-03-04T16:15:00.000+10:00",150.000],
                ["2012-03-04T16:20:00.000+10:00",70.000],
                ["2012-03-04T16:25:00.000+10:00",0.000],
                ["2012-03-04T16:40:00.000+10:00",0.000],
                ["2012-03-04T17:00:00.000+10:00",0.000],
                ["2012-03-04T17:05:00.000+10:00",0.000],
                ["2012-03-04T17:10:00.000+10:00",0.000],
                ["2012-03-04T17:15:00.000+10:00",0.000],
                ["2012-03-04T17:20:00.000+10:00",0.000],
                ["2012-03-04T17:25:00.000+10:00",0.000],
                ["2012-03-04T17:30:00.000+10:00",0.000],
                ["2012-03-04T17:35:00.000+10:00",0.000],
                ["2012-03-04T17:40:00.000+10:00",0.000],
                ["2012-03-04T17:45:00.000+10:00",0.000],
                ["2012-03-04T17:50:00.000+10:00",0.000],
                ["2012-03-04T18:00:00.000+10:00",0.000],
                ["2012-03-04T18:10:00.000+10:00",0.000],
                ["2012-03-04T18:15:00.000+10:00",0.000],
                ["2012-03-04T18:25:00.000+10:00",0.000],
                ["2012-03-04T18:30:00.000+10:00",0.000],
                ["2012-03-04T18:35:00.000+10:00",0.000],
                ["2012-03-04T18:45:00.000+10:00",0.000],
                ["2012-03-04T18:50:00.000+10:00",0.000],
                ["2012-03-04T18:55:00.000+10:00",0.000],
                ["2012-03-04T19:00:00.000+10:00",0.000],
                ["2012-03-04T19:05:00.000+10:00",0.000],
                ["2012-03-04T19:10:00.000+10:00",0.000],
                ["2012-03-04T19:15:00.000+10:00",0.000],
                ["2012-03-04T19:20:00.000+10:00",0.000],
                ["2012-03-04T19:25:00.000+10:00",0.000],
                ["2012-03-04T19:30:00.000+10:00",0.000],
                ["2012-03-04T19:40:00.000+10:00",0.000],
                ["2012-03-04T19:45:00.000+10:00",0.000],
                ["2012-03-04T19:50:00.000+10:00",0.000],
                ["2012-03-04T19:55:00.000+10:00",0.000],
                ["2012-03-04T20:00:00.000+10:00",0.000],
                ["2012-03-04T20:20:00.000+10:00",0.000],
                ["2012-03-04T20:25:00.000+10:00",0.000],
                ["2012-03-04T20:30:00.000+10:00",0.000],
                ["2012-03-04T20:45:00.000+10:00",0.000],
                ["2012-03-04T20:50:00.000+10:00",0.000],
                ["2012-03-04T20:55:00.000+10:00",0.000],
                ["2012-03-04T21:00:00.000+10:00",0.000],
                ["2012-03-04T21:10:00.000+10:00",0.000],
                ["2012-03-04T21:15:00.000+10:00",0.000],
                ["2012-03-04T21:20:00.000+10:00",0.000],
                ["2012-03-04T21:30:00.000+10:00",0.000],
                ["2012-03-04T21:45:00.000+10:00",0.000],
                ["2012-03-04T21:55:00.000+10:00",0.000],
                ["2012-03-04T22:00:00.000+10:00",0.000],
                ["2012-03-04T22:20:00.000+10:00",0.000],
                ["2012-03-04T22:30:00.000+10:00",0.000],
                ["2012-03-04T22:35:00.000+10:00",0.000],
                ["2012-03-04T22:40:00.000+10:00",0.000],
                ["2012-03-04T22:50:00.000+10:00",0.000],
                ["2012-03-04T23:00:00.000+10:00",0.000],
                ["2012-03-04T23:10:00.000+10:00",305.611],
                ["2012-03-04T23:20:00.000+10:00",309.171],
                ["2012-03-04T23:25:00.000+10:00",306.119],
                ["2012-03-04T23:35:00.000+10:00",300.270],
                ["2012-03-04T23:40:00.000+10:00",309.680],
                ["2012-03-04T23:45:00.000+10:00",305.102],
                ["2012-03-04T23:50:00.000+10:00",302.305],
                ["2012-03-04T23:55:00.000+10:00",305.102],
                ["2012-03-05T00:00:00.000+10:00",302.050],
                ["2012-03-05T00:15:00.000+10:00",298.285],
                ["2012-03-05T00:20:00.000+10:00",305.102],
                ["2012-03-05T00:25:00.000+10:00",293.570],
                ["2012-03-05T00:40:00.000+10:00",290.096],
                ["2012-03-05T00:55:00.000+10:00",285.207],
                ["2012-03-05T01:00:00.000+10:00",283.755],
                ["2012-03-05T01:05:00.000+10:00",280.125],
                ["2012-03-05T01:15:00.000+10:00",282.787],
                ["2012-03-05T01:20:00.000+10:00",286.175],
                ["2012-03-05T01:25:00.000+10:00",275.073],
                ["2012-03-05T01:30:00.000+10:00",268.467],
                ["2012-03-05T01:35:00.000+10:00",277.705],
                ["2012-03-05T01:50:00.000+10:00",273.657],
                ["2012-03-05T02:00:00.000+10:00",267.051],
                ["2012-03-05T02:05:00.000+10:00",269.882],
                ["2012-03-05T02:10:00.000+10:00",272.713],
                ["2012-03-05T02:15:00.000+10:00",268.467],
                ["2012-03-05T02:30:00.000+10:00",260.093],
                ["2012-03-05T02:35:00.000+10:00",266.107],
                ["2012-03-05T02:40:00.000+10:00",260.093],
                ["2012-03-05T02:45:00.000+10:00",262.622],
                ["2012-03-05T02:50:00.000+10:00",254.116],
                ["2012-03-05T02:55:00.000+10:00",256.875],
                ["2012-03-05T03:00:00.000+10:00",256.415],
                ["2012-03-05T03:05:00.000+10:00",250.291],
                ["2012-03-05T03:10:00.000+10:00",245.588],
                ["2012-03-05T03:20:00.000+10:00",242.901],
                ["2012-03-05T03:25:00.000+10:00",245.588],
                ["2012-03-05T03:40:00.000+10:00",238.965],
                ["2012-03-05T03:45:00.000+10:00",242.453],
                ["2012-03-05T03:50:00.000+10:00",234.168],
                ["2012-03-05T03:55:00.000+10:00",244.245],
                ["2012-03-05T04:00:00.000+10:00",232.206],
                ["2012-03-05T04:05:00.000+10:00",235.259],
                ["2012-03-05T04:10:00.000+10:00",239.183],
                ["2012-03-05T04:20:00.000+10:00",221.587],
                ["2012-03-05T04:25:00.000+10:00",227.315],
                ["2012-03-05T04:40:00.000+10:00",232.642],
                ["2012-03-05T04:45:00.000+10:00",225.194],
                ["2012-03-05T04:50:00.000+10:00",229.437],
                ["2012-03-05T04:55:00.000+10:00",216.217],
                ["2012-03-05T05:00:00.000+10:00",223.284],
                ["2012-03-05T05:05:00.000+10:00",213.741],
                ["2012-03-05T05:10:00.000+10:00",221.799],
                ["2012-03-05T05:15:00.000+10:00",218.280],
                ["2012-03-05T05:20:00.000+10:00",220.962],
                ["2012-03-05T05:30:00.000+10:00",217.042],
                ["2012-03-05T05:40:00.000+10:00",213.122],
                ["2012-03-05T05:50:00.000+10:00",216.836],
                ["2012-03-05T05:55:00.000+10:00",214.360],
                ["2012-03-05T06:00:00.000+10:00",212.709],
                ["2012-03-05T06:10:00.000+10:00",206.651],
                ["2012-03-05T06:20:00.000+10:00",210.061],
                ["2012-03-05T06:30:00.000+10:00",204.244],
                ["2012-03-05T06:35:00.000+10:00",206.651],
                ["2012-03-05T06:40:00.000+10:00",204.445],
                ["2012-03-05T06:45:00.000+10:00",202.038],
                ["2012-03-05T06:50:00.000+10:00",199.488],
                ["2012-03-05T06:55:00.000+10:00",204.846],
                ["2012-03-05T07:00:00.000+10:00",200.657],
                ["2012-03-05T07:05:00.000+10:00",198.124],
                ["2012-03-05T07:20:00.000+10:00",195.201],
                ["2012-03-05T07:55:00.000+10:00",186.590],
                ["2012-03-05T08:00:00.000+10:00",189.428],
                ["2012-03-05T08:10:00.000+10:00",187.536],
                ["2012-03-05T08:15:00.000+10:00",191.699],
                ["2012-03-05T08:20:00.000+10:00",185.644],
                ["2012-03-05T08:35:00.000+10:00",183.184],
                ["2012-03-05T08:50:00.000+10:00",181.147],
                ["2012-03-05T09:00:00.000+10:00",178.944],
                ["2012-03-05T09:15:00.000+10:00",173.440],
                ["2012-03-05T09:25:00.000+10:00",175.638],
                ["2012-03-05T09:40:00.000+10:00",172.906],
                ["2012-03-05T09:50:00.000+10:00",166.139],
                ["2012-03-05T09:55:00.000+10:00",170.235],
                ["2012-03-05T10:00:00.000+10:00",169.522],
                ["2012-03-05T10:05:00.000+10:00",174.353],
                ["2012-03-05T10:25:00.000+10:00",169.166],
                ["2012-03-05T10:35:00.000+10:00",172.372],
                ["2012-03-05T10:50:00.000+10:00",169.522],
                ["2012-03-05T10:55:00.000+10:00",165.426],
                ["2012-03-05T11:00:00.000+10:00",165.961],
                ["2012-03-05T11:10:00.000+10:00",172.016],
                ["2012-03-05T11:15:00.000+10:00",158.506],
                ["2012-03-05T11:20:00.000+10:00",163.166],
                ["2012-03-05T11:25:00.000+10:00",167.563],
                ["2012-03-05T11:30:00.000+10:00",164.892],
                ["2012-03-05T11:35:00.000+10:00",161.958],
                ["2012-03-05T11:40:00.000+10:00",159.541],
                ["2012-03-05T11:45:00.000+10:00",164.892],
                ["2012-03-05T11:50:00.000+10:00",162.993],
                ["2012-03-05T11:55:00.000+10:00",159.541],
                ["2012-03-05T12:00:00.000+10:00",162.303],
                ["2012-03-05T12:05:00.000+10:00",156.952],
                ["2012-03-05T12:20:00.000+10:00",154.261],
                ["2012-03-05T12:35:00.000+10:00",159.196],
                ["2012-03-05T12:40:00.000+10:00",155.933],
                ["2012-03-05T12:45:00.000+10:00",158.851],
                ["2012-03-05T12:50:00.000+10:00",153.927],
                ["2012-03-05T12:55:00.000+10:00",156.607],
                ["2012-03-05T13:00:00.000+10:00",154.595],
                ["2012-03-05T13:05:00.000+10:00",152.088],
                ["2012-03-05T13:15:00.000+10:00",154.595],
                ["2012-03-05T13:25:00.000+10:00",144.683],
                ["2012-03-05T13:30:00.000+10:00",148.081],
                ["2012-03-05T14:00:00.000+10:00",143.388],
                ["2012-03-05T14:05:00.000+10:00",145.977],
                ["2012-03-05T14:10:00.000+10:00",140.006],
                ["2012-03-05T14:15:00.000+10:00",145.330],
                ["2012-03-05T14:30:00.000+10:00",141.608],
                ["2012-03-05T14:45:00.000+10:00",146.624],
                ["2012-03-05T14:50:00.000+10:00",140.961],
                ["2012-03-05T15:00:00.000+10:00",132.773],
                ["2012-03-05T15:05:00.000+10:00",141.285],
                ["2012-03-05T15:10:00.000+10:00",139.544],
                ["2012-03-05T15:20:00.000+10:00",138.005],
                ["2012-03-05T15:35:00.000+10:00",134.158],
                ["2012-03-05T15:40:00.000+10:00",139.236],
                ["2012-03-05T15:45:00.000+10:00",136.005],
                ["2012-03-05T15:55:00.000+10:00",133.850],
                ["2012-03-05T16:00:00.000+10:00",134.466],
                ["2012-03-05T16:10:00.000+10:00",136.313],
                ["2012-03-05T16:15:00.000+10:00",133.543],
                ["2012-03-05T16:20:00.000+10:00",131.234],
                ["2012-03-05T16:40:00.000+10:00",129.696],
                ["2012-03-05T17:00:00.000+10:00",129.080],
                ["2012-03-05T17:15:00.000+10:00",125.848],
                ["2012-03-05T17:20:00.000+10:00",127.541],
                ["2012-03-05T17:25:00.000+10:00",129.696],
                ["2012-03-05T17:30:00.000+10:00",126.618],
                ["2012-03-05T17:35:00.000+10:00",129.849],
                ["2012-03-05T17:40:00.000+10:00",125.087],
                ["2012-03-05T17:45:00.000+10:00",128.157],
                ["2012-03-05T17:50:00.000+10:00",122.750],
                ["2012-03-05T17:55:00.000+10:00",125.087],
                ["2012-03-05T18:00:00.000+10:00",124.503],
                ["2012-03-05T18:05:00.000+10:00",126.156],
                ["2012-03-05T18:15:00.000+10:00",122.165],
                ["2012-03-05T18:30:00.000+10:00",124.941],
                ["2012-03-05T18:35:00.000+10:00",121.435],
                ["2012-03-05T18:55:00.000+10:00",123.918],
                ["2012-03-05T19:00:00.000+10:00",121.143],
                ["2012-03-05T19:05:00.000+10:00",124.210],
                ["2012-03-05T19:10:00.000+10:00",119.682],
                ["2012-03-05T19:20:00.000+10:00",117.512],
                ["2012-03-05T19:30:00.000+10:00",119.098],
                ["2012-03-05T19:45:00.000+10:00",117.230],
                ["2012-03-05T19:50:00.000+10:00",113.565],
                ["2012-03-05T19:55:00.000+10:00",117.934],
                ["2012-03-05T20:00:00.000+10:00",115.538],
                ["2012-03-05T20:05:00.000+10:00",116.948],
                ["2012-03-05T20:10:00.000+10:00",114.552],
                ["2012-03-05T20:20:00.000+10:00",117.230],
                ["2012-03-05T20:25:00.000+10:00",115.538],
                ["2012-03-05T20:30:00.000+10:00",112.297],
                ["2012-03-05T20:35:00.000+10:00",114.975],
                ["2012-03-05T20:40:00.000+10:00",111.169],
                ["2012-03-05T20:45:00.000+10:00",114.975],
                ["2012-03-05T20:50:00.000+10:00",113.424],
                ["2012-03-05T21:00:00.000+10:00",108.044],
                ["2012-03-05T21:05:00.000+10:00",114.975],
                ["2012-03-05T21:15:00.000+10:00",111.169],
                ["2012-03-05T21:20:00.000+10:00",113.001],
                ["2012-03-05T21:25:00.000+10:00",109.539],
                ["2012-03-05T21:30:00.000+10:00",111.169],
                ["2012-03-05T21:35:00.000+10:00",113.847],
                ["2012-03-05T21:40:00.000+10:00",105.870],
                ["2012-03-05T21:45:00.000+10:00",113.283],
                ["2012-03-05T21:50:00.000+10:00",108.995],
                ["2012-03-05T21:55:00.000+10:00",112.156],
                ["2012-03-05T22:00:00.000+10:00",112.156],
                ["2012-03-05T22:05:00.000+10:00",109.946],
                ["2012-03-05T22:10:00.000+10:00",108.451],
                ["2012-03-05T22:15:00.000+10:00",110.897],
                ["2012-03-05T22:20:00.000+10:00",104.783],
                ["2012-03-05T22:25:00.000+10:00",106.685],
                ["2012-03-05T22:55:00.000+10:00",104.249],
                ["2012-03-05T23:00:00.000+10:00",106.142],
                ["2012-03-05T23:10:00.000+10:00",103.726],
                ["2012-03-05T23:50:00.000+10:00",102.155],
                ["2012-03-05T23:55:00.000+10:00",104.511],
                ["2012-03-06T00:00:00.000+10:00",102.155],
                ["2012-03-06T00:05:00.000+10:00",99.669],
                ["2012-03-06T00:10:00.000+10:00",101.893],
                ["2012-03-06T00:15:00.000+10:00",100.192],
                ["2012-03-06T00:30:00.000+10:00",97.846],
                ["2012-03-06T00:40:00.000+10:00",100.192],
                ["2012-03-06T00:45:00.000+10:00",97.846],
                ["2012-03-06T00:50:00.000+10:00",96.209],
                ["2012-03-06T01:00:00.000+10:00",95.831],
                ["2012-03-06T01:05:00.000+10:00",98.622],
                ["2012-03-06T01:15:00.000+10:00",96.965],
                ["2012-03-06T01:45:00.000+10:00",92.557],
                ["2012-03-06T01:50:00.000+10:00",95.453],
                ["2012-03-06T01:55:00.000+10:00",93.942],
                ["2012-03-06T02:00:00.000+10:00",93.942],
                ["2012-03-06T02:05:00.000+10:00",92.305],
                ["2012-03-06T02:25:00.000+10:00",88.174],
                ["2012-03-06T02:35:00.000+10:00",90.596],
                ["2012-03-06T02:50:00.000+10:00",93.438],
                ["2012-03-06T02:55:00.000+10:00",91.080],
                ["2012-03-06T03:00:00.000+10:00",90.111],
                ["2012-03-06T03:50:00.000+10:00",92.935],
                ["2012-03-06T03:55:00.000+10:00",89.506],
                ["2012-03-06T04:00:00.000+10:00",90.353],
                ["2012-03-06T04:05:00.000+10:00",88.174],
                ["2012-03-06T04:15:00.000+10:00",86.964],
                ["2012-03-06T04:25:00.000+10:00",89.506],
                ["2012-03-06T04:30:00.000+10:00",87.932],
                ["2012-03-06T04:40:00.000+10:00",89.143],
                ["2012-03-06T04:50:00.000+10:00",87.811],
                ["2012-03-06T05:00:00.000+10:00",89.022],
                ["2012-03-06T05:20:00.000+10:00",84.717],
                ["2012-03-06T05:25:00.000+10:00",87.448],
                ["2012-03-06T05:35:00.000+10:00",88.901],
                ["2012-03-06T05:40:00.000+10:00",87.690],
                ["2012-03-06T05:45:00.000+10:00",85.298],
                ["2012-03-06T06:00:00.000+10:00",85.414],
                ["2012-03-06T06:05:00.000+10:00",82.740],
                ["2012-03-06T06:10:00.000+10:00",84.484],
                ["2012-03-06T06:25:00.000+10:00",82.740],
                ["2012-03-06T06:30:00.000+10:00",85.298],
                ["2012-03-06T06:35:00.000+10:00",82.740],
                ["2012-03-06T06:40:00.000+10:00",84.252],
                ["2012-03-06T06:50:00.000+10:00",82.508],
                ["2012-03-06T07:00:00.000+10:00",83.787],
                ["2012-03-06T07:20:00.000+10:00",81.229],
                ["2012-03-06T07:25:00.000+10:00",82.624],
                ["2012-03-06T07:30:00.000+10:00",84.019],
                ["2012-03-06T07:40:00.000+10:00",79.965],
                ["2012-03-06T07:45:00.000+10:00",81.578],
                ["2012-03-06T08:00:00.000+10:00",81.345],
                ["2012-03-06T08:25:00.000+10:00",77.735],
                ["2012-03-06T08:30:00.000+10:00",80.880],
                ["2012-03-06T08:35:00.000+10:00",79.519],
                ["2012-03-06T08:40:00.000+10:00",75.282],
                ["2012-03-06T08:45:00.000+10:00",81.113],
                ["2012-03-06T08:55:00.000+10:00",78.069],
                ["2012-03-06T09:00:00.000+10:00",79.184]
            ]
        }

        ,
        resize: function () {
            this.inherited(arguments);

        }
    });
});