//TODO have bug. with animation
define([
    'dojo/aspect',
    'dojo/dom-style',
    'dojo/dom-geometry',
    'dojo/fx',
    'dojo/_base/array',
    'dijit/_base/manager',
    'dojo/_base/declare'
],function(aspect, domStyle, domGeometry, fx, array, manager,declare
){
    // summary:
    //
    return declare([],{

        dockAble:true,

        dockTo:null, // this must be set .

        _buildInActions:function(){
            var _t=this;
            var actions= this.inherited(arguments);
            actions.push({
                icon:'fa fa-minus',
                onClick:function(){
                    _t.dock();
                }
            });
            return actions;
        },

        dock:function(){
            if(!this.docked){
                this.docked=true;
                this.dockTo.addNode(this);
                this.emit('docked');
            }
        },

        restore:function(){
            this.docked=false;
            this.show();
            this.emit('restored');
            this.resize();
        }

    });
});