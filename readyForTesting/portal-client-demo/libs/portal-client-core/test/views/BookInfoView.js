define([
    'dojo/_base/declare',
    'dojo/text!./templates/BookInfoView.template.html',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase'
], function (declare, template, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        name: '',
        author: '',
        templateString: template
    });
})