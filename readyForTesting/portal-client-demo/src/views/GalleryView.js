define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/GalleryView.html',
    'dijit/form/TimeTextBox',
    "portal/_base/widgetWrappers/WidgetWrapper",
    "portal/themes/yeti/gallery/Gallery"

], function (
    TemplatedMixin,
    WidgetBase,
    declare,
    template,
    TimeTextBox,
    WidgetWrapper,
    Gallery
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
            this.inherited(arguments);
            this.gal = new Gallery({},this.contentNode);
        },

        startup: function () {
            this.inherited(arguments);
            this.gal.startup();

        },

        resize:function(){
            this.inherited(arguments);
            console.log("gallery resize");
            this.gal.resize();
        }

    });
});
