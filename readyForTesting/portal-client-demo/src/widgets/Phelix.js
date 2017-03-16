define([
    'dojo/dom-geometry',
    'dojo/promise/all',
    'dojo/request/script',
    'dijit/ProgressBar',
    'dijit/form/Button',
    'dijit/form/NumberTextBox',
    'dijit/_Container',
    'dojo/text!./templates/Phelix.template.html',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'highcharts/highstock',
    'highcharts/highstockExport'
], function (domGeometry, all, script, ProgressBar, Button, NumberTextBox, Container, template, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare,highstock) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        version:"0.0.1",
        label:"Phelix Day Peak",
        templateString:template,
        declaredClass:"exampleWidget",
        type:false,
        baseClass:"phelix",
        postCreate:function(){
            this.inherited(arguments);

            var _t = this;

            var urlPrice = (this.type=="daybase") ?"http://www.eex.com/data//view/series/detail/statistic/C-Power-S-DEAT-Block_01_24/indexPrice.json" : "http://www.eex.com/data//view/series/detail/statistic/C-Power-S-DEAT-Block_09_20/indexPrice.json";
            var urlVolume = (this.type=="daybase") ? "http://www.eex.com/data//view/series/detail/statistic/C-Power-S-DEAT-Block_01_24/volumeExchange.json" : "http://www.eex.com/data//view/series/detail/statistic/C-Power-S-DEAT-Block_09_20/volumeExchange.json";
/*            Phelix Day Base
            http://www.eex.com/data//view/series/detail/statistic/C-Power-S-DEAT-Block_01_24/indexPrice.json
                http://www.eex.com/data//view/series/detail/statistic/C-Power-S-DEAT-Block_01_24/volumeExchange.json

                    Phelix Day Peak
            http://www.eex.com/data//view/series/detail/statistic/C-Power-S-DEAT-Block_09_20/indexPrice.json
                http://www.eex.com/data//view/series/detail/statistic/C-Power-S-DEAT-Block_09_20/volumeExchange.json*/

            var price = script.get("http://gisweb.kisters.de/tools/proxy.php", {
                jsonp: "callback",
                query:{
                    url:urlPrice

                }
            })

            var volume = script.get("http://gisweb.kisters.de/tools/proxy.php", {
                jsonp: "callback",
                query:{
                    url:urlVolume

                }
            })

            all({price:price,volume:volume}).then(function(data){


                var opts =   {
                    chart : {
                        renderTo:_t.graph,
                        reflow:false
                     //   height: 600
                    },
                    exporting: {
                        enabled: true
                    },
                    yAxis: [{
                        title: {
                            text: 'Preis'
                        }
                     //   height: 300
                        },{

                            title: {
                                text: 'Volumen'
                            },
                        opposite:true
                    //    top: 320,
                    //    offset: 0,
                    //    height: 100
                        }],
                    rangeSelector : {
                        buttons : [ {
                            type : 'day',
                            count : 5,
                            text : '3d'
                        },{
                            type : 'week',
                            count : 1,
                            text : '1w'
                        },{
                            type : 'month',
                            count : 1,
                            text : '1m'
                        },{
                            type : 'year',
                            count : 1,
                            text : '1y'
                        }, {
                            type : 'all',
                            count : 1,
                            text : 'All'
                        }],
                            selected : 3,
                            inputEnabled : true
                    },
                    legend: {
                        enabled:true
                    },
                    plotOptions: {
                        line: {
                            dataGrouping: {

                            //    smoothed:true,
                                units: [
                                    ['week',[1]],
                                    ['month',[1]]
                                ]
                            }
                        },
                        column: {
                            dataGrouping: {
                                approximation: "sum",
                              //  smoothed:true,
                                units: [
                                    ['week',[1]],
                                    ['month',[1]]
                                ]
                            }
                        }
                    },
                    tooltip: {
                        shared:true,
                            valueDecimals:2

                    },
                    series : [
                    {
                        type:"column",
                        tooltip: {
                            valueSuffix: ' €'
                        },
                        name:"Volumen",
                        yAxis: 1,
                        data:data.volume.series,
                        dataGrouping:{
                            enabled: _t.datagrouping
                        }
                    },{
                        data:data.price.series,
                        tooltip: {
                            valueSuffix: ' €'
                        },
                        name:"Preis",
                        yAxis: 0,
                        dataGrouping:{
                            enabled: _t.datagrouping
                        }
                        }]
                }
               _t.chart = new Highcharts.StockChart(opts)
            }, function(err){
                // Handle the error condition
            });



        },
        startup:function(){
            this.inherited(arguments);

        },
        resize:function(args){
            if(args){
                args.h  =args.h;  // this.divCredits height
                domGeometry.setMarginBox(this.domNode,args)
                if(this.chart){
                    this.chart.setSize(args.w,args.h,false);
                }
            }


        },
        getConfigSchema:function() {
            return [
                {
                    name: 'label',
                    type: 'string',
                    help: "Set the title for the widget",
                    label: "title",
                    defaultValue: this.label
                },
                {
                    name: 'type',
                    label: 'type',
                    help: 'Select Phelix',
                    type: 'selector',
                    defaultValue:this.type,
                    options: [
                        {
                            label:'Phelix Day Base',
                            value:"daybase"
                        },{
                            label:' Phelix Day Peak',
                            value:"daypeak"
                        }]
                }
            ]

        }
    });
});
