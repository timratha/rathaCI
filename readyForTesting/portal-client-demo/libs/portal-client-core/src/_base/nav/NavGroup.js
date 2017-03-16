define(['dijit/_Container',
    'dojo/on',
    'dojo/query',
    '../common/PortalHashHelper',
    'dojo/dom-class',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/NavMenu.template.html',
],function(Container, on, query, PortalHashHelper, domClass, TemplatedMixin, WidgetBase, declare,template){
    return declare([WidgetBase,TemplatedMixin,Container],{
        declaredClass:'NavGroup',
        groupName:'',
        templateString:template
    });
})