define([
    'dijit/ProgressBar',
    'dijit/form/Button',
    'dijit/form/NumberTextBox',
    'dijit/_Container',
    'dojo/text!./templates/ExampleOptimierung.template.html',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dijit/form/Form'
], function (ProgressBar, Button, NumberTextBox, Container, template, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare,Form) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        version:"0.0.1",
        label:"dummy",
        templateString:template,
        declaredClass:"exampleWidget",
        opt1:"Optimierung 1",
        opt2:"Optimierung 2",
        opt3:"Optimierung 3",
        opt1Url:"http://process4711/start1",
        opt2Url:"http://process4711/start2",
        opt3Url:"http://process4711/start3",
        postCreate:function(){
            this.inherited(arguments);
        },
        click1:function(){
            var _t = this;
            var j=0;
            _t.pg1.set("label","")
            for(var i =0;i<11;i++){
                setTimeout(function(){
                   _t.pg1.set("value",j)

                    if(j==10){
                        setTimeout(function(){
                            _t.pg1.set("label","abgeschlossen!")
                        },1000)
                    }
                    j++;
                },(500*i))

            }

        },
        click2:function(){
            var _t = this;
            var j=0;
            _t.pg2.set("label","")
            for(var i =0;i<11;i++){
                setTimeout(function(){
                    _t.pg2.set("value",j)

                if(j==10){
                    setTimeout(function(){
                        _t.pg2.set("label","abgeschlossen!")
                    },1000)
                }
                    j++;
                },(1000*i))

            }
        },
        click3:function(){
            var _t = this;
            var j=0;
            _t.pg3.set("label","")
            for(var i =0;i<11;i++){
                setTimeout(function(){
                    _t.pg3.set("value",j)
                    j++;
                    if(j==10){
                        setTimeout(function(){
                            _t.pg3.set("label","abgeschlossen!")
                        },1000)
                    }
                    j++;
                },(1500*i))

            }
        },
        getConfigSchema:function() {
            return [
                {
                    name: 'opt1',
                    type: 'string',
                    help: "Name für Optimierung 1",
                    label: "1. Optimierung",
                    defaultValue: this.opt1
                },
                {
                    name: 'opt1Url',
                    type: 'string',
                    help: "Ziel für Optimierung 1",
                    label: "1. Optimierung Ziel",
                    defaultValue: this.opt1Url
                },
                {
                    name: 'opt2',
                    type: 'string',
                    help: "Name für Optimierung 2",
                    label: "2. Optimierung Ziel",
                    defaultValue: this.opt2
                },
                {
                    name: 'opt2Url',
                    type: 'string',
                    help: "Ziel für Optimierung 1",
                    label: "2. Optimierung Ziel",
                    defaultValue: this.opt2Url
                },
                {
                    name: 'opt3',
                    type: 'string',
                    help: "Name für Optimierung 3",
                    label: "3. Optimierung",
                    defaultValue: this.opt3
                },
                {
                    name: 'opt3Url',
                    type: 'string',
                    help: "Ziel für Optimierung 3",
                    label: "3. Optimierung Ziel",
                    defaultValue: this.opt3Url
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
