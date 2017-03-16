define([
    'dojo/_base/array',
    'dojo/dom-geometry',
    'dojo/_base/lang',
    'dijit/ProgressBar',
    'dijit/form/Button',
    'dijit/form/NumberTextBox',
    'dijit/_Container',
    'dojo/text!./templates/GraphExamples.template.html',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dijit/form/Form',
    'highcharts/highstock',
    'highcharts/highstockMore',
    'highcharts/highstockExport'
], function (array, domGeometry, lang, ProgressBar, Button, NumberTextBox, Container, template, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare, Form) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        version:"0.0.1",
        defaultLabel:"Graph Examples",
        templateString:template,
        declaredClass:"exampleWidget",
        type:"lg",
        dialogSize:{w:"90%",h:"80%"},
        postCreate:function(){
            this.inherited(arguments);

            var _t = this;

            Highcharts.setOptions({
                credits: {
                    enabled: false,
                    reflow:false
                }
            });

            if(this.type=="cs") {
                require(['portal-client-demo/data/cs'], function (cs) {
                    var csI =  lang.clone(cs)
                    csI.chart = {
                        renderTo:_t.graph,
                        reflow:false
                    }
                    _t.chart =  new Highcharts.StockChart(csI);
                    _t.resize();
                })
            }else if(this.type=="pfm") {
                require(['portal-client-demo/data/pfm'], function (pfm) {
                    var pfmI =  lang.clone(pfm)
                    pfmI.chart = {
                        renderTo:_t.graph,
                        type: 'areaspline'
                    }
                    _t.chart =  new Highcharts.StockChart(pfmI)
                    _t.resize();
                })
            }else if(this.type=="rees") {
                require(['portal-client-demo/data/rees'], function (rees) {
                    var reesI =  lang.clone(rees)
                    reesI.chart = {
                        renderTo:_t.graph,
                        events:{
                            redraw:function(){
                                //console.log(arguments)
                            }
                        }
                    }
                    _t.chart =   new Highcharts.StockChart(reesI)
                    _t.resize();
                })
            }else if(this.type=="lg") {
                require(['portal-client-demo/data/lg'], function (lg) {
                    var lgI =  lang.clone(lg)
                    lgI.chart = {
                        renderTo:_t.graph,
                        events:{
                            redraw:function(){
                                //console.log(arguments)
                            }
                        },
                        tooltip:{
                            shared:false,
                            valueDecimals:2,

                            pointFormatter: function () {
                                var x = this.x,
                                    ret = this.series.name + ': <b>' + this.y+'</b><br/>',
                                    series = this.series.chart.series,
                                    last = series.length - 1,
                                    s;

                                s = series[this.series._i == 1 ? 0 : 1];
                                array.forEach(s.points, function (j, p) {
                                    if (p.x >= x-24*36e5) {
                                        ret += s.name + ': <b>' + p.y + '</b>';
                                        return false;
                                    }
                                });
                                return ret;
                            }
                        }
                    }
                    _t.chart =   new Highcharts.StockChart(lgI)
                    _t.resize();
                })
            } else if(this.type=="aachen_daily") {
                require(['portal-client-demo/data/aachen_daily'], function (aachen_daily) {
                    var aachen_dailyI =  lang.clone(aachen_daily)
                    aachen_dailyI.chart = {
                        renderTo:_t.graph,
                        events:{
                            redraw:function(){
                                //console.log(arguments)
                            }
                        }
                    }
                    _t.chart =   new Highcharts.StockChart(aachen_dailyI)
                })

              }else if(this.type=="aachen_hourly") {
                require(['portal-client-demo/data/aachen_hourly'], function (aachen_hourly) {
                    var aachen_hourlyI =  lang.clone(aachen_hourly)
                    aachen_hourlyI.chart = {
                        renderTo:_t.graph,
                        events:{
                            redraw:function(){
                                //console.log(arguments)
                            }
                        }
                    }
                    _t.chart =   new Highcharts.StockChart(aachen_hourlyI)
                })

            }else if(this.type=="aachen_scatter") {
                require(['portal-client-demo/data/aachen_scatter'], function (aachen_scatter) {
                    var aachen_scatterI =  lang.clone(aachen_scatter)
                    aachen_scatterI.chart = {
                        renderTo:_t.graph,
                        events:{
                            redraw:function(){
                                //console.log(arguments)
                            }
                        }
                    }
                    _t.chart =   new Highcharts.StockChart(aachen_scatterI)
                })

            }else if(this.type=="polar") {
                require(['portal-client-demo/data/polar'], function (polar) {
                    var polarI = lang.clone(polar)
                    polarI.chart = {
                        polar: true,
                        renderTo: _t.graph,
                        events: {
                            redraw: function () {
                                //console.log(arguments)
                            }
                        }
                    }
                    _t.chart = new Highcharts.Chart(polarI)
                })
            }else if(this.type=="rose") {
                require(['portal-client-demo/data/rose'], function (rose) {
                    var roseI = lang.clone(rose)
                    roseI.chart = {
                        polar: true,
                        type: 'column',
                        renderTo: _t.graph,
                        events: {
                            redraw: function () {
                                //console.log(arguments)
                            }
                        }
                    }
                    _t.chart = new Highcharts.Chart(roseI)
                })
            }

        },
        startup:function(){
            this.inherited(arguments);

        },
        resize:function(args){
            //console.log("resizing",arguments)
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
                    help: 'Select chart example.',
                    type: 'selector',
                    defaultValue:this.type,
                    options: [
                        {
                            label:'Candlestick',
                            value:"cs"
                        },{
                            label:'Lastgang',
                            value:"lg"
                        },{
                            label:'Portfolio management',
                            value:"pfm"
                        },{
                            label:'Rees discharge',
                            value:"rees"
                        }]
                }

            ]

        }
    });
});
