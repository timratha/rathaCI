define([
    'dojo/dom-geometry',
    'dojo/text!./templates/IframeView.template.html',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare'
], function (domGeometry, template, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        version:"0.0.1",
        label:"IFrame View",
        templateString:template,
        declaredClass:'IframeView',

        postCreate:function(){
            this.inherited(arguments);
            var _t = this;
        },
        startup:function(){
            this.inherited(arguments);
            this.iframe.src=this.src;
        },
        resize:function(dim){
            if(dim){
                domGeometry.setMarginBox(this.domNode,dim);
                domGeometry.setMarginBox(this.iframe, domGeometry.getContentBox(this.domNode));
            }
        }
    });
});
