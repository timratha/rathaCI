define([
    'dijit/form/NumberTextBox',
    'dijit/_Container',
    'dojo/text!./templates/exampleWidget.template.html',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dijit/form/Form'
], function (NumberTextBox, Container, template, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare,Form) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        version:"0.0.1",
        label:"dummy",
        templateString:template,
        declaredClass:"exampleWidget",
        postCreate:function(){
            this.domNode.innerHTML= "<div>content: "+this.content+"</div><br/>"+
                                    "<div>createTime :"+this.id+"</div><br/>"

        },
        getConfigSchema:function() {
            return [
                {
                    name: 'label',
                    type: 'string',
                    help: "Set the title for the widget",
                    label: "title",
                    defaultValue: this.label
                },
                {
                    name: 'content',
                    type: 'string',
                    defaultValue: "Default content for example Widget"
                }/*,
                 {
                 name:'createTime',
                 type:'Date',
                 defaultValue:new Date()
                 },
                 {
                 name:'contentLength',
                 label:'Content Length',
                 type:'number',
                 constraints:{min:0,max:120},
                 help:'set the length of content',
                 defaultValue:200
                 },
                 {
                 name:'data',
                 type:'json',
                 defaultValue:{}
                 },
                 {
                 name:'timeStamp',
                 type:'time',
                 constraints: {
                 timePattern: 'HH:mm:ss',
                 clickableIncrement: 'T00:20:00',
                 visibleIncrement: 'T00:05:00',
                 visibleRange: 'T01:00:00'
                 }
                 },
                 {
                 name:'agenda',
                 type:'selector',
                 options:[
                 {
                 label:'male',
                 value:0
                 },
                 {
                 label:'female',
                 value:1
                 }
                 ],
                 defaultValue:1
                 }*/
            ]

            // setting with customized form.
            //configForm:declare([Form,Container],{
            //    postCreate:function(){
            //        this.addChild(new NumberTextBox({
            //            name:'contentLength'
            //        }))
            //    }
            //})
        },
        resize: function () {
            this.inherited(arguments);
        }
    });
});
