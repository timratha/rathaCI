define([
    'portal/_base/widgetWrappers/WidgetWrapper',
    'dojo/text!./templates/SampleView.template.html',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'xstyle/css!./css/SampleView.css'
],function( WidgetWrapper,template, declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase,css){

  return  declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
      templateString:template,
      postCreate:function() {
          this.inherited(arguments);
          this.w1 = new WidgetWrapper({model: this._widgets['leftPanel'], baseClass: 'left-panel'}, this.leftPanel);
          this.w2 = new WidgetWrapper({
              model: this._widgets['rightPanel'],
              baseClass: 'right-panel'
          }, this.rightPanel);
      },
      resize:function(){
          this.w1.resize();
          this.w2.resize();
      },
      startup:function(){
          this.inherited(arguments);
          this.w1.startup();
          this.w2.startup();
      }
  });
})