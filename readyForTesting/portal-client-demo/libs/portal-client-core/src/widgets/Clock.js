define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/clock.html',
    "dojo/i18n!../nls/clock",
    "dojo/dom-class"
], function (WidgetsInTemplateMixin, TemplatedMixin, WidgetBase,declare, template, clockNls, domClass) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        declaredClass:"clockWidget",
        _format: "short",
        _showDate: true,
        _showTime: true,
        _showSeconds: true,
        _clock24hours: true,
        _backgroundColor: null,
        _color: null,
        _timeColor: null,
        _dateFontSize: null,
        _dateFontFamily: null,
        _timeFontSize: null,
        _timeFontFamily: null,
        _style: null, //clockBasic, clockFancy
        baseClass: "clock",
        format: "long",
        border: null,
        intervalId: null,
        version:"0.0.1",

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
            var _t = this;
            this._initialize();

            this.intervalId=setInterval(function(){
                _t._createDateTimeInterval()
            },1000);
        },

        startup: function () {
            this.inherited(arguments);
        },

        _initialize: function() {

            if (this.format) {
                this._format = this.format;
            }
            if (this.showDate) {
                this._showDate = this.showDate;
            }
            if (this.showTime!=undefined) {
                this._showTime = this.showTime;
            }
            if (this.showSeconds!=undefined) {
                this._showSeconds = this.showSeconds;
            }
            if (this.clock24hours!=undefined) {
                this._clock24hours = this.clock24hours;
            }
            if (this.backgroundColor) {
                this._backgroundColor = this.backgroundColor;
                this.dateTimeContainer.style.backgroundColor = this._backgroundColor;
            }
            if (this.color) {
                this._dateColor = this.color;
                this.divDate.style.color = this.color;
                this._timeColor = this.color;
                this.divTime.style.color = this.color;
            }
            if (this.border) {
                this._border = this.border;
                this.dateTimeContainer.style.border = this._border;
            }
            if (this.dateFontSize) {
                this._dateFontSize = this.dateFontSize;
            }
            if (this.timeFontSize) {
                this._timeFontSize = this.timeFontSize;
            }
            if (this.dateFontFamily) {
                this._dateFontFamily = this.dateFontFamily;
                this.divDate.style.fontFamily = this._dateFontFamily;
            }
            if (this.timeFontFamily) {
                this._timeFontFamily = this.timeFontFamily;
                this.divTime.style.fontFamily = this._timeFontFamily;
            }
            if (this.style) {
                domClass.remove(this.domNode,this.baseClass);
                domClass.add(this.domNode,this.style);
            }


            //Default Font Size calculation.
/*            var fontsize = this._height.substring(0,this._height.length-2)/3;
            (this.dateFontSize==undefined) ? this.divDate.style.fontSize = (fontsize/2.5) + "px" : this.divDate.style.fontSize = this.dateFontSize;
            (this.timeFontSize==undefined) ? this.divTime.style.fontSize = fontsize + "px" : this.divTime.style.fontSize = this.timeFontSize;*/


        },

        _createDateTimeInterval: function () {
            var d;
            d = new Date();

            if (this._showDate) {
                var day = d.getDate();
                var month = d.getMonth()+1;
                var year = d.getFullYear();
                var dateString;
                var monthString;
                var dayString;
                if (this._format && this._format=="long") {
                    var dayOfWeek = d.getDay();
                    if (dayOfWeek==0) {
                        dayOfWeek=7;
                    }
                    if (clockNls.months[month-1]) {
                         monthString = clockNls.months[month-1];
                    }
                    if (clockNls.days[dayOfWeek-1]) {
                        dayString = clockNls.days[dayOfWeek-1];
                    }
                    dateString = dayString + "," + " " + day + " " + monthString + " " + year;
                }
                else {
                    dateString = day + " - " + month + " - " + year;
                }
                if(this.divDate) {
                    this.divDate.innerHTML = dateString;
                }

            }

            if(this._showTime) {
                var hour = d.getHours();
                var am_pm = clockNls.am;
                if (!this._clock24hours) {
                    if (hour > 12) {
                        hour = hour-12;
                        am_pm = clockNls.pm;
                    }
                }
                var minutes = d.getMinutes();
                if (minutes<10) {
                    minutes = "0" + minutes;
                }
                var timeString = hour + " : " + minutes;

                if (this._showSeconds) {
                    var seconds = d.getSeconds();
                    if (seconds <10) {
                        seconds = "0" + seconds;
                    }
                    timeString += " : " + seconds;
                }

                if (!this._clock24hours) {
                    timeString += " " + am_pm;
                }
                if(this.divTime) {
                    this.divTime.innerHTML = timeString;
                }

            }

        },
        resize:function(){
            this.inherited(arguments);
            //console.log("resize clock")
        },
        getConfigSchema:function() {
            return [
                {
                    name: 'backgroundColor',
                    type: 'string',
                    help: "Set the background color for the widget",
                    label: "background color",
                    defaultValue: "white"
                },
                {
                    name: 'color',
                    type: 'string',
                    help: "Set the font color for the widget",
                    label: "font color",
                    defaultValue: "#336699"
                },
                {
                    name: 'label',
                    type: 'string',
                    help: "Set the title for the widget",
                    label: "title",
                    defaultValue: this.label
                },
                {
                    name: 'format',
                    label: 'date format',
                    help: 'Date format long/short',
                    type: 'selector',
                    defaultValue:this.format,
                    options: [
                        {
                            label:'long',
                            value:"long"
                        },{
                            label:'short',
                            value:"short"
                        }]
                }
            ]
        }

    });
});
