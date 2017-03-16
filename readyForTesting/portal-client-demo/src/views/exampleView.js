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
        declaredClass:"exampleView",
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

            var appVersion = ""
            new WidgetWrapper({model:this._widgets["w011"+appVersion],config:{iconClass:"fa fa-user"},_key:"w011"+appVersion},this.w1);
            new WidgetWrapper({model:this._widgets["w012"+appVersion],_key:"w012"+appVersion},this.w2);
            new WidgetWrapper({model:this._widgets["w013"+appVersion],_key:"w013"+appVersion},this.w3);
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

        }

    });
});
