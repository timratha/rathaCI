define([
    'dojo/dom-style',
    'dijit/_Container',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/dom-class',
    'dojo/_base/array',
    'dijit/MenuSeparator',
    '../common/PortalHashHelper',
    'dojo/window',
    'dojo/hash',
    'dojo/io-query',
    'dojo/topic',
    '../store/PortalStore',
    'dijit/MenuItem',
    'dijit/Menu',
    'dojo/_base/declare',
    'dijit/MenuBarItem'],function(domStyle, Container, TemplatedMixin, WidgetBase, domClass, array, MenuSeparator, PortalHashHelper,window, hash, ioQuery, topic, PortalStore,MenuItem, Menu, declare, MenuBarItem){

    var Badge  = declare([WidgetBase, TemplatedMixin],{
        templateString:'<div class="badge"><span data-dojo-attach-point="numberNode"></span></div>',
        number:-1,
        _setNumberAttr:function(num){
            if(!num || num<=0){
                domStyle.set(this.domNode,'display','none');
            }else{
                domStyle.set(this.domNode,'display','');
            }
            this.number=num;
            this.numberNode.innerHTML=num > 99 ? 99:num;
        }
    });

    return declare([MenuBarItem,Container],{
        declaredClass:'MessageShortCut',
        label:'<i class="shutCutIcon fa fa-envelope-o"></i>',
        postCreate:function(){
            this.inherited(arguments);
            domClass.add(this.domNode,'shortCut');
            this.badge=new Badge();
            this.addChild(this.badge);
            var _t=this;
            PortalStore.messages.on('newMessages',function(messages){
                _t.badge.set('number',messages.length);
            })
        },
        onClick:function(){
            PortalHashHelper.switchTo('userspace','messagingSystem');
        }
    })
});