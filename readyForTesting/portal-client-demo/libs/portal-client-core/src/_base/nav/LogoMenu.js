define([
    'dojo/dom-class',
    'dijit/_Container',
    'dijit/MenuBarItem',
    'dojo/dom-style',
    'dojo/text!./templates/KistersLogo.template.html',
    'dojo/dom-geometry',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'xstyle/css!./css/KistersLogo.css',
    'xstyle/css!./css/LogoMenu.css'
],function(domClass, Container, MenuBarItem, domStyle, KistersLogoTemplate, domGeometry, declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase){

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
        templateString:KistersLogoTemplate
    });

})