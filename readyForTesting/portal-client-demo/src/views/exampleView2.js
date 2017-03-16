define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/exampleView2.html',
    'dijit/form/TimeTextBox',
    "portal/_base/widgetWrappers/WidgetWrapper"

], function (
    TemplatedMixin,
    WidgetBase,
    declare,
    template,
    TimeTextBox,
    WidgetWrapper

) {
    return declare([WidgetBase, TemplatedMixin], {
        templateString: template,
        version:"0.0.2",
        declaredClass:"exampleView2",
        content:"",
        constructor:function(args){
            this.inherited(arguments);
        },
        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },


        postCreate: function () {

        },

        startup: function () {
            this.inherited(arguments);


        },

        resize:function(){

        }

    });
});
