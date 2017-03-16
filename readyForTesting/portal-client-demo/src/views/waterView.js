define([
    'dojo/dom-style',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/waterView.html',
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
        declaredClass:"waterView",
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
            if(this._widgets["reesWi"+appVersion]) {
                new WidgetWrapper({model: this._widgets["reesWi" + appVersion], _key: "reesWi" + appVersion}, this.w1);
            }else{
                domStyle.set(this.w1.parentNode,"display","none")
            }


            var w1 = new WidgetWrapper({model:this._widgets["multiGraph"+appVersion],_key:"multiGraph"+appVersion},this.w2)
            new WidgetWrapper({model:this._widgets["mapWidget"+appVersion],_key:"mapWidget"+appVersion},this.w3).startup();
            var w3 = new WidgetWrapper({model:this._widgets["layerSelector"+appVersion],_key:"layerSelector"+appVersion},this.w4);
            this.w4 = new WidgetWrapper({model:this._widgets["valueLayerList"+appVersion],_key:"valueLayerList"+appVersion},this.w5);
         //   w4.startup();
            var w5 = new WidgetWrapper({model:this._widgets["dataDownload"+appVersion],_key:"dataDownload"+appVersion},this.w6);


    //        new WidgetWrapper({model:this._widgets["w024"+appVersion],_key:"w024"+appVersion},this.w5);
/*            this._widgets["w10"].placeAt(this.w10);
            this._widgets["w10"].startup();*/
/*            var w10=this._widgets["w10"];
            w10.load().then(function(){
                w10.startup();
            })*/
        },

        startup: function () {
            this.inherited(arguments);
            this.w4.startup()
        },

        resize:function(){

        }

    });
});
