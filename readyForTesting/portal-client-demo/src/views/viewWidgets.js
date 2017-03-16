define([
    'dojo/dom-style',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/viewWidgets.html',
    "portal/_base/widgetWrappers/WidgetWrapper"

], function (domStyle, WidgetsInTemplateMixin,
    TemplatedMixin,
    WidgetBase,
    declare,
    template,
    WidgetWrapper
) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        declaredClass:"viewWidgets",
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
            var appVersion = "";


            if(this._widgets["w0141"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w0141" + appVersion], _key: "w0141" + appVersion}, this.w0);
            }else{
                domStyle.set(this.w0.parentNode,"display","none")
            }

            if(this._widgets["w014"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w014" + appVersion], _key: "w014" + appVersion}, this.w1);
            }else{
                domStyle.set(this.w1.parentNode,"display","none")
            }

            if(this._widgets["w015"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w015" + appVersion], _key: "w015" + appVersion}, this.w2);
            }else{
                domStyle.set(this.w2.parentNode,"display","none")
            }

            if(this._widgets["w016"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w016" + appVersion], _key: "w016" + appVersion}, this.w3);
            }else{
                domStyle.set(this.w3.parentNode,"display","none")
            }

            if(this._widgets["w017"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w017" + appVersion], _key: "w017" + appVersion}, this.w4);
            }else{
                domStyle.set(this.w4.parentNode,"display","none")
            }

            if(this._widgets["w018"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w018" + appVersion], _key: "w018" + appVersion}, this.w5);
            }else{
                domStyle.set(this.w5.parentNode,"display","none")
            }

            if(this._widgets["w019"+appVersion]) {
				
                new WidgetWrapper({model: this._widgets["w019" + appVersion], _key: "w019" + appVersion}, this.w6);
            }else{
                domStyle.set(this.w6.parentNode,"display","none")
            }

            if(this._widgets["w0181"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w0181" + appVersion], _key: "w0181" + appVersion}, this.w7);
            }else{
                domStyle.set(this.w7.parentNode,"display","none")
            }
            if(this._widgets["w0191"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w0191" + appVersion], _key: "w0191" + appVersion}, this.w8);
            }else{
                domStyle.set(this.w8.parentNode,"display","none")
            }
			if(this._widgets["w027"+appVersion]) {
                new WidgetWrapper({model: this._widgets["w027" + appVersion], _key: "w027" + appVersion}, this.w10);
            }else{
                domStyle.set(this.w10.parentNode,"display","none")
            }

			if(this._widgets["w028"+appVersion]) {
				console.debug(this._widgets["w028" + appVersion]);
                new WidgetWrapper({model: this._widgets["w028" + appVersion], _key: "w028" + appVersion}, this.w11);
            }else{
                domStyle.set(this.w11.parentNode,"display","none")
            }

			
        },

        startup: function () {
            this.inherited(arguments);
        },

        resize:function(){
			console.debug("resize");
			 this.inherited(arguments);
        },

        createWidget2:function(){
            if(!this.wd2){
                this.wd2= new WidgetWrapper({model:this._widgets["w13"],_key:"w13"});
                this.wd2.placeAt(this.w12);
                this.wd2.startup();
            }
        },
        destroyWidget2:function(){
            var w=this.wd2;
            this.wd2=null;
            w.destroyRecursive();
        }
    });
});
