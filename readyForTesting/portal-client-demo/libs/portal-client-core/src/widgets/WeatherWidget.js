define([
    'dojo/dom-style',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    "dojo/dom-geometry",
    "dojo/request/script",
    'portal/widgets/_meteogramWidget',
    'portal/widgets/_hourByHourWeather',
    'portal/widgets/_weatherOverview',
    'dojo/text!./templates/weatherWidget.html',
    'dojo/domReady!'
], function (domStyle, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare, domGeometry,requestScript, Meteogram, hourByHourWeather, weatherOverview, template) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        _location: null,
        viewType: "meteogram", //meteogram, overview, hourbyhour. By default meteogram
        _timeout: 5000,
        version:"0.0.1",
        baseClass:"weatherWidget",
        _transportUrl: 'http://www.highcharts.com/samples/data/jsonp.php',
        _serviceUrl:'http://www.yr.no/place/',
        _xmlFile: '/forecast_hour_by_hour.xml',
        _creditsText: 'Weather forecast from yr.no, delivered by the Norwegian Meteorological Institute and the NRK',
        width:null,
        _city:"Aachen",
        _instance:null,
        _creditsH:20,
        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            var _t = this;
            this.inherited(arguments);
            this._location = this.location;
            this.city = this.location.split("/"). pop()
            this.label = this.label || "Weather "+this.city;
            if (this.timeout) {
                this._timeout = this.timeout;
            }

            if(this.width){
                domStyle.set(this.divWeatherWidget,"width",this.width+"px")
            }
            var url = this._transportUrl + '?url=' + this._serviceUrl + this.location + this._xmlFile;

            // JSONP request options and query parameters
            var requestOptions = {
                jsonp: 'callback',
                preventCache: true,
                timeout: this.timeout
            };

            var resp;
            requestScript.get(url, {
                jsonp: "callback"
            }).then(function(response){
                    if (_t.viewType == "meteogram") {
                        _t._instance = new Meteogram({jsonData:response, container:_t.divWeatherWidget});
                        _t.divCredits.style.display="block";
                        _t.dialogSize={w:"90%",h:"50%"};
                    }
                    else if (_t.viewType == "overview") {
                        _t._instance  = new weatherOverview({jsonData:response, container:_t.divWeatherWidget});
                    }
                    else if (_t.viewType == "hourbyhour") {
                        _t._instance  = new hourByHourWeather({jsonData:response, container:_t.divWeatherWidget});
                    }
                },
                function (error) {
                    console.debug('WeatherWidget. Error: ' + error);
                    throw new Error('WeatherWidget. Error: ' + error.message);
                });


        },

        startup: function () {
            this.inherited(arguments);
        },
        resize:function(args){
            if(args){
                args.h  =args.h- 30;  // this.divCredits height
                domGeometry.setMarginBox(this.divWeatherWidget,args)
            }
            if(this._instance) {
                this._instance.resize();
            }
        },
        getConfigSchema:function() {
            return [
/*                {
                    name: 'width',
                    label: 'Width',
                    help: 'Width for weather widget in pixels',
                    type: 'number',
                    defaultValue: this.width,
                    constraints: {
                        min: 300,
                        max: 1000
                    }
                },*/
                {
                    name: 'label',
                    type: 'string',
                    help: "Set the title for the widget",
                    label: "title",
                    defaultValue: this.label
                },
                {
                    name: 'location',
                    label: 'Location',
                    defaultValue:this.location,
                    help: 'Location string for the city to show. For example Germany/North_Rhine-Westphalia/Aachen. see www.yr.no for details',
                    type: 'string'
                },
                {
                    name: 'viewType',
                    label: 'type',
                    help: 'Presentation type.',
                    type: 'selector',
                    defaultValue:this.viewType,
                    options: [
                        {
                            label:'meteogram',
                            value:"meteogram"
                        },{
                            label:'overview',
                            value:"overview"
                        },{
                            label:'hourbyhour',
                            value:"hourbyhour"
                        }]
                }
            ]
        }

    });
});