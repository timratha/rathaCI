define(['dijit/Tooltip',
    'dojo/_base/lang',
    'dojo/dom-class',
    'dojo/on',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare'],function(Tooltip, lang, domClass, on, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare){
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
        declaredClass:'TitleAction',

        templateString:'<div class="action" ><i class="action-icon" data-dojo-attach-point="iconNode"></i></div>',
        // index of action , small index will be right on the titleBar
        index:100,
        help:null,//Tooltip when hover.
        onClick:function(){},
        postCreate:function(){
            this.inherited(arguments);
            on(this.domNode,'click',lang.hitch(this,this.onClick));
        },
        _setIconAttr:function(icon){
            domClass.remove(this.iconNode,this.icon);
            this.icon=icon;
            domClass.add(this.iconNode,this.icon);
        },
        show:function(){
            domClass.remove(this.domNode,'hide');
        },
        hide:function(){
            domClass.add(this.domNode,'hide');
        },
        startup:function(){
            this.inherited(arguments);
            if(this.help){
                this.tooltip= new Tooltip({
                    connectId: [this.domNode.id],
                    label: this.help
                });
                this.tooltip.startup();
            }
        }
    })
});