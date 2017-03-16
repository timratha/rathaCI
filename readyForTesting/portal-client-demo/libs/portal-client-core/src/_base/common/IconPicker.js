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
    "dojo/topic",
    './icons'
], function (WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, PaletteMixin, declare, template,
             DropDownButton, TooltipDialog, string, domConstruct, popup, registry, topic,icons) {

    var tooltip = null;

    var IconPicker = declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, PaletteMixin], {
        templateString: template,
        baseClass: "iconPicker",
        version: "0.0.1",
        declaredClass:'IconPicker',

        buttonLabel: "Icon",
        numColumns: 20,
        iconsArray: icons,

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
            this.value = this.iconsArray[0];
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
