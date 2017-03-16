define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
	'dojo/_base/lang',
    'dojo/text!./templates/RasterToPointSeriesViewer.html',
    "dojo/i18n!./nls/RasterToPointSeriesViewer",
	"dojo/i18n!./nls/RasterMapAnimationViewer",
    "dojo/request",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/dom-class",
	"highcharts/highstock"
], function (WidgetsInTemplateMixin, TemplatedMixin, WidgetBase,declare,lang,template,nlsR2pViewer, nlsViewer ,request,domGeometry,domStyle,domClass) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
            templateString: template,
            declaredClass: "rasterToPointSeriesViewer",
            baseClass: "rasterToPointSeriesViewer",
            version: "0.0.1",
			// ConfigSchema >>>
			label : "RasterToPoint Viewer",
			rasterProvider: null, 	
			ts_id : null,
			period:"PT3H",  	
			projection:"EPSG:3857",
			raster_x:null,
			raster_y:null,
			// <<<<  ConfigSchema 

            postMixInProperties: function () {
                this.inherited(arguments);
            },
          
			buildRendering: function () {
                this.inherited(arguments);
            },

		    postCreate: function () {
                this.inherited(arguments);
				Highcharts.setOptions({credits: {	enabled: false,	reflow:true}, global: {useUTC:false}});
					
			
				this.m_chart  = new Highcharts.StockChart({
						chart: {
							renderTo: this.graphNode
						},
						events:{
							redraw:function(){}
						},
						loading: {	style: {opacity: 0.7} },
						credits : { enabled: false},
						navigator: { enabled: false},
						rangeSelector: { enabled: false},  // _rangeSelector,
						scrollbar: { enabled: false},
						legend:	{
								enabled: true , maxHeight:72,
								useHTML:true,
								labelFormatter:function(){  return (this.options.legend ) ? this.options.legend : this.name;},
								symbolWidth: 10
						},
					
						title: {
							text: ''
						},
						xAxis: {
							lineWidth: 1,
							type: 'datetime',
							lineColor:"#404040"
						},
						yAxis: {
							title: {
								style: { "color": "#707070", "fontWeight": "normal" },
								text :"Test",
								align:'high' , //  'middle',
								rotation:  0,  // 270
								y: 0,// -10,
								textAlign: 'right',
								offset:3// -2  // 15
							},
							labels: {
								align: "right",
								x: -5,
								step:1
							},
							endOnTick: false,
							lineColor:"#404040",
							min: 0,
							opposite:false,
							lineWidth: 1
						},
						series :[]
				});
			},

			getConfigSchema:function() {
				return [
					{
						name: 'label',
						type: 'string',
						label: nlsViewer.title,
						help: "Set the title for the widget",
						defaultValue: this.label
					},
					{
						name: 'rasterProvider',
						type: 'string',
						label: "Raster Provider",
						defaultValue: this.rasterProvider
					},
					{
						name: 'ts_id',
						type: 'string',
						label:  nlsViewer.ts_id,
						defaultValue: this.ts_id
					},
					{
						name: 'period',
						type: 'string',
						label:  nlsViewer.period,
						defaultValue: this.period
					},
					{
						name: 'projection',
						type: 'string',
						label:  nlsViewer.projecton || "Projecton",
						defaultValue: this.projecton
					},
					{
						name: 'raster_x',
						type: 'string',
						label:  nlsViewer.rasterX || "X",
						defaultValue: this.raster_x
					},
					{
						name: 'raster_y',
						type: 'string',
						label:  nlsViewer.rasterY || "Y",
						defaultValue: this.raster_y
					}
				];
			},
			   
            startup: function () {
				if(this._started)
					return;
				this.resize();
				this.inherited(arguments);
				if(this.rasterProvider && this.ts_id && this.period && this.raster_x && this.raster_y && this.projection)
				{
					
					this.loadData({
							rasterProvider : this.rasterProvider,
							ts_id : this.ts_id,
							x: this.raster_x,
							y:this.raster_y,
							projection: this.projection,
							period:	this.period 
						},false);
				}		
            },
          
			removeSeries : function (redraw) {
				if(!this.m_chart)
					return;

				if (this.m_chart.yAxis.length >0 )
					this.m_chart.yAxis[0].setTitle({text :''},redraw);
				while(this.m_chart.series.length > 0)	this.m_chart.series[0].remove(redraw);

				if (this.m_chart.xAxis.length >0  &&  this.m_chart.xAxis[0].plotLinesAndBands >0)
				{
					var pl=this.m_chart.xAxis[0].plotLinesAndBands[0];
					pl.options.value= null;
					pl.render();
				}
			},
		  
			loadData: function (params, removeAll) {
				
				if(!params)
					return;

				if (removeAll == true)
					this.removeSeries();
				
				var rasterProvider  = params["rasterProvider"] ||  this.get("rasterProvider") ,
					ts_id  = params["ts_id"] ||  null,
					from  = params["from"] ||  null,
					to  = params["to"] ||  null,
					projection  = params["projection"] ||  null,
					raster_x  = params["raster_x"] || params["x"] || null,
					raster_y  = params["raster_y"] || params["y"] || null,
					period  = params["period"]  || null;
					
				var url  = rasterProvider; 	
				if(!url || !ts_id || !projection || !raster_x || !raster_y)
					return;
				
				if( !period  &&  ( !from || !to))
					return;
				
				if(!url  || url.length < 5 || url.indexOf("?")<0){
					// "rasterProvider is not set properly";
					return;
				}
			
				// kiwis
				if(url.indexOf("datasource")<0){
					// "datasource is not set";
					return;
				}

				if(url.indexOf("service")<0)
					url +='&service=kisters';
				if(url.indexOf("type")<0)
					url +='&type=queryServices';
	
	
				url +='&dateformat=UNIX';
				url +='&request=getRasterToPointValues';
				url +='&format=dajson&metadata=true';
				url +="&ts_id="+ ts_id;
				url += (period) ?  "&period="+period  :  "&from="+from +"&to="+to;
				url +="&raster_epsg="+projection +"&raster_x="+raster_x +"&raster_y="+raster_y;

			    var urlParams = {timeout: 60000, method: "GET", handleAs: "json"};
				if (url.indexOf(window.location.hostname) < 0)
					urlParams["headers"] = {"X-Requested-With": null};

				var _t = this;
				
				this.m_chart.showLoading();
				
				var process= request(url,urlParams);

				process.then(function(rtc) {
			 
					if(!rtc || rtc.length <1)
						return;

					var item = rtc[0] || null;

					if(!item)
						return;
					
					item["type"] = 'column';
					item["name"] =  "x="+ parseInt(raster_x) + ",y="+ parseInt(raster_y) ;
					
					item["request_param"] = {
						"rasterProvider" :  rasterProvider,
						"ts_id" : ts_id,
						"from" : from,
						"to"  : to,
						"projection" : projection,			
						"raster_x" :  raster_x,
						"raster_y" :  raster_y
					};
					
					_t.m_chart.addSeries(item ,false);
					
					if(item["ts_unitsymbol"])
						 _t.m_chart.yAxis[_t.m_chart.yAxis.length-1].setTitle({text: item["ts_unitsymbol"]});
					
					_t.m_chart.redraw();
					_t.m_chart.hideLoading();
					
					},
					function (error) {
						throw new Error(error.message);
				});
			},
		
			reloadData: function (newParams) {
				
				newParams =newParams || {};
				if(!this.m_chart || !this.m_chart.series || this.m_chart.series.length<1)
					return;
				
				var series = this.m_chart.series,
					params = [];
				var i;
				for ( i =0; i < series.length;i++)
				{
					var si = series[i];		
					if(!si["options"] || !si["options"]["request_param"])
						continue;
					params.push(lang.clone(si["options"]["request_param"]));
				}
				
				if(params.length<1)
					return;
				this.removeSeries();
				for ( i =0; i < params.length;i++)
				{
					if(newParams["ts_id"])
						params[i]["ts_id"] =newParams["ts_id"];
					if(newParams["from"])
						params[i]["from"] =newParams["from"];
					if(newParams["to"])
						params[i]["to"] =newParams["to"];
					
					
					this.loadData(params[i],false);
				}
			},
			
			set: function (name,value) {
		
                this.inherited(arguments);

            },
            
			get: function (name) {
                return this.inherited(arguments);
            },

			resize:function(args){
				
				if(args)
				{
					domGeometry.setMarginBox(this.containerNode,args);
				}
				else
				{
					 this.inherited(arguments);
				}
			   	var size = domGeometry.getContentBox(this.containerNode);
				if(this.m_chart)
					this.m_chart.setSize(size.w,size.h,false);
			}
    });
});