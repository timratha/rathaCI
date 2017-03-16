define([
    'dojo/dom-geometry',
    'dojo/text!./templates/iframeWidget.template.html',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare'
], function (domGeometry, template, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        version:"0.0.1",
        label:"Phelix Day Peak",
        templateString:template,
        declaredClass:"exampleWidget",
        src:"http://10.123.123.121:9090/esscockpit",
        postCreate:function(){
            this.inherited(arguments);

            var _t = this;



        },
        startup:function(){
            this.inherited(arguments);
            this.iframe.src=this.src;
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
        resize:function(dim){
            //for temp
            if(dim){
                domGeometry.setMarginBox(this.iframe,dim);
            }
        }
    });
});
