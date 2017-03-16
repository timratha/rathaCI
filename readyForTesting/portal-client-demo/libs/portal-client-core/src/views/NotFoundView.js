define([
    'dojo/string',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    "dojo/i18n!./nls/NotFoundView",
    'dijit/_WidgetBase','xstyle/css!./css/NotFoundView.css'],function(string, declare, WidgetsInTemplateMixin, TemplatedMixin, nls,WidgetBase){

    return  declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
        templateString:'<div class="NotFoundView"><h2 class="message">${msg}</h2></div>',
        declaredClass:'NotFoundView',

        buildRendering:function(){
            this.msg = string.substitute(nls.notFoundMsg,this);
            this.inherited(arguments);
        }
    });
})