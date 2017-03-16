// summary:
//      generate form according schema
// tags:
//      public
// schema:
//      TODO
define([
    'dojo/_base/array',
    './_FormField',
    'dijit/_Container',
    'dijit/form/Form',
    'dojo/_base/declare',
    'xstyle/css!./css/SettingForm.css'],function(array, FormField,Container, Form, declare){
    return {
        generate:function(formSchema,nodeRef){
            var form = new declare([Form,Container],{baseClass:'setting-form'})({},nodeRef);
            array.forEach(formSchema, function (schema) {
                form.addChild(new FormField({schema: schema}));
            });
            return form;
        }
    };
})