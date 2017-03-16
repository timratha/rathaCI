define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    "dijit/_PaletteMixin",
    'dojo/_base/declare',
    'dojo/text!./templates/IconPicker.html',
    "dijit/form/DropDownButton",
    "dijit/TooltipDialog",
    "dojo/string",
    "dojo/dom-construct",
    "dijit/popup",
    "dijit/registry",
    "dojo/topic"
], function (WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, PaletteMixin, declare, template,
             DropDownButton, TooltipDialog, string, domConstruct, popup, registry, topic) {

    var tooltip = null;

    var IconPicker = declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, PaletteMixin], {
        templateString: template,
        baseClass: "iconPicker",
        version: "0.0.1",

        buttonLabel: "Icon",
        numColumns: 10,
        iconsArray: [
            "fa-adjust",
            "fa-adn",
            "fa-align-center",
            "fa-align-justify",
            "fa-align-left",
            "fa-align-right",
            "fa-ambulance",
            "fa-anchor",
            "fa-android",
            "fa-angellist",
            "fa-angle-double-down",
            "fa-angle-double-left",
            "fa-angle-double-right",
            "fa-angle-double-up",
            "fa-angle-down",
            "fa-angle-left",
            "fa-angle-right",
            "fa-angle-up",
            "fa-apple",
            "fa-archive",
            "fa-area-chart",
            "fa-arrow-circle-down",
            "fa-arrow-circle-left",
            "fa-arrow-circle-o-down",
            "fa-arrow-circle-o-left",
            "fa-arrow-circle-o-right",
            "fa-arrow-circle-o-up",
            "fa-arrow-circle-right",
            "fa-arrow-circle-up",
            "fa-arrow-down",
            "fa-arrow-left",
            "fa-arrow-right",
            "fa-arrows",
            "fa-arrows-alt",
            "fa-arrows-h",
            "fa-arrows-v",
            "fa-arrow-up",
            "fa-asterisk",
            "fa-at",
            "fa-automobile",
            "fa-backward",
            "fa-ban",
            "fa-bank",
            "fa-bar-chart",
            "fa-bar-chart-o",
            "fa-barcode",
            "fa-bars",
            "fa-beer",
            "fa-behance",
            "fa-behance-square"
        ],

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
            this._dyeClass = declare(IconPicker._Icon);
            var iconsTable = this._createIconsTable();
            var titlesTable = this._createTitlesTable();
            this._setButtonLabel(iconsTable[0][0]);
            this._preparePalette(iconsTable, titlesTable);
        },

        postCreate: function () {
            this.inherited(arguments);
            var _t = this;
            this.on("Change", function (value) {
                _t._setButtonLabel(value);
                popup.close(_t.iconPickerTooltip)
            });
        },

        startup: function () {
            this.inherited(arguments);
        },

        _createIconsTable: function () {
            var iconsTable = [];
            var i = -1;
            var j = -1;
            for (var k = 0; k<this.iconsArray.length; k++) {
                if (k % this.numColumns == 0) {
                    i++;
                    j = 0;
                    iconsTable[i] = [];
                }
                iconsTable[i][j] = this.iconsArray[k];
                j++;
            }
            if (iconsTable[i].length < this.numColumns) {
                for (j = iconsTable[i].length; j<this.numColumns; j++) {
                    iconsTable[i][j] = "";
                }
            }
            return iconsTable;
        },

        _createTitlesTable: function () {
            var titlesTable = [];
            for (var i = 0; i<this.iconsArray.length; i++) {
                titlesTable[this.iconsArray[i]] = this.iconsArray[i];
            }
            return titlesTable;
        },

        _setButtonLabel: function (value) {
            this.button.set("label", "<span class='fa " + value + "'></span>");
        },

        // Overrides _PaletteMixin._dyeFactory()
        _dyeFactory: function (value, row, col, title){
            return new this._dyeClass(value, row, col, title);
        }
    });

    IconPicker._Icon = declare([], {

        constructor: function (value, row, col, title) {
            this._value = value;
        },

        getValue: function () {
            return this._value;
        },

        fillCell: function (cell, blankGif) {
            domConstruct.create("span", {
                className: "fa " + this._value
            }, cell);
        }
    });

    return IconPicker;
});
