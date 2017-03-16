define([
    'dijit/form/Textarea',
    'dijit/form/Select',
    'dijit/form/CheckBox',
    'dijit/Tooltip',
    'dijit/form/TimeTextBox',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./templates/formField.templates.html",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/Form",
    "dojo/_base/array",
    "dijit/form/NumberTextBox",
    "dijit/form/DateTextBox"
],function(Textarea, Select,CheckBox, Tooltip, TimeTextBox, declare,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _Container,
    template,
    TextBox,
    Button,
    Form,
    array,
    NumberTextBox,
    DateTextBox
){
    var typeHandler={
        // use same object to avoid create duplicate object for each formField instance
        'string':function(schema){
           return new TextBox({
               name:schema.name,
               title:'string',
               constraints:schema.constraints,
               value:schema.defaultValue
           });
        },
        'textarea':function(schema){

            return new Textarea({
                name:schema.name,
                style:"white-space: nowrap;",
                title:'Textarea',
                constraints:schema.constraints,
                value:schema.defaultValue
            });
        },
        'checkbox':function(schema){

            return new CheckBox({
                name:schema.name,
                checked:schema.defaultValue,
                value:schema.defaultValue
            });
        },
        'number':function(schema){
            return new NumberTextBox({
                name:schema.name,
                constraints:schema.constraints,
                value:schema.defaultValue
            })
        },
        'date':function(schema){
            return new DateTextBox({
                name:schema.name,
                constraints:schema.constraints,
                value:schema.defaultValue
            })
        },
        'time':function(schema){
            return new TimeTextBox({
                name:schema.name,
                constraints:schema.constraints,
                value:schema.defaultValue
            })
        },
        'selector':function(schema){
            return new Select({
                name:schema.name,
                options:schema.options,
                value:schema.defaultValue
            })
        },
        'json':function(schema){
            if(typeof schema.defaultValue=="object"){
                schema.defaultValue=JSON.stringify(schema.defaultValue,null, 4)
            }
            return new Textarea({
                name:schema.name,
                style:"white-space: nowrap;width:500px;",
                title:'Textarea',
                constraints:schema.constraints,
                value:schema.defaultValue
            });
        }
    };

    return declare( [_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container],{
        templateString:template,
        schema:{}, // need be set
        postMixInProperties:function(){
            this.label=this.schema.label || this.schema.name  ;
            this.schema.constraints = this.schema.constraints ||{}
        },
        postCreate:function(){
            var handler= typeHandler[this.schema.type.toLowerCase()];
            var w= handler(this.schema);
            w.placeAt(this.fieldWidget).startup();
            if(this.schema.help){
                new Tooltip({
                    connectId: [w.domNode],
                    label: this.schema.help
                });
            }
        }
    });

});