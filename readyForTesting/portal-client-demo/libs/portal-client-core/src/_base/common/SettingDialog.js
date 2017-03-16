define([
    './SettingFormGenerator',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./templates/SettingDialog.template.html",
    "dijit/Dialog",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/Form",
    "dojo/_base/array"
],function( SettingFormGenerator,
            declare,
            _WidgetBase,
            _TemplatedMixin,
            _WidgetsInTemplateMixin,
            _Container,
            template,
            Dialog,
            TextBox,
            Button,
            Form,
            array
){
    return declare( [_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,_Container], {
        declaredClass:'SettingDialog',

        templateString: template,
        // dataSchema or dataForm have one at least,will check dataForm if not  generate form from dataSchema
        dataSchema:null,
        dataForm:null,
        onSubmit:function(data){
          //need to be implement
        },
        postCreate:function(){
            if(this.dataForm){
                this.contentForm =new this.dataForm({baseClass:'setting-form'},this.contentForm);
            }else{
                this.contentForm =SettingFormGenerator.generate(this.dataSchema,this.contentForm);
            }
            this.dialog.set('title',this.title || 'Settings');
        },
        _setDataAttr:function(data){
            this.reset();
            this.contentForm.setValues(data);
        },
        show:function(){
            this.dialog.show();
        },
        hide:function(){
            this.dialog.hide();
        },
        ok:function(){
            if(this.contentForm.validate()){
                var data=this.contentForm.getValues();
                console.debug('setting values:',data);
                this.dialog.hide();
                this.onSubmit(data);
            }
        },
        reset:function(){
            this.contentForm.reset();
        }
    });

});
