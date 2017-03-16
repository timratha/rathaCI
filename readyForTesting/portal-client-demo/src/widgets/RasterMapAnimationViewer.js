define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
	'dojo/_base/lang',
    'dojo/text!./templates/RasterMapAnimationViewer.html',
    "dojo/i18n!./nls/RasterMapAnimationViewer",
    "dojo/Deferred",
    "dojo/DeferredList",
    "dojo/request",
    "dojo/has",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/dom-class",
	"dijit/form/Button",
    "dojo/date",
	"dijit/Dialog",
	"./RasterToPointSeriesViewer"
], function (WidgetsInTemplateMixin, TemplatedMixin, WidgetBase,declare,lang,template, nlsViewer ,Deferred,DeferredList,request,has,domGeometry,domStyle,domClass,Button,dojoDate,Dialog,RasterToPointSeriesViewer) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
            templateString: template,
            declaredClass: "rasterMapAnimationViewer",
            baseClass: "rasterMapAnimationViewer",
            version: "0.0.1",
			// ConfigSchema >>>
			label : "Raster Viewer",
			rasterProvider: null, 	//  http://localhost:8080/KiWIS/KiWIS?datasource=1�
			ts_id : null,
			period:"PT3H",  	   // timerange: null,		//  {from:"",to:"",period:""},
			duration: 1000,
			baselayer : "osm",
			displayTimeFormat : 1,
			controlShow : 1,
			// <<<<  ConfigSchema 
			m_map: null,	
			m_si: null,
			m_runner:null,	
			m_r2pViewer:null,	
            postMixInProperties: function () {
                this.inherited(arguments);
				this.m_runner = new cRunner({repeat: true});
            },
          
			buildRendering: function () {
                this.inherited(arguments);
            },

		    postCreate: function () {
                this.inherited(arguments);
				
				this.set("timerange", {period:	this.period});
				this.set("duration", this.duration || 1000);
				
				if(this.ts_id && !isNaN(this.ts_id))
				{
					this.m_si = new cSeriesInfo(
					{
							t: this.ts_id, 
							r: this.rasterProvider
							/*
							r: "http://radar.nimes.fr/RasterProvider/RasterProvider",
							m: "http://radar.nimes.fr/mapserver/mapserv.exe?map=C:\\kisters\\map\\raster.map"
							*/
						}
					);
					this.get("runner").register("changeTsCurrent", this, this._redraw);
					this.get("runner").register("changeTsFirst", this, this._reload);
					this._createToolbarControl();
				}
            },
		    destroyRecursive: function () {
				var runner =this.get("runner");
				if(runner) runner.kill();
				if(this.m_r2pViewer)
				{
					var dlg = this.m_r2pViewer.get("_container");
					if(dlg)
						dlg.destroyRecursive();

				}
						
                this.inherited(arguments);
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
						name: 'duration',
						type: 'string',
						label:  nlsViewer.duration,
						defaultValue: this.duration
					},
					{
						name: 'baselayer',
						type: 'selector',
						label: nlsViewer.baselayer,
						defaultValue: this.baselayer,
						options: [
							{
								label:'OpenStreetMap',
								value:"osm"
							},{
								label:'Google Map',
								value:"google"
							},
							{
								label:'MapQuest Satellite',
								value:"sat"
							},
							{
								label:'MapQuest OSM',
								value:"mqosm"
							},
							{
								label:'MapQuest Hybrid',
								value:"hyb"
							}
						]
					},
					{
						name: 'controlShow',
						type: 'selector',
						label: nlsViewer.controlToolbar,
						defaultValue: this.controlShow,
						options: [
							{
								label:nlsViewer.visible,
								value:1
							},
							{
								label:nlsViewer.invisible,
								value:-1
							}
						]
					},
					{
						name: 'displayTimeFormat',
						type: 'selector',
						label: nlsViewer.displayTimeFormat,
						defaultValue: this.displayTimeFormat,
						options: [
							{
								label:'CurrentTime',
								value:1
							},
							{
								label:'CurrentDatetime',
								value:2
							},
							{
								label:'StartTime-EndTime',
								value:3
							},
							{
								label:'StartDatetime-EndDatetime',
								value:4
							}

						]
					}
				]
			},
			   
            startup: function () {
                if(this._started)
					return;
				this.inherited(arguments);
				var _t =this;
				
                this._createMap().then(function (map) {

					_t.m_map = map || null;

					if(!_t.m_map)	
						return;

                    _t._loadSeriesInfo(_t.get("runner").getFirst(), _t.get("runner").getLast()).then(
						function (oSeries) {
							if (!oSeries)
								return;

							var tmp = oSeries.calculateBounds(map.getView().getProjection()),
								zoneExtent = (tmp) ? tmp.bb_max : null;

							if (!zoneExtent)
								return;	

							var rlayer = new ol.layer.Image({
								/*
								source: new ol.source.ImageWMS({
									projection:map.getView().getProjection(),
									url: _t.mapserver,
									serverType: 'mapserver',
									__ratio:5,
									__resolution:[100],
									params: {'VERSION': '1.1.1', 'LAYERS': 'rainintensity'}
								}),
								*/
								extent: zoneExtent,
								name: "RasterLayer",
								visible: true
							});
							rlayer.set('_si', oSeries);
							_t.resize();
							
							map.addLayer(rlayer);
							_t.set( "mapExtent", { extent: zoneExtent, projection: _t.get("mapProjection")});
							_t.get("runner").start();
						},
						function(error)
						{
							alert(error);
						}
					);
                });

            },
          
			set: function (name,value) {
						
                switch(name)
                {
                    case 'mapExtent':

					    if (!this.m_map || !value || !value.extent)
                            return;
						
                        var extent = value.extent,
                            projection = value.projection || ol.proj.get('EPSG:4326');
						this._trace("set:mapExtent",extent,projection,this.get("mapSize"));
						
                        return this.m_map.getView().fitExtent(ol.proj.transformExtent(extent, projection,this.get("mapProjection")),this.get("mapSize"));

                        break;

					case 'mapSize':
										
						var size = 	value ||  null;
						
						if (!this.m_map || !size || !size.w ||  !size.h)
							return;
						this._trace("set:mapSize", size.w,size.h);
						return this.m_map.setSize([size.w,size.h]);
				
                    case 'timerange':

                        var timerange = value || {};

                        var _dtFrom=null, _dtTo=null;

                        if( timerange.period &&  timerange.period.substring(0,1) =="P" )
                        {
						    _dtTo = new Date();
                            _dtFrom = new Date();

                            var _period=timerange.period.substring(1);
							
							var datetime=_period.split("T");
							var tokes = ["Y","M","D", "H", "M", "S"];
							for (dt =0; dt < datetime.length;dt++ )
							{
								var str=datetime[dt];
								if(!str)
									continue;
								for (to =dt*3; to < dt*3+3;to++ )
								{
									if  (str.indexOf(tokes[to]) !=-1 )
									{ 	
										var val =parseInt(str.split(tokes[to])[0]);
										str=str.substring(str.indexOf(tokes[to] ) + tokes[to].length);
										if(!isNaN(val))
										{
											var key= tokes[to]+dt;
											while(Math.abs(val)>0)
											{
												if(key =="Y0")
													_dtFrom.setFullYear (_dtFrom.getFullYear()- 1);
												else if(key =="M0")
													_dtFrom.setMonth( _dtFrom.getMonth()-1);
												else if(key =="D0")
													_dtFrom.setDate( _dtFrom.getDate()-1);
												else if(key =="H1")
													_dtFrom.setHours( _dtFrom.getHours()-1);
												else if(key =="M1")
													_dtFrom.setMinutes( _dtFrom.getMinutes()-1);
												else if(key =="S1")
													_dtFrom.setSeconds( _dtFrom.getSeconds()-1);
												val= val-1;
											}
										}
									}
								}
							}
							
				        }
                        else
                        {
                            if( timerange.from)
                                _dtFrom = (has("ie") && has("ie") < 10) ?  new Date(dojoDate.stamp.fromISOString( timerange.from)) : new Date( timerange.from) ;

                            if( timerange.to)
                                _dtTo = (has("ie") && has("ie") < 10) ?  new Date(dojoDate.stamp.fromISOString( timerange.to)) : new Date( timerange.to) ;

                            if( _dtFrom != null &&  _dtTo != null)
                            {
                            }
                            else if( _dtFrom != null)
                            {
                                _dtTo=  new Date(_dtFrom.getTime()+3600000);
                            }
                            else if(_dtTo != null)
                            {
                                _dtFrom = new Date(_dtTo.getTime()-3600000);
                            }
                            else
                            {
                                _dtTo = new Date();
                                _dtFrom = new Date(_dtTo.getTime()-3600000);
                            }
                        }

						this._trace("set:timerange",timerange,{from:_dtFrom, to:_dtTo});
                        if( _dtFrom!= null &&  _dtTo!=null)
                        {
                            this.get("runner").setLast( _dtTo);
                            this.get("runner").setFirst(_dtFrom);
                        }
						
                        break;

                    case 'interval':
                        this.get("runner").setInterval(value);
						this._trace("set:interval",value);
                        break;

                    case 'delay':
                    case 'speed':
					case 'duration':
                        this.get("runner").setDelay(value);
						this._trace("set:duration",value);
                        break;

					case 'controlShow':
						if(this.toolbarNode)
						{	
							domStyle.set(this.toolbarNode, "visibility" , (value==1) ? "visibility" : "hidden");
						}
						
                        break;

				}
                this.inherited(arguments);

            },
            
			get: function (name) {
                switch(name)
                {
                    case 'map':
                        return this.m_map || null;
						break;
					case 'runner':
						return this.m_runner  || null;
						break;
                    case 'mapProjection':
                        return (this.m_map) ? this.m_map.getView().getProjection() : ol.proj.get("EPSG:3857");
						break;
					case 'mapLayers':
                        return (this.m_map) ? this.m_map.getLayers().getArray() : [];
						break;
					case 'mapSize':
                        return (this.m_map) ? this.m_map.getSize() : [];
						break;
							  
					case 'interval':
                        return (this.m_runner) ? this.m_runner.getInterval(): 300000;
						break;

                }
                return this.inherited(arguments);
            },

			resize: function (args) {

				var size = args ||  null;

				if(size)
				{
					if(this.controlShow ==1)
					{
						size.h = size.h  -40;
					}
					size.h = size.h  -10;
				}
				else
				{
					this.inherited(arguments);
					size = domGeometry.getContentBox(this.containerNode);
					if(this.controlShow !=1)
					{
						size.h = size.h + 30;
					}
				}
				domStyle.set(this.mapNode,{ "height" : size.h+ "px", "width" :size.w+ "px"});
				this._trace("resize",  args, size);
				this.set("mapSize",size);
           },
			
			_createToolbarControl: function () {
			
				if(this.controlShow !=1)
					return;
				var runner = this.get("runner");

				var firstButton = new Button({label: "<span>|&lt;</span>",title : nlsViewer.starttime}),
					prevButton = new Button({label: "<span>&lt;</span>",title : nlsViewer.previous}),
					playButton = new Button({label: "<span>"+ nlsViewer.start+"</span>",title : nlsViewer.start}),
					nextButton = new Button({label: "<span>&gt;</span>",title : nlsViewer.next}),
					lastButton = new Button({label: "<span>&gt;|</span>",title : nlsViewer.endtime});
				
				firstButton.placeAt(this.toolbarNode);
				prevButton.placeAt(this.toolbarNode);
				playButton.placeAt(this.toolbarNode);
				nextButton.placeAt(this.toolbarNode);
				lastButton.placeAt(this.toolbarNode);
			
				if(runner)
				{
					firstButton.on("click", function () {
							return  runner.first() ;
						}
					);
				
					prevButton.on("click", function () {
							return runner.prev();
						}
					);

					playButton.on("click", function () { 
							return (!runner.isRunning()) ?	runner.play(false,true) :	runner.stop();
						}
					);
					
					runner.register("play", playButton, function(obj){
						this.set("label","<span>"+ nlsViewer.stop+"</span>");
						this.set("title",  nlsViewer.stop );
					});
					runner.register("stop", playButton, function(obj){
						this.set("label","<span>"+ nlsViewer.start+"</span>");
						this.set("title", nlsViewer.start );
					});

					nextButton.on("click", function () {
						return runner.next();
					});
		
					lastButton.on("click", function () {
						return runner.last();
					});
					
				}
				

			},
            
			_createMap: function () {
				
				var _t =this,
					process = new Deferred();
				//
                var gmap = null,
                    layers = [],
                    layers_list = this.baselayer || "osm",
                    initExtent = this.initExtent || {
                            "xmin": 4,
                            "ymin": 43,
                            "xmax": 8,
                            "ymax": 47,
                            "spatialReference": {"wkid": 4326}
                        },
                    view_option = {zoom: 5, center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857')};
					  
                if (layers_list instanceof Array) {

                }
                else if (typeof layers_list == "string") {
                    layers_list = layers_list.split(",");
                }
				
                for (var i = 0; i < layers_list.length; i++) {
                    if (typeof layers_list[i] != "string") {
                        continue;
                    }
                    var name = layers_list[i].trim().toLowerCase();
					
						
                    switch (name) {
                        case "sat":
                        case "hyb":
                            layers.push(new ol.layer.Tile({source: new ol.source.MapQuest({layer: name})}));
                            break;
                        case "mqosm":
                            layers.push(new ol.layer.Tile({source: new ol.source.MapQuest({layer: "osm"})}));
                            break;
						case "osm":
                            layers.push(new ol.layer.Tile({source: new ol.source.OSM()}));
                            break;
                        case "gmap":
                        case "google":
                            // make sure the view doesn't go beyond the 22 zoom levels of Google Maps
                            view_option.maxZoom = 21;
		                    var gmapNode = lang.clone(this.mapNode);
		                    this.containerNode.appendChild(gmapNode);
                            gmap = new google.maps.Map(gmapNode, {
                                disableDefaultUI: true,
                                keyboardShortcuts: false,
                                draggable: false,
                                disableDoubleClickZoom: true,
                                scrollwheel: false,
                                streetViewControl: false
                            });
                    }

                }
                if (gmap != null) {
                    layers = [];
                }
                else if (layers.length < 1) {
                    layers.push(new ol.layer.Tile({source: new ol.source.OSM()}));
                }

				
                var map = new ol.Map(
                    {
                        controls: ol.control.defaults().extend(this._getMapCantrols()),
                        logo: false,
                        target: this.mapNode,
                        layers: layers
                    }
				);

                var view = new ol.View(view_option);
                if (gmap != null) {
					var size = domGeometry.getContentBox(this.mapNode);
                    domGeometry.setContentSize(gmap.getDiv(), size);
					
                    this.containerNode.removeChild(this.mapNode);
                    gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(this.mapNode);
                    view.on('change:center', function () {
                        var center = ol.proj.transform(view.getCenter(), view.getProjection(), 'EPSG:4326');
                        gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
                    });
                    view.on('change:resolution', function () {
                        gmap.setZoom(view.getZoom());
                    });
                }

                if (initExtent && initExtent.xmax && initExtent.ymax && initExtent.xmin && initExtent.ymin) {
                    var extent = [initExtent.xmin, initExtent.ymin, initExtent.xmax, initExtent.ymax],
                        sr = initExtent.spatialReference || null,
                        projection = ol.proj.get('EPSG:4326');

                    if (sr) {
                        if (sr.wkid) {
                            projection = ol.proj.get('wkid:' + sr.wkid) || ol.proj.get('EPSG:' + sr.wkid) || projection;
                        }
                        else if (sr.epsg) {
                            projection = ol.proj.get('wkid:' + sr.epsg) || projection;
                        }
                    }
                    view.fitExtent(ol.proj.transformExtent(extent, projection, view.getProjection()), map.getSize());
                }
                map.setView(view);

                map.on('moveend', function () { /* _t._trace('map:MOVEEND!'); */
                });
                map.on('postrender', function () {   /* console.debug('postrender!'); */
                    process.resolve(map);
                });
				map.on('singleclick', function(evt) {
					var prop= this.getView().getProperties();
					if(prop && prop["rasterToPoint"]==1)
						_t._showRasterInfo(evt);
				});
				 
                return process;
            },
			
			_getMapCantrols : function() {
			
				var runner =  this.get("runner");
					
				var displayTimeFormat = this.get("displayTimeFormat") ;
				
                var DatetimeControl = function(opt_options) {
                    var options = opt_options || {};
                    var element = document.createElement('div');
                    element.innerHTML ="";
                    element.className = 'olCurrentDatetime ol-unselectable ol-control tf-' +displayTimeFormat; 
                    ol.control.Control.call(this, {
                        element: element,
                        target: options.target
                    });
                };
                ol.inherits(DatetimeControl, ol.control.Control);

                var datetimeControl=  new DatetimeControl();
				datetimeControl.setProperties({ displayTimeFormat : displayTimeFormat, tsHelper: this.ts});
				
				if(runner)
				{
					runner.register("changeTsCurrent", datetimeControl, function(dtCurrent){
						var prop =  this.getProperties();
						var displayTimeFormat  = prop["displayTimeFormat"] || 1,
							tsHelper  = prop["tsHelper"] || null;
						if(!tsHelper)
							return;
						switch(displayTimeFormat)
						{
							case 2:				// CurrentDatetime
								this.element.innerHTML = tsHelper.toString(dtCurrent,"yyyy-MM-dd HH:mm:ss");
								break;	
							case 3:				// StartTime-EndTime
								this.element.innerHTML = tsHelper.toString(runner.getFirst(),"HH:mm:ss") + " " + tsHelper.toString(runner.getLast(),"HH:mm:ss");
								break;
							case 4:				// StartDatetime-EndDatetime
								this.element.innerHTML = tsHelper.toString(runner.getFirst(),"yyyy-MM-dd HH:mm:ss") + " " + tsHelper.toString(runner.getLast(),"yyyy-MM-dd HH:mm:ss");
								break;
							case 1:				//CurrentTime
							default:
								this.element.innerHTML = tsHelper.toString(dtCurrent,"HH:mm:ss");
								break;
						}
					});
				}
				
				var RasterToPointControl = function(opt_options) {
                    var options = opt_options || {};
					 var _t = this;
					var button = document.createElement('button');
					button.innerHTML = '<i class="title-icon fa fa-line-chart" ></i>';
					var element = document.createElement('div');
					element.className = 'olRasterToPoint  ol-unselectable ol-control olInactive';
					element.appendChild(button);

					var activate = function(e) {
						var prop =  _t.getProperties(),
							activated  = (prop["activated"] == 1);
						if(activated)
							domClass.add(element,"olInactive");
						else
						{
							domClass.remove(element,"olInactive");
						}
						_t.setProperties({ activated : (activated)?0:1});
						_t.getMap().getView().setProperties({"rasterToPoint": (activated)?0:1});
					};
					button.addEventListener('click', activate, false);
					ol.control.Control.call(this, {
						element: element,
						target: options.target
					});
                };
				ol.inherits(RasterToPointControl, ol.control.Control);
				
				var r2pControl=  new RasterToPointControl();
				r2pControl.setProperties({ "activated" : 0});
			
				return [datetimeControl,r2pControl];
			},
			
            _loadSeriesInfo: function (tsFrom, tsTo) {

                var process = new Deferred(),
					_t=this,
					 oSeries = this.m_si || null;
				
                if (oSeries) 
				{
					domStyle.set(this.loaderNode,{ "display" : "block"});
						
                    oSeries.read({from: this.ts.toISO8601(tsFrom), to: this.ts.toISO8601(tsTo)}).then(
                        function (oSeries) {
							if(!oSeries)
								return;
                            var  iloader = new  cILoader();

                            var startTime= tsFrom.getTime(),
                                endTime  = tsTo.getTime(),
								interval	= _t.get("interval"),
								mapProjection =   _t.get("mapProjection") ;
								

                            var  rasterSize= oSeries.getRasterSize(),
                                tmp = oSeries.calculateBounds(mapProjection),
                                zoneExtent = (tmp) ?  tmp.bb_max : null;
									
                            for (var ti=startTime; ti <=endTime && zoneExtent ;ti=ti+interval)
                            {
                                var _item = oSeries.getItemByTime(new Date(ti));
                                var	_src= _item["img_src"],
                                    _path= 	_item["path"],
									_timestamp=_item["timestamp"];
                                if(!_src)
                                    continue;

                                var param = {
                                    proj:mapProjection,
                                    extent:zoneExtent,
                                    width:rasterSize[0],
                                    height:rasterSize[1],
                                    timestamp:_timestamp
                                };
                                var url = oSeries.getMsUrl(param);
                                iloader.add(url);
                            }
                            iloader.start();
							domStyle.set(_t.loaderNode,{ "display" : "none"});
							process.resolve(oSeries);
                        },
                        function (error) {
							domStyle.set(_t.loaderNode,{ "display" : "none"});
                            _t._trace(error);
                            process.resolve(null);
                        }
                    );
                }
                else {
                    process.resolve(null);
                }
                return process;
            },

            _reload: function () {

                this._loadSeriesInfo(this.get("runner").getFirst(), this.get("runner").getLast()).then(
					function (oSeries) {
						if (!oSeries)
							return;

					},
					function(error)
					{
					
					}
				);
            } ,

            _redraw: function (args) {


                var dtCurrent = this.get("runner").getCurrent(),
					mapProjection=this.get("mapProjection") ,
					mapLayers = this.get("mapLayers");

                //rlayer.set('_si', oSeries);
                for (var li = 0; li < mapLayers.length; li++) {

                    var layer =mapLayers[li];

                    if (!layer.getVisible())
                        continue;

				
					
                    var oSeries =layer.get('_si');
                    if (!oSeries)
                        continue;

                    var _item = oSeries.getItemByTime(dtCurrent);
                    var	_src= _item["img_src"],
                        _path= 	_item["path"],
						_timestamp= 	_item["timestamp"],
                        _no_data = oSeries.getNoDataImage() ;

                    /*
                                        var source =  new ol.source.ImageWMS({
                                            projection: this.get("mapProjection"),
                                            url: this.mapserver,
                                            serverType: 'mapserver',
                                            __ratio:5,
                                            __resolution:[100],
                                            params: {'VERSION': '1.1.1', 'LAYERS': 'rainintensity'}
                                        });

                                        source.updateParams({file:_src, path: _path});
                    */


                    var mapSize = this.get("mapSize");
                    var url = _no_data;
                    if(_src) {
						var rasterSize= oSeries.getRasterSize(),
							extent = layer.getExtent();
                        var param = {
                            proj: mapProjection,
                            extent: extent,
                            width: rasterSize[0],
                            height: rasterSize[1],
							timestamp:_timestamp
                        };
                        url = oSeries.getMsUrl(param);
                    }
					
					this._trace(_timestamp,(_src)? url:null );
					
                    var source =  new ol.source.ImageStatic({
                        url: url,
                        projection: this.get("mapProjection"),
                        imageExtent: layer.getExtent()
                    });

                    layer.setSource(source);
                    /*
                    if (!mapLayers[li].getSource)
                        continue;
                    var source = mapLayers[li].getSource();
                        oSeriesInfo = source.get('_si');
                    if (source instanceof  ol.source.ImageWMS && oSeriesInfo) {
                        var _item = oSeriesInfo.getItemByTime(dtCurrent);
                        var	_src= _item["img_src"],
                            _path= 	_item["path"],
                            _no_data = oSeriesInfo.getNoDataImage() ;

                        source.updateParams({file:_src, path: _path});

                    }*/
                }
            },
            
			_showRasterInfo : function(evt){
				
				if(!evt || !evt.coordinate)
					return;
				
				var coordinate = evt.coordinate,
				    mapLayers = this.get("mapLayers");
				
                for (var li = 0; li < mapLayers.length; li++) {

                    var layer =mapLayers[li];

                    if (!layer.getVisible())
                        continue;

                    var oSeries =layer.get('_si');
                    if (!oSeries)
                        continue;
					
					var extent = layer.getExtent();
					 if (!extent)
                        continue;
				
					coordinate = ol.proj.transform(coordinate, this.get("mapProjection"), layer.getSource().getProjection());
					
					if(ol.extent.containsCoordinate(extent,coordinate))
					{
						
						var rsViewer = (this.m_r2pViewer) ? (this.m_r2pViewer) : null;
							
						if(!rsViewer)
						{
							rsViewer = new RasterToPointSeriesViewer({rasterProvider : this.get("rasterProvider")});
							this.m_r2pViewer= rsViewer;
						
						}
						var dlg = rsViewer.get("_container");
						
						if(!dlg)
						{
							var size = domGeometry.getContentBox(this.containerNode),
								w = Math.max(parseInt((size.w|| 220)*0.6),250),
								h = Math.max(parseInt(w*2/3),200);
					
							dlg =new Dialog({title:  oSeries.get("ts_name"), className: this.baseClass});
							dlg.onHide = function() {
								rsViewer.removeSeries();
							};
							
							rsViewer.placeAt(dlg.containerNode);
							rsViewer.resize({w:w,h:h});
							dlg.show();
							domStyle.set(dlg.underlayAttrs.dialogId+"_underlay" , "display", "none");		
							rsViewer.set("_container",dlg);
						}
						else
						{
							dlg.show();
						}
						rsViewer.loadData({
								ts_id : oSeries.get("ts_id"),
								ts_name : oSeries.get("ts_name"),
								x: coordinate[0],
								y:coordinate[1],
								projection: layer.getSource().getProjection().getCode(),
								from:	this.ts.toISO8601(this.get("runner").getFirst()), 
								to : this.ts.toISO8601( this.get("runner").getLast()) 
							},false);
						break;
					}
				}
			},
	
			_trace : function ()
			{
				//if( window._TRACE_==1) console.debug(arguments);
			},
			
			ts: {
				toISO8601 : function (dt, encode, sep) 
				{
					encode = (encode == false) ? false : true;
					sep = sep || "T";

					var timezoneOffset = dt.getTimezoneOffset();

					var rtc = dt.getFullYear() + "-"
						+ String("00" + String(dt.getMonth() + 1)).substr(-2)
						+ "-"
						+ String("00" + String(dt.getDate())).substr(-2)
						+ sep
						+ String("00" + String(dt.getHours(8, 2))).substr(-2)
						+ ":"
						+ String("00" + String(dt.getMinutes(10, 2))).substr(-2)
						+ ":00";
					if (timezoneOffset > 0)
						rtc += "-" + String("00" + Math.abs(timezoneOffset / 60)).substr(-2) + ":" + String("00" + Math.abs(timezoneOffset % 60)).substr(-2);
					else if (timezoneOffset < 0)
						rtc += "%2B" + String("00" + Math.abs(timezoneOffset / 60)).substr(-2) + ":" + String("00" + Math.abs(timezoneOffset % 60)).substr(-2);
					else
						rtc += "-00:00";
					return (encode == true) ? encodeURIComponent(rtc) : rtc;
				},
				toString :function(oDate,format)
				{
					if(!oDate)
						return "";
					var str = format ||  "yyyy-MM-dd HH:mm:ss";
					str = str.replace("yyyy", oDate.getFullYear());
					str = str.replace("MM", (((oDate.getMonth()+1) < 10) ? "0" + (oDate.getMonth()+1) : (oDate.getMonth()+1)));
					str = str.replace("dd",  ((oDate.getDate() < 10) ? "0" + oDate.getDate()      : oDate.getDate()));
					str = str.replace("HH",  ((oDate.getHours() < 10) ? "0" + oDate.getHours()      : oDate.getHours()));
					str = str.replace("mm",  ((oDate.getMinutes() < 10) ? "0" + oDate.getMinutes()      : oDate.getMinutes()));
					str = str.replace("ss",  ((oDate.getSeconds() < 10) ? "0" + oDate.getSeconds()      : oDate.getSeconds()));
					return str;
				}
			}
        }
    );



    /*-------class cSeriesInfo ---------*/
    function cSeriesInfo (args)
    {
        this.m_attr       = {
            ts_id: args["t"],
            rasterProvider :   args["r"],
            mapserver :   args["m"],
            layer  :   args["l"] || "rainintensity",
            dataformat: "GeoTIFF"
        };
        this.m_si_time 		   = [];
        this.m_si_data		   = [];

        this.get = function ( name,def) {
            return this.m_attr[name] || (def?def :null);
        };
        this.set=  function ( name,val)
        {
            this.m_attr[name] = val;
        };
        this.getTimeByNum =  function (theNum)
        {
            return (theNum < 0  || theNum >= this.m_si_time.length) ? '' :    this.m_si_time[theNum];
        };
        this.getNumByTime = function (theTime)
        {
            for(var i= 0;i < this.m_si_time.length; i++ ) if(theTime.getTime()==this.getTimeByNum(i).getTime()) return i;
            return -1;
        };
        this.getItemByTime =  function (theTime)
        {
            return this.getItemByNum(this.getNumByTime(theTime));
        };
        this.getNoDataImage =  function () {
            return 'data:image/png;base64,' + "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3gkKDgowUOWgxgAAAAlwSFlzAAALEgAACxIB0t1+/AAAAwBQTFRFvQtJvQtKvQxKvQxLvQ1LvQ5LvgxKvgxLvg1Lvw1LvQ5MvQ9Mvg1Mvg9Nvw5Mvw9NvRBNvRFOvRJOvxBNvhFOvhRQvRhSvxhTvSBXvSFYvSJYvSJZvSNZviJZviNavSRaviVbviZbvidcvihcvipevixfvi1gvi9hvjFivjJjvjJkvjNkvzNkvjVlvjhnvjpovj5rv0FtvkNuvkdxv0lzvkpzvlB3vlF4vlR5vlh8vlx+wBFOwBJPwBRRwRVRwRZSwRlUwhlVwhpVwhxWwx1Xwh5Xwh9ZwCNawyBZwyRcxCNcxSZexihfxSlgxiphxS1ixixixy5kwDRlxztsyDBmyDJnyDZpyDdqyjdryjptyj9wwElzwU53xUh0ykFxzkd3wVd80FF+vl6AvmGCv2SEv2+Lv3GMv3SOv3aPv36V0lmD0FyEwGiHz2CHwXaRwXiS0mOK0mWL1WKK02mO1G+S2G6T0XOU0H+b2X+fv4yev4+gv5Kiv5Sjv52pxoSb0YGd1YCe14GfyoyixZioxpyry5Glypus1I2m2Yqm2oqm1Jet1Zit3JWuwKKswKavwKevxqSwwKiwwKmxwKqxwKuywquzwKyzxKu0xq22xq63yq23wLK3wLS4wLa5wLe6x7C4wLq8wLu9w7m8wLy9wLy+wL6/y7O81Ka22qe53ay91rC94Zqz5Z635Ku/wL/A07vE1b7G1r/H3LrG6a3C6a7D47XF5bDD5rbH6rfJ6L7NwMDAwcHBwsLCw8PDxMTExcXFx8fHycHEzMHFyMjIycnJ1sHI2cHK2MPK28XN0NDQ0dHR1dXV19fX29DU3tPX2NjY2dnZ2tra3Nzc3d3d3t7e39/f6cDO4MjR5M3V6s3X7MrW6M/Y5dHY6dLa6NTb69Tc7tLc7NXd7dXe7tbf7trh79zj9d3m5eXl5ubm6Ojo6enp6+vr7Ozs7u7u8eTp8ufr8PDw8vLy9PT09fT09fX19vb2+/L1+vT2+Pj4+fn5+vr6/fv8/Pz8/fz8/f39/v7+oj2rygAAALt0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AGHy/mgAAAVkSURBVHja7ZYHcBRlHEfDCrfLEbH3U5CgqBFiRwEVLFjAmNUoYsGuCPaODXvDFsWIJhFLYsHedbGgsWFUFDt2iSJiiMQ9NTFc/Pb2LpdjnEGZ4MvI781c2fv+9+3Lu73M5XjLODm0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKsFR2LY31+1dz/3R+aQdoN48Sq+irxe0VnMzM1aXm6zpCAG+a3z4eJZbrL3YvMxDMpec7QoDgQymN9T2yV0HZEetvVOHdPjo/1r/Su3tAXmzjdfp5VdvlbXB0arDvMfmxLc3SUX16bHZe62FA5YC8HttYbm1wBZyzYWzr48zq6N69zRuzh8MrYPjZeWYpGSCzPRYguBJLrKGfn+Xsfct457QXbjr+tbHOmVMLOk+ofcguqiuIPn5y7r3h4OAr3zjFuXBqgXX11yNWuTx9aJaq1rYm1D5tu7PNXhUrr/bZM/s+Yg2+5rH9c6d42cM3Jk825IE3R+VOSQbIbA8GcH1za5wccf3JkeI5XvVHk+zid6NDF9bcGnHnd9kjcZt9+PRwsGnmJHu/d6K7/llziXNo6vADs1TeZXczbZkArl9q7fzsy299aVZnXOqMeSV7+PXwZE0zbrDH3GOel2e2pwOkbw3XbttzTXMxW4V/BEu1lh3J6eT+nBoMXypqNI+DIuFhg1mamJoOAngHdXV2uys5fL3lfpE9/F3qRMHzT83jxMz2HSVA/Uqr3vec486PDo8HS/XdClsMfpsA9d2Gxb1xVrETHgZLZdFh8dYA3v2ndh11c/BsnDVykeHZ6QDnWgcEzysy23eUAN933vP3yyz3156Dvinvb17adMePvfO3SA8m7zYfOKsq33myTYCq9QbOCqaTX4FjH77YPsN8Bfw7+zhPLMgeDgMU+pUF9oPfBu/dpHX7jhLAP7h7963MBXvdgSvsc5I90i8bu4u14gXz2ga444Sdluv11A+RTACvdET35U+0k39f+WFrdDrkt0+sIXtZ616VqMkeDgPssH1O9KLEo8F7M9tjAbxqcwW2vc1NJH4yD6/+svB08wl6L81tbGl+Oz2YvHv+x6ZEw/TWw4BpCxLN77f4weGLc5pa5pmvQFM8EZ/pLTIcnqS5uSXxYfjezPZYgL+nNLaWtfoViZolPAX4K6edApjfbPFE43tLfI7q//w/W3sH+D+jALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNMt8gL8AlLAJ7mFj6fUAAAAASUVORK5CYII=";
        };
        this.getItemByNum =  function (theNum)
        {
            if  (theNum < 0  || theNum >= this.m_si_data.length)
                return   {
                    img_src : null  // this.getNoDataImage()
                };

            var _item = this.m_si_data[theNum] || {} ;
            var isCumulate = this.get("isCumulate"),
                isStatistics = this.get("isStatistics");

            var fld_value = "value";
            if (isCumulate == true)
                fld_value =  "cumulate" ;
            else if (isStatistics == true)
                fld_value =  "value.mean" ;

            if(!_item[fld_value])
            {
                _item["img_src"] =  null ;
            }
            else
            {
                if (this.get("dataformat") =="GeoTIFF" || this.get("dataformat") =="tif")
                    _item["img_src"] =  _item[fld_value] ;
                else
                    _item["img_src"]='data:image/png;base64,'+_item[fld_value];

                if(isCumulate == true || isStatistics == true)
                {
                    _item["value"] = _item[fld_value];
                }
            }
            return  _item;
        };
        this.getProjection =  function ()
        {
            return ol.proj.get (this.get("projection"),"EPSG:4326");
        };
        this.getRasterSize =  function ()
        {
            return [this.get("raster_width",256),this.get("raster_height",256)];
        };

        this.getMsUrl=  function (args)
        {

            var rasterSize= this.getRasterSize(),
                width= args["width"] ||  rasterSize[0],
                height= args["height"] ||  rasterSize[1],
                extent=   args["extent"] || null,
                proj  = args["proj"] ||  this.getProjection(),
				timestamp = args["timestamp"] ||  null;

            if(!extent)
            {
                var tmp = this.calculateBounds(proj);
                extent = (tmp) ? tmp.bb_max : null;
            }

          
		
            var url =  this.get('rasterProvider',"");
			if(!url  || url.length < 5 || url.indexOf("?")<0){
				return null;
			}

            url += "&TRANSPARENT=true";
            url += "&LAYERS="+ this.get("layer","RainIntensity");
            url += "&SERVICE=WMS";
            url += "&VERSION=1.3.0";
            url += "&REQUEST=GetMap";
            url += "&STYLES=";
            url += "&FORMAT=image%2Fpng";
            url += "&CRS="+ proj.getCode();
            url += "&BBOX="+extent.join(",");
            url += "&WIDTH="+ width;
            url += "&HEIGHT="+ height;
			url +='&rasterwms=true';
			url +="&ts_id="+ this.get('ts_id');
			
			if(timestamp)
				url += "&date="+	 timestamp;

			

            return url;
        };
        this.calculateBounds =  function (destProj)
        {
            var env = this.get("envelope",null),
                srcProj= this.getProjection();
            if(env==null)
                return null;
            var wkt = new ol.format.WKT(),
                f=wkt.readFeature(env);

            var geo= f.getGeometry();

            if(srcProj != destProj)
                geo.transform(srcProj, destProj);
            return {
                bb_max :geo.getExtent(),
                bb_min : geo.getExtent(), /*geo.getMinBounds(),*/
                bb: geo.getExtent()/*geo.getComputedBounds()*/
            };
        };
        this.read =  function (args)
        {
            var _t =this,
                from = args.from,
                to= args.to;

			var  deferred = new Deferred();

            var url =  this.get('rasterProvider',"");
			if(!url  || url.length < 5 || url.indexOf("?")<0){
				deferred.reject("rasterProvider is not set properly");
				return deferred2;
			}
			
			// kiwis
			if(url.indexOf("datasource")<0){
				deferred.reject("datasource is not set");
				return deferred;
			}
			if(url.indexOf("service")<0)
				url +='&service=kisters';
			if(url.indexOf("type")<0)
				url +='&type=queryServices';
	
			url +='&request=getRasterTsValues';
			url +='&format=dajson&md_returnfields=all&metadata=true';
			url +="&ts_id="+ this.get('ts_id');
            url +="&from="+from;
            url +="&to="+to;
				
		
            var params = {timeout: 60000, method: "GET", handleAs: "json"};
            if (url.indexOf(window.location.hostname) < 0)
                params["headers"] = {"X-Requested-With": null};


            var def_list=[];

            var process= request(url,params);
            def_list.push(process);

            process.then(function(rtc)
            {
                if(!rtc || rtc["error"]  ||  rtc["statusCode"] ==500)
                {
					return null;
                }
				 
				if(rtc.length<1)
					return null;
				rtc = rtc[0];
				
				 
                var proj =rtc["station_RASTER_AREA_PROJECTION"] ||	rtc["geo_projection"] || _t.get("projection","epsg:4326");
                proj =proj.replace("[","").replace("]","");

                _t.set("raster_width", rtc["raster_width"] || 256);
                _t.set("raster_height",rtc["raster_height"] || 256);

                var  envelope = rtc["station_RASTER_AREA_ENVELOPE"] || rtc["geo_envelope"] || _t.get("envelope");

                _t.set("envelope", envelope);
                _t.set("projection", proj);

                var keys =["ts_name","ts_shortname","parameter_name","parameter_shortname","ts_unitname","ts_unitsymbol"];
                for(var k=0; k< keys.length;k++)
                    _t.set(keys[k],rtc[keys[k]] || "") ;

                var data_path = rtc["data-path"] || "";
                var tbl =  new cTable(rtc);
                for(var r=0;r < tbl.getRowCount();r++){

                    var item =tbl.getRow(r);
                    item["path"] = data_path;
                    item["fc"] = false;

                    var _dt = item["timestamp"];
                    if(!_dt)
                        continue;
                    var _dto = (has("ie") && has("ie") < 10) ?  new Date(dojoDate.stamp.fromISOString(_dt)) : new Date(_dt) ;
                    var index =_t.getNumByTime(_dto)	;
                    if(index<0)
                    {
                        _t.m_si_time.push(_dto);
                        index =_t.m_si_time.length-1;
                        _t.m_si_data[index]=item;
                    }
                    else // update
                    {
                        _t.m_si_data[index]=item;
                    }
                }
            }
			);

            var defs = new DeferredList(def_list);
				
            defs.then(function(result)
            {
                if(result[0][0])
					deferred.resolve(_t);
				else	
				{
					deferred.reject(result[0][1]);
				}	
            });
            return deferred.promise;

        }
	
    }

    /*-------class cTable ---------*/
    function  cTable(rtc){
        this.m_idx={};
        this.m_data= [];
        this.m_attr= {};
        if((!rtc )){}
        else
        {
            var columns = (rtc.columns || "0,1,2,3,4,5,6,7,8,9,10").split(",");
            for (var ti=0; ti < columns.length; ti++) this.m_idx[columns[ti].toLowerCase()]=ti;
            this.m_data= rtc.data || [];
            for (var attr in rtc) if(attr!= "data") this.m_attr [attr] = rtc[attr];
        }
        this.getMetaData = function()
        {
            return  this.m_attr;
        };
        this.getRowCount = function()
        {
            return this.m_data.length;
        };
        this.getRow = function(idx)
        {
            return  (idx >=0 && this.m_data[idx])? this.__toObj(this.m_data[idx]) : null;
        };
        this.getColums = function()
        {
            var colums=[];
            for (var attr in this.m_idx) colums.push(attr);
            return colums;
        };
        this.__toObj = function(item)
        {
            var _obj = {};
            for (var attr in this.m_idx) {
				if (typeof item[this.m_idx[attr]] != "undefined") _obj [attr] = item[this.m_idx[attr]];
			}
            return _obj;
        };
    }

    /*-------class cRunner ---------*/

    function cRunner (opt)
    {
        this.m_attr = {
            dealy: 200,
            interval: 300000,
            repeat : (opt && opt.repeat) ? opt.repeat : true
        };

        this.__get = function(theName, theDefault)  {
            theDefault = theDefault || null;
            return (typeof this.m_attr[theName] == 'undefined') ? theDefault : this.m_attr[theName];
        };
        this.__set = function(theName, theValue)  {

            if((theName== "first" || theName=="last") && (typeof  theValue =="object") && theValue.getTime)
            {
                theValue = new Date(theValue.getTime() - theValue.getTime() % this.__get("interval"));
            }
            this.m_attr[theName] =theValue;
        };


        this.m_listenerList={};
        this.m_run 	     = false;
        this.m_firstRun  = true;
        this.m_timer     = null;
        this.m_lock     = 0;

        this.setFirst = function(v)  { this.__set("first",v);   this.triggerEvent("changeTsFirst",v);};
        this.setLast = function(v)   { this.__set("last", v);  this.triggerEvent("changeTsLast",v); };
        this.setCurrent = function(v){ this.__set("current",v); this.triggerEvent("changeTsCurrent",v);};
        this.setInterval =function(v)   { this.__set("interval", (isNaN(v) ? 300000:  parseInt(v)));  this.triggerEvent("changeInterval",v);};
        this.setDelay =function(v)   {  if(!isNaN(v))  { this.__set("dealy", parseInt(v));  this.cont ();   this.triggerEvent("changDelay",v); }};

        this.getLast 	= function	() { return this.__get("last",null);};
        this.getFirst	= function	() { return this.__get("first",null);};
        this.getCurrent = function	() { return this.__get("current",null);};
        this.getInterval =function()   { return this.__get("interval",300000); /* 5 min*/ };
        this.getDelay    =function()   { return this.__get("dealy",1000); };
        this.isRepeats =  function()   { return this.__get("repeat",true);};

        this.register  =  function  (type, obj, func,priority)
        {
            var listeners = this.m_listenerList;
            if (!listeners[type]) {
                listeners[type] = [];
            }
            if (priority && listeners[type].length>0)
            {
                listeners[type].splice(0,0, {obj: obj, func: func});
            }
            else
            {
                listeners[type].push({obj: obj, func: func});
            }
        };
        this.triggerEvent  =  function (type)
        {
            var listeners = this.m_listenerList[type];
            if(!listeners || listeners.length == 0) {
                return;
            }
            var args=[];
            for(var ii=1; ii < arguments.length;ii++) args.push(arguments[ii]);
            for (var i=0; i<listeners.length; i++) {
                var callback = listeners[i];
                if(!callback.func)
                    continue;
                callback.func.apply(callback.obj || this,args);
            }
        };

        this.isRunning =  function ()
        {
            return this.m_run;
        };


        this.start = function()
        {
            setTimeout(( function ( obj ) { return function () { obj.play(true); }; } )( this),50);
        };
		this.kill = function()
        {
            if(this.m_timer != null) { clearTimeout(this.m_timer);this.m_timer=null;}
        };
		
        this.cont = function()
        {
            if(this.m_timer != null) { clearTimeout(this.m_timer);this.m_timer=null;}
            if (this.isRunning())
            {
                if(this.m_lock <= 0)
                {
                    if (this.m_firstRun)	this.first();
                    else 					this.next();
                }
                this.m_timer = setTimeout(( function ( obj ) { return function () { obj.cont(); }; } )( this),this.getDelay());
            }
        };
        this.play = function (theFirst,theReset)
        {
            if(typeof(theFirst) != "undefined" && theFirst == true)  {
                this.m_firstRun  = true;
            }
            if(typeof(theReset) != "undefined" && theReset == true)  {
                this.m_lock=0;
            }
            this.fireAction  ('play');
        };

        this.lock = function ()	{
            this.fireAction  ('lock');
        };
        this.unlock = function (){
            this.fireAction  ('unlock');
        };
        this.stop= function (){
            this.fireAction  ('stop');
        };
        this.next = function (){
            this.fireAction  ('next');
        };
        this.prev =  function (){
            this.fireAction  ('prev');
        };
        this.fastNext = function () {
            this.fireAction  ('fastForw');
        };
        this.fastPrev = function fastPrev()	{
            this.fireAction  ('fastBackw');
        };
        this.first = function (){
            this.m_firstRun=false;
            this.fireAction  ('first');
        };
        this.last = function () {
            this.fireAction  ('last');
        };
        this.stopPlay = function () {
            return  this.isRunning() ? this.stop() : this.play ();
        };
        this.fireAction  = function (action) {

            switch(action)
            {
                case 'lock':
                    this.m_lock++;
                    break;
                case 'unlock':
                    this.m_lock--;
                    break;
                case 'next':
                case 'prev':
                case 'fastForw':
                case 'fastBackw':
                case 'first':
                case 'last':
                    var dtCurrent=this.__getNextTime(action);
                    this.setCurrent(dtCurrent);
                    this.triggerEvent ("timer",dtCurrent);
                    break;
                case 'stop':
                    this.m_run = false;
                    break;
                case 'play':
                    this.m_run = true;
                    this.cont();
                    break;
            }
            this.triggerEvent (action);
        };
        this.__getNextTime = function (action) {

            var dtCurrent =  this.getCurrent()   || this.getFirst() ,
                dtLast = this.getLast() ||  dtCurrent,
                dtFirst = this.getFirst() ||  dtCurrent;

            if(!dtCurrent)
                return;

            var theMillis   = dtCurrent.getTime(),
                theInterval = this.getInterval();

            switch(action)
            {
                case "first":
                    theMillis = dtFirst.getTime();
                    break;
                case "last":
                    theMillis = dtLast.getTime();
                    break;
                case "next":
                    theMillis += theInterval;
                    break;
                case "prev":
                    theMillis -= theInterval;
                    break;
                case "fastForw":
                    theMillis += theInterval*6;
                    break;
                case "fastBackw":
                    theMillis -= theInterval*6;
                    break;
                default:
                    // return tsCurrent  // alert('invalid parameter');
                    break;
            }

            if(isNaN(theMillis))
                return;

            var theDate= new  Date(theMillis);

            if (theMillis > dtLast.getTime() )
            {
                if(this.isRepeats()) 	{theDate =  dtFirst;  }
                else				    {this.stop(); theDate = dtLast;  }
            }
            else if (theMillis < dtFirst.getTime())
            {
                if(this.isRepeats()) 	{theDate =  dtLast  }
                else				    {this.stop(); theDate =  dtFirst;}
            }
            return theDate;
        }
    }


    /*-------class cILoader ---------*/
    function cILoader ()
    {
        this.m_list={};
        this.hashCode = function(src) {
            var hash = 0, i, chr, len;
            if (src.length == 0) return hash;
            for (i = 0, len = src.length; i < len; i++)
            {
                chr   = src.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };
        this.start= function(){
            var _t =this;
            for (var hashCode in this.m_list)
            {
                var src =  this.m_list[hashCode];
                if(!src)
                    continue;
                var img = new Image();
				img.setAttribute("hashCode",hashCode);

				img.onload= function()	{
					var h= this.getAttribute("hashCode");
                    _t.m_list[h]=null;
                };
				img.onerror = function()	{};
				img.src = src;
            }
        };
        this.add = function(src){
            var hashCode=this.hashCode(src);
            if(this.m_list[hashCode])
                return;
            this.m_list[hashCode]= src;
        }
    }

});
