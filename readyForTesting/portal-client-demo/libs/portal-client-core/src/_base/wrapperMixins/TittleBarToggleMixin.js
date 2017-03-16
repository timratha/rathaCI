define([
    'dojo/on',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/_base/lang',
    '../widgetWrappers/DialogWidgetWrapper',
    'dojo/_base/declare',
    'xstyle/css!./css/TittleBarToggleMixin.css'
],function(on, domConstruct, domClass, lang, DialogWidgetWrapper,declare
){
    // summary:
    //
    return declare([],{

        //action flags
        tittleBarToggleAble:true,

        postCreate:function(){
            this.inherited(arguments);
            domClass.add(this.domNode,'TittleBarToggleMixin');
        },

        _buildInActions:function(){
            var _t=this;
            var actions= this.inherited(arguments);
            if(this.tittleBarToggleAble){
                actions.push({
                    icon: 'fa fa-angle-left',
                    index: 99999,
                    onClick: function () {
                        _t.collapseTitleBar(true);
                    }
                });
            }
            return actions;
        },

        collapseTitleBar:function(flag){
            if(flag){
                this.wrapperTitleBar.hide();
                this._titleBarToggle = domConstruct.toDom('<div class="collapseToggle"><i class="fa fa-chevron-circle-right"></i></div>');
                domConstruct.place(this._titleBarToggle,this.domNode);
                this.resize();
                var _t=this;
                on(this._titleBarToggle,'click',function(){
                    _t.collapseTitleBar(false);
                })
            }else{
                domConstruct.destroy(this._titleBarToggle);
                this._titleBarToggle=null;
                this.wrapperTitleBar.show();
                this.resize();
            }
            this.emit('collapseTitle',flag);
        }
    });
});