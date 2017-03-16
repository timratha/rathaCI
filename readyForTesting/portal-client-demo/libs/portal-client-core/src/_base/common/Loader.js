define([
    'dojo/dom-style',
    'dojo/text!./templates/Loader.template.html',
    'dojo/dom-geometry',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'xstyle/css!./css/Loader.css'],function(domStyle, loaderTemplate, domGeometry, declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase){

  return  declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
      templateString:loaderTemplate,
      declaredClass:'Loader',

      resize:function(d){
          d && domGeometry.setMarginBox(this.domNode,d);
          var dim = domGeometry.getContentBox(this.domNode);
          var size = Math.min(dim.w,dim.h);
          if(size < 400){
              domStyle.set(this.iconContainer,'font-size','20px');
          }else if(size < 600){
              domStyle.set(this.iconContainer,'font-size','30px');
          }else{
              domStyle.set(this.iconContainer,'font-size','40px');
          }
      }
  });
})