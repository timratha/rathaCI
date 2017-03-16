define([
    'dijit/_Container',
    'dojo/dom-construct',
    'dojo/_base/array',
    './TitleAction',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/text!./templates/TitleBar.template.html',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'xstyle/css!./css/TitleBar.css'
],function (Container, domConstruct, array, TitleAction,domAttr, domClass, template, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare){

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,Container],{
        declaredClass:'TitleBar',
        templateString:template,
        title:'title',
        titleIcon:'fa fa-square',
        _setTitleAttr:function(title){
            this.title=title;
            this.titleTextNode.innerHTML=title;
        },
        _setTitleIconAttr:function(icon){
            this.titleIcon=icon;
            domAttr.set(this.titleIconNode,'class','title-icon '+icon); //TODO find better way
        },
        addAction:function(action){
            if(!(action.isInstanceOf && action.isInstanceOf(TitleAction))){
                //pass settings.
                action=new TitleAction(action);
            }
            this.addChild(action);
        },
        getAction:function(key){
            return array.filter(this.getChildren(),function(ac){
                return ac.key == key;
            })[0];
        },
        clearActions:function(){
            var _t=this;
            array.forEach(this.getChildren(),function(ac){
                _t.removeChild(ac);
                ac.destroy();
            })
        },
        hide:function(){
            domClass.add(this.domNode,'hide');
        },
        show:function(){
            domClass.remove(this.domNode,'hide');
        }
    })

});