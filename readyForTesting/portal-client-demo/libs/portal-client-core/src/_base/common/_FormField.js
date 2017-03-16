define([
    'dojo/json',
    '../../controllers/TimezoneSelector',
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
],function(json, TimezoneSelector,Textarea, Select,CheckBox, Tooltip, TimeTextBox, declare,
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
        'widget':function(schema){
            return new schema.widget({
                name:schema.name,
                title:'widget',
                constraints:schema.constraints,
                value:schema.defaultValue
            });
        },
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
                constraints:schema.constraints,
                value:schema.defaultValue
            });
        },
        'boolean':function(schema){
            // fake Checkbox that only returns true/false instead of array, like other checkboxes
            return new CheckBox({
                name:schema.name,
                checked:schema.defaultValue,
                value:schema.defaultValue,
                declaredClass:"Radio"
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
            return new declare([Textarea],{
                multiple:true, // accept array
                _setValueAttr:function(value){
                    value = typeof value == 'string' ? value : json.stringify(value, null, '\t')
                    this.inherited(arguments,[value]);
                },
                _getValueAttr: function () {
                    var value = this.inherited(arguments);
                    return json.parse(value ? value : "{}");
                }
            })({
                name:schema.name,
                style:"white-space: nowrap;width:500px;",
                constraints:schema.constraints,
                value:schema.defaultValue
            });
        },
        'timezone':function(schema){
            if(typeof schema.defaultValue=="object"){
                schema.defaultValue=json.stringify(schema.defaultValue,null, 4)
            }
            return new TimezoneSelector({
                name:schema.name,
                value:schema.defaultValue
            });
        }
    };

    return declare( [_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container],{
        templateString:template,
        declaredClass:'FormField',
        schema:{}, // need be set
        postMixInProperties:function(){
            this.label=this.schema.label || this.schema.name  ;
            this.schema.constraints = this.schema.constraints ||{}
        },
        postCreate:function(){
            var handler= typeHandler[this.schema.type.toLowerCase()];
            var w= handler(this.schema);
            w.placeAt(this.fieldWidget);
            w.startup();
            if(this.schema.help){
                new Tooltip({
                    connectId: [w.domNode],
                    label: this.schema.help
                });
            }
        }
    });

});