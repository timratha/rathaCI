define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/exampleView.html',
    'dijit/form/TimeTextBox',
    "portal/_base/widgetWrappers/WidgetWrapper"

], function (
    WidgetsInTemplateMixin,
    TemplatedMixin,
    WidgetBase,
    declare,
    template,
    TimeTextBox,
    WidgetWrapper
) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        version:"0.0.2",
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
            this.inherited(arguments);

/*            this._widgets["w10"].placeAt(this.w10);
            this._widgets["w10"].startup();*/
/*            var w10=this._widgets["w10"];
            w10.load().then(function(){
                w10.startup();
            })*/
        },

        startup: function () {
            this.inherited(arguments);
        },

        resize:function(){

        },


        configSchema:{
            content:{
                label:"content",
                type:'string',
                help:""
            },
            f2:{
                label:"something 2",
                type:'date',
                help:""
            },
            f3:{
                label:"something 3",
                type:'number',
                help:"",
                constraints: {
                    min:"0",
                    max:"12"
                }
            },
            mydate:{
                label:"something 3",
                type:'date',
                help:"",
                constraints: {
                    timePattern: 'HH:mm:ss'
                }
            },
            f4:{
              type:'widget',
              widget:TimeTextBox,
              help:"",
              config: {
                  name: "f4",
                  value: new Date(),
                  constraints: {
                      timePattern: 'HH:mm:ss',
                      clickableIncrement: 'T00:15:00',
                      visibleIncrement: 'T00:15:00',
                      visibleRange: 'T01:00:00'
                  }
              }
            }

            // how to handle object
        }

    });
});
