define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dgrid/Grid',
    'dojo/i18n!./nls/hourByHourWeather',
    'dojo/text!./templates/hourByHourWeather.html',
], function (WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare, Grid, nls, template) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        _jsonData: null,
        _container: null,
        _windSymbols: null,
        baseClass: "hourByHourWeather",
        version: "0.0.1",
        creditsText: "Weather forecast from yr.no, delivered by the Norwegian Meteorological Institute and the NRK",

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
            this._jsonData = this.jsonData;
            this._container = this.container;
            this.placeAt(this._container);


            var _t = this;
            var divGridWeather = this.gridWeather;
            var divContainer = this.divContainer;

            var forecastData = [];
            this._windSymbols = [];
            this._jsonData.forecast.tabular.time.forEach(function (time, i) {

                var forecastRecord = new Object();

                var from = time['@attributes'].from + ' UTC',
                    to = time['@attributes'].to + ' UTC';

                from = from.replace(/-/g, '/').replace('T', ' ');
                from = Date.parse(from);
                to = to.replace(/-/g, '/').replace('T', ' ');
                to = Date.parse(to);

                var fromTimeString = new Date(from).toTimeString(),
                    fromTimeArray = fromTimeString.split(":"),
                    toTimeString = new Date(to).toTimeString(),
                    toTimeArray = toTimeString.split(":"),
                    fromDateString = new Date(from).toLocaleDateString(),
                    fromToString = fromTimeArray[0] + ":" + fromTimeArray[1] + "-" + toTimeArray[0] + ":" + toTimeArray[1];

                forecastRecord.zeit=fromDateString + " - " + fromToString;
                forecastRecord.sym = time.symbol['@attributes']['var'].match(/[0-9]{2}[dnm]?/)[0];
                forecastRecord.prognose=time.symbol['@attributes'].name;
                forecastRecord.temp = time.temperature['@attributes'].value + "º";
                forecastRecord.niederschlag = time.precipitation['@attributes'].value + " mm";
                forecastRecord.windSymbol = "http://fil.nrk.no/yr/grafikk/vindpiler/32/vindpil.0000."+ (String("000" + parseInt(time.windDirection['@attributes'].deg/10) +"0")).substr(-3)+".png";
                forecastRecord.wind = time.windDirection['@attributes'].name;
                forecastData.push(forecastRecord);
            });

            var grid = new Grid(
                { columns: [
                    {id: 'zeit', field: 'zeit', label:nls.zeit},
                    {id: 'prognose', field: 'prognose', label:nls.prognose},
                    {id: 'sym', field: 'sym', label:nls.sym, formatter: function (value,rowIndex) {
                                var url = require.toUrl("portal")+"/widgets/images/meteogram-symbols-30px.png";
                                var symbolSprites = _t.getSymbolSprites(30);
                                var sprite = symbolSprites[rowIndex.sym];
                                if (sprite) {
                                    var d = '<image style="display:block; width:30px; height:30px; background-image: url(\''+url+'\'); background-position:-'+sprite.x+'px -'+sprite.y+'px; "></image>';
                                    return d;
                                }
                        }
                    },
                    {id:'temp', field: 'temp', label:nls.temp},
                    {id:'niederschlag', field: 'niederschlag', label:nls.niederschlag},
                    {id: 'wind', field: 'wind', label:nls.wind, formatter: function(value,rowIndex){
                            return '<image src="'+rowIndex.windSymbol+'"></image> &nbsp; &nbsp; ' + value;
                        }
                    }
                    ]
                },
                divGridWeather);
            grid.styleColumn("zeit", "width:19%");
            grid.styleColumn("prognose", "width:22%");
            grid.styleColumn("sym", "width:12%");
            grid.styleColumn("temp", "width:8%");
            grid.styleColumn("niederschlag", "width:25%");
            grid.styleColumn("wind", "width:18%");
            grid.renderArray(forecastData);

        },

        startup: function () {
            this.inherited(arguments);
        },
        resize: function () {
            this.inherited(arguments);

        },
        getSymbolSprites: function (symbolSize) {
            return {
                '01d': {
                    x: 0,
                    y: 0
                },
                '01n': {
                    x: symbolSize,
                    y: 0
                },
                '16': {
                    x: 2 * symbolSize,
                    y: 0
                },
                '02d': {
                    x: 0,
                    y: symbolSize
                },
                '02n': {
                    x: symbolSize,
                    y: symbolSize
                },
                '03d': {
                    x: 0,
                    y: 2 * symbolSize
                },
                '03n': {
                    x: symbolSize,
                    y: 2 * symbolSize
                },
                '17': {
                    x: 2 * symbolSize,
                    y: 2 * symbolSize
                },
                '04': {
                    x: 0,
                    y: 3 * symbolSize
                },
                '05d': {
                    x: 0,
                    y: 4 * symbolSize
                },
                '05n': {
                    x: symbolSize,
                    y: 4 * symbolSize
                },
                '18': {
                    x: 2 * symbolSize,
                    y: 4 * symbolSize
                },
                '06d': {
                    x: 0,
                    y: 5 * symbolSize
                },
                '06n': {
                    x: symbolSize,
                    y: 5 * symbolSize
                },
                '07d': {
                    x: 0,
                    y: 6 * symbolSize
                },
                '07n': {
                    x: symbolSize,
                    y: 6 * symbolSize
                },
                '08d': {
                    x: 0,
                    y: 7 * symbolSize
                },
                '08n': {
                    x: symbolSize,
                    y: 7 * symbolSize
                },
                '19': {
                    x: 2 * symbolSize,
                    y: 7 * symbolSize
                },
                '09': {
                    x: 0,
                    y: 8 * symbolSize
                },
                '10': {
                    x: 0,
                    y: 9 * symbolSize
                },
                '11': {
                    x: 0,
                    y: 10 * symbolSize
                },
                '12': {
                    x: 0,
                    y: 11 * symbolSize
                },
                '13': {
                    x: 0,
                    y: 12 * symbolSize
                },
                '14': {
                    x: 0,
                    y: 13 * symbolSize
                },
                '15': {
                    x: 0,
                    y: 14 * symbolSize
                },
                '20d': {
                    x: 0,
                    y: 15 * symbolSize
                },
                '20n': {
                    x: symbolSize,
                    y: 15 * symbolSize
                },
                '20m': {
                    x: 2 * symbolSize,
                    y: 15 * symbolSize
                },
                '21d': {
                    x: 0,
                    y: 16 * symbolSize
                },
                '21n': {
                    x: symbolSize,
                    y: 16 * symbolSize
                },
                '21m': {
                    x: 2 * symbolSize,
                    y: 16 * symbolSize
                },
                '22': {
                    x: 0,
                    y: 17 * symbolSize
                },
                '23': {
                    x: 0,
                    y: 18 * symbolSize
                }
            };
        }

    });
});