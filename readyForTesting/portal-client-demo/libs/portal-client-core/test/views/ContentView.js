define(['dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase'],function(declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase){

  return  declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
      templateString:'<div>${content}</div>',
      getConfigSchema:function(){
          return [
              {
                  name: "content",
                  label: 'Content',
                  type: 'string',
                  help: "Set the content "
              }
          ]
      }
  });
})