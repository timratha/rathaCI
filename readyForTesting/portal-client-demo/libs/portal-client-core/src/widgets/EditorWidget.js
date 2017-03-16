define([
    'dojo/dom-construct',
    'dojo/_base/declare',
    'dijit/Editor',
    'dijit/_editor/plugins/AlwaysShowToolbar',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/text!./templates/EditorWidget.html'

], function (domConstruct, declare, Editor, AlwaysShowToolbar,_TemplatedMixin,_WidgetBase,template) {
    return declare([_WidgetBase,_TemplatedMixin], {
        templateString:template,
        baseClass: "editor",
        declaredClass:"editorWidget",
        editMode:false,
        _editor:null,
        _content:"",
        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        startup: function () {
            this.inherited(arguments);
        },
        switchEditMode: function () {
            //console.log(this.editMode)
            this.editMode =!this.editMode;
            if(this.editMode){
                domConstruct.empty(this.content)
                this._editor=  new Editor({extraPlugins: [AlwaysShowToolbar],value:this._content,height:"400px"},this.divEditor)
                this._editor.startup();

            }else{
                if(this._editor){
                    this._content =this._editor.get("value")
                    domConstruct.place(this._content,this.content)
                    this._editor.destroyRecursive(true)
                }
            }
        },
        getActions:function(){
            var _t = this;
            return [
                {
                    title:"edit mode",
                    icon:"fa fa-edit",
                    onClick:function(){
                         _t.switchEditMode()
                    }
                }
            ]
        },
        getConfigSchema:function() {
            return [
                {
                    name: 'label',
                    type: 'string',
                    help: "Set the title for the widget",
                    label: "title",
                    defaultValue: this.label
                }
            ]
        },
        resize: function () {
            this.inherited(arguments);

        }
    });

});