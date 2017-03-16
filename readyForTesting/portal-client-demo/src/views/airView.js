define([
    'dojo/dom-style',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/airView.html',
    'dijit/form/TimeTextBox',
    "portal/_base/widgetWrappers/WidgetWrapper"
], function (domStyle, WidgetsInTemplateMixin,
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
        declaredClass:"airView",
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
            if(this._widgets["w223"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w223" + appVersion], _key: "w223" + appVersion}, this.w1);
            }else{
                domStyle.set(this.w1.parentNode,"display","none")
            }

            if(this._widgets["w224"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w224" + appVersion], _key: "w224" + appVersion}, this.w2);
            }else{
                domStyle.set(this.w2.parentNode,"display","none")
            }

            if(this._widgets["w224"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w225" + appVersion], _key: "w225" + appVersion}, this.w3);
            }else{
                domStyle.set(this.w3.parentNode,"display","none")
            }


            if(this._widgets["w226"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w226" + appVersion], _key: "w226" + appVersion}, this.w4);
            }else{
                 domStyle.set(this.w4.parentNode,"display","none")
            }

            if(this._widgets["w227"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w227" + appVersion], _key: "w227" + appVersion}, this.w5);
            }else{
                domStyle.set(this.w5.parentNode,"display","none")
            }

            if(this._widgets["w228"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w228" + appVersion], _key: "w228" + appVersion}, this.w6);
            }else{
                domStyle.set(this.w6.parentNode,"display","none")
            }

    //        new WidgetWrapper({model:this._widgets["w24"+appVersion],_key:"w24"+appVersion},this.w5);
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
