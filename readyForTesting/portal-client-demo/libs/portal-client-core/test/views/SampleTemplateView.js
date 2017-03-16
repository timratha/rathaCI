define(['dojo/_base/declare',
    'portal/views/TemplateView',
    'dojo/text!./templates/SampleTemplateView.template.html',
    'xstyle/css!./css/SampleTemplateView.css'
],function(declare, TemplateView,template){

    return  declare([TemplateView],{
        templateString:template
    });
})