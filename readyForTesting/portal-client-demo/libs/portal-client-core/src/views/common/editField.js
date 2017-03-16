define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/editField.template.html',
    'dijit/form/TextBox',
    'dijit/_Container',
    'dojo/dom-style',
    'dojo/on'
], function (
    WidgetsInTemplateMixin
    ,TemplatedMixin
    ,WidgetBase
    ,declare
    ,template
    ,TextBox
    ,_Container
    ,domStyle
    ,on
) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,_Container], {
        templateString: template,
        label:'',
        editor:TextBox,
        editable:true,
        editorParams:{
        },
        postCreate:function(){
            this._reCreate();
        },
        _setValueAttr:function(val){
            this.editor_field.set('value',val);
        },
        _getValueAttr:function(val){
            this.editor_field.get('value');
        },
        _reCreate:function(){
            var _t=this;
            if(this.editor_field){
                this.editor_field.destroyRecursive();
            }

            this.editor_field = new this.editor(this.editorParams);
            this.editor_field.placeAt(this.editor_field_node);
            this.editor_field.set('readOnly',true);
/*            if(!this.editable){
                domStyle.set(this.edit_btn,{display:'none'});
            }else{
                domStyle.set(this.edit_btn,{display:'block'});
            };*/
            var _t=this;
         //   on(this.edit_btn,'click',function(){
                _t.editor_field.set('readOnly',false);
            //    domStyle.set(_t.edit_btn,{display:'none'});
                _t.emit('enable_edit',{field:_t});
          //  });
        },
        reset:function(){
            this._reCreate();
        }
    });
});
