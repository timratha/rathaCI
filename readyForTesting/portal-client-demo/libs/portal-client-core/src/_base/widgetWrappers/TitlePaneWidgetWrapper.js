define([
    'dojo/fx',
    'dijit/_base/manager',
    'dijit/_TemplatedMixin',
    'dijit/layout/ContentPane',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/_base/array',
    'dojo/dom-class',
    'dojo/on',
    'dojo/_base/declare',
    './WidgetConfigurableMixin',
    "dijit/TitlePane",
    "dojo/text!./templates/TitlePaneWidgetWrapper.template.html",
    "./DialogWidgetWrapper",
    "../store/PortalStore",
    './WidgetWrapper'
], function (fx, manager, TemplatedMixin, ContentPane, domConstruct, domStyle, array, domClass, on, declare,
    WidgetConfigurableMixin,
    TitlePane,
    template,
    DialogWidgetWrapper,
    PortalStore,
    WidgetWrapper
) {
    return declare([WidgetWrapper], {
        templateString: template,
        open: true,
        toggleable: true,
        duration: manager.defaultDuration,
        fullScreenAble:true,
        //tabIndex: "0",


        postCreate: function(){
            this.inherited(arguments);
            var hideNode = this.hideNode, wipeNode = this.wipeNode;
            this._wipeIn = fx.wipeIn({
                node: wipeNode,
                duration: this.duration,
                beforeBegin: function(){
                    hideNode.style.display = "";
                }
            });
            this._wipeOut = fx.wipeOut({
                node: wipeNode,
                duration: this.duration,
                onEnd: function(){
                    hideNode.style.display = "none";
                }
            });
        },
        _setOpenAttr: function(/*Boolean*/ open){
            array.forEach([this._wipeIn, this._wipeOut], function(animation){
                if(animation && animation.status() == "playing"){
                    animation.stop();
                }
            });
            var anim = this[open ? "_wipeIn" : "_wipeOut"];
            if(anim){
                anim.play();
            }
            this._set("open", open);
            if(this._started){
                var ac=this.wrapperTitleBar.getAction('toggle-title-bar');
                if(!this.open){
                    this.setTitleFull(true);
                    if(ac){
                        ac.hide();
                    }
                }else{
                    if(ac){
                        ac.show();
                    }
                }
            }
        },
        toggle: function(){
            this.set('open',!this.open);
        },
        _buildInActions:function(){
            var _t=this;
            var actions= this.inherited(arguments);
            actions.push({
                icon:'fa fa-minus',
                onClick:function(){
                    _t.toggle();
                    this.set('icon',_t.open?'fa fa-minus':'fa fa-plus');
                }
            });
            return actions;
        }
    });
});
