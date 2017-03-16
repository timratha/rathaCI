define([
    'dojo/dom-geometry',
    'dojo/text!./templates/exampleWidget.template.html',
    'dijit/_WidgetsInTemplateMixin',
    //'portal/stores/permissionStore',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare'
], function (domGeometry, template, WidgetsInTemplateMixin, /*permissionStore,*/TemplatedMixin, WidgetBase, declare) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        version:"0.0.1",
        label:"Phelix Day Peak",
        templateString:template,
        declaredClass:"exampleWidget",
        src:"http://10.123.123.121:9090/esscockpit",
        postCreate:function(){
            this.inherited(arguments);

        },
        startup:function(){
            this.inherited(arguments);

                 // see 1 year of data
                 this.iframe.src=this.src;

            var myval = 2 ;
			/*
            if(permissionStore.check("amivalid-permission","functional")) {
                showvalue(2)
            }
			*/

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
                    name: 'src',
                    type: 'string',
                    help: "Set the source for the iframe",
                    label: "Source",
                    defaultValue: this.src
                }
            ]

        },
        resize: function () {
            this.inherited(arguments);
        }
    });
});
