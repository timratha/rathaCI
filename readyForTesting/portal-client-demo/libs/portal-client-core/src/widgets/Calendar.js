define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/dom-style',
    'dojo/text!./templates/calendar.html',
    'dijit/Calendar'
], function (WidgetsInTemplateMixin, TemplatedMixin, WidgetBase,declare, domStyle, template) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        version:"0.0.1",
        baseClass: "calendar",
        templateString: template,
        _initialDate: null,
        _height: null,
        _width: null,
        _backgroundColor: null,
        _border: null,
        _fontSize: null,
        _fontFamily: null,
        _color: null,

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
            var _t = this;
            _t._initialize();
        },

        startup: function () {
            this.inherited(arguments);
        },
        getConfigSchema:function() {
            return [
                {
                    name: 'label',
                    type: 'string',
                    help: "Set the title for the widget",
                    label: "title",
                    defaultValue: this.label
                }
            ]
        },
        _initialize: function () {

            var style = new Object();

            var nodo = this.divCalendar.domNode;

            if (this.backgroundColor) {
                this._backgroundColor = this.backgroundColor;
                style.backgroundColor = this._backgroundColor;
            }
            if (this.border) {
                this._border = this.border;
                style.border = this._border;
            }
            if (this.color) {
                this._color = this.color;
                style.color = this._color;
            }
            if (this.fontSize) {
                this._fontSize = this.fontSize;
                style.fontSize = this._fontSize;
            }
            if (this.fontFamily) {
                this._fontFamily = this.fontFamily;
                style.fontFamily = this._fontFamily;
            }
            if (this.height) {
                this._height = this.height;
                style.height = this._height;
            }
            if (this.width) {
                this._width = this.width;
                style.width = this._width;
            }

            if (this.initialDate) {
                this._initialDate = this.initialDate;
                style.initialDate = this._initialDate;
            }

            domStyle.set(nodo, style);
            this.divCalendar.set('value', new Date(this._initialDate));
        },
        resize: function () {
            this.inherited(arguments);
        }
    });
});
