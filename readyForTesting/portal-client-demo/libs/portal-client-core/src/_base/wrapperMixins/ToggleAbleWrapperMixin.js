//TODO have bug. with animation
define([
    'dojo/aspect',
    'dojo/dom-style',
    'dojo/dom-geometry',
    'dojo/fx',
    'dojo/_base/array',
    'dijit/_base/manager',
    '../title-bar/TitleAction',
    'dojo/_base/declare'
],function(aspect, domStyle, domGeometry, fx, array, manager,TitleAction,declare
){
    // summary:
    //
    return declare([],{

        toggleAble:true,
        open:true,
        duration:manager.defaultDuration,
        _originStyle:null,

        buildRendering:function(){
            this.inherited(arguments);
            this.createToggleAction();
        },
        postCreate: function(){
            this.inherited(arguments);
            this._initAnim();
        },
        _initAnim:function(){
            var hideNode = this.containerNode
            this._wipeIn = fx.wipeIn({
                node: hideNode,
                duration: this.duration
            });
            this._wipeOut = fx.wipeOut({
                node: hideNode,
                duration: this.duration
            });

            var fini = function(){
                hideNode.style.height = "100%"; //reset height to 100%, fix : not work by onEnd
            };

            aspect.after(this._wipeIn, "onStop", fini, true);
            aspect.after(this._wipeIn, "onEnd", fini, true);
            aspect.after(this._wipeOut, "onStop", fini, true);
            aspect.after(this._wipeOut, "onEnd", fini, true);
        },
        createToggleAction:function(){
            var _t=this;
            this._toggleAction = new TitleAction({
                icon:'fa fa-minus',
                onClick:function(){
                    _t.toggle();
                },
                refresh:function(){
                    this.set('icon',_t.open?'fa fa-minus':'fa fa-plus');
                }
            })
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
            this.open=open;
            this._toggleAction.refresh();
        },
        _buildInActions:function(){
            var _t=this;
            var actions= this.inherited(arguments);
            actions.push(this._toggleAction);
            return actions;
        },
        toggle:function(){
            this.set('open',!this.open);
            this._toggleAction.refresh();
            this.emit('toggle');
        }
    });
});