define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/weatherOverview.html',
    'dojo/i18n!../nls/weatherOverview',
    'dojo/domReady!'
], function (WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare, template, nls) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {

        templateString: template,
        _jsonData: null,
        _container: null,
        _forecastRecord: {
            locationName: '',
            country: '',
            sym:'',
            prognose:'',
            temp:'',
            wind:'',
            windSpeed:'',
            windSpeedName:'',
            maxTemperature:'',
            minTemperature:'',
            image:''
        },
        _nls: nls,

        version:"0.0.1",
        baseClass: "weatherOverview",
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


            var divWeatherOverview = this.divWeatherOverview;
            var divContainer = this.divContainer;



            var temperatures = [];

            //Always get the first record. Most recent in time.
            var time = this._jsonData.forecast.tabular.time[0]
            this._forecastRecord.locationName = this._jsonData.location.name;
            this._forecastRecord.country = this._jsonData.location.country;
            this._forecastRecord.sym = time.symbol['@attributes']['var'].match(/[0-9]{2}[dnm]?/)[0];
            this._forecastRecord.prognose=time.symbol['@attributes'].name;
            this._forecastRecord.temp = time.temperature['@attributes'].value;
            this._forecastRecord.wind = time.windDirection['@attributes'].name;
            this._forecastRecord.windSpeed = parseFloat(time.windSpeed['@attributes'].mps);
            this._forecastRecord.windSpeedName = time.windSpeed['@attributes'].name;

            var temperatures = [];

            this._jsonData.forecast.tabular.time.forEach(function (time, i) {
                temperatures.push(parseInt(time.temperature['@attributes'].value));
            });
            this._forecastRecord.maxTemperature = Math.max.apply(Math, temperatures);
            this._forecastRecord.minTemperature = Math.min.apply(Math, temperatures);

            //Sprite
            var url = require.toUrl("portal")+"/widgets/images/meteogram-symbols-90px.png";
            var symbolSprites = this.getSymbolSprites(90);
            var sprite = symbolSprites[this._forecastRecord.sym];
            if (sprite) {
                this._forecastRecord.image = '<image style="display:block; width:90px; height:90px; background-image: url(\''+url+'\'); background-position:-'+sprite.x+'px -'+sprite.y+'px; "></image>';
            }

            //Fill HTML spans
            this.header.innerHTML = this._forecastRecord.locationName + ' , ' + this._forecastRecord.country;
            this.image.innerHTML = this._forecastRecord.image;
            this.temp.innerHTML = this._forecastRecord.temp;
            this.prognose.innerHTML = this._forecastRecord.prognose;
            this.nlsWind.innerHTML = this._nls.wind;
            this.windSpeed.innerHTML = this._forecastRecord.windSpeed;
            this.windName.innerHTML = this._forecastRecord.wind;
            this.windSpeedName.innerHTML = this._forecastRecord.windSpeedName;
            this.highTemperature.innerHTML = this._nls.highTemperature;
            this.lowTemperature.innerHTML = this._nls.lowTemperature;
            this.maxTemperature.innerHTML = this._forecastRecord.maxTemperature;
            this.minTemperature.innerHTML = this._forecastRecord.minTemperature;

        },

        startup: function () {
            this.inherited(arguments);
        },
        resize: function () {
            this.inherited(arguments);

        },
        getSymbolSprites: function (symbolSize) {
            var _ret =  {
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
            return _ret;
        }


    });
});