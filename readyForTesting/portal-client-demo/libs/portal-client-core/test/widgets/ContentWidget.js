define(['dojo/i18n!./nls/ContentWidget',
    'dojo/dom-geometry',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'xstyle/css!./css/ContentWidget.css'
],function(nls, domGeometry, declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase){

  return  declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
      templateString:'<div class="ContentWidget">${content}</div>',
      title:nls.title,
      getConfigSchema:function(){
          return [
              {
                  name: "label",
                  label: 'label',
                  type: 'string',
                  help: "Set the label "
              },
              {
                  name: "content",
                  label: 'Content',
                  type: 'string',
                  help: "Set the content "
              }
          ]
      },
      resize:function(dim){
          if(dim){
              domGeometry.setMarginBox(this.domNode,dim);
          }
      }
  });
})