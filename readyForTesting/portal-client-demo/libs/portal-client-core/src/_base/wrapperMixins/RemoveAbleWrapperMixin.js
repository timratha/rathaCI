define([
    'dijit/_base/manager',
    'dojo/_base/declare'
],function(manager,declare
){
    // summary:
    //
    return declare([],{

        //action flags
        removeAble:true,
        // function need if removeAble
        removeFromParent:null,

        _buildInActions:function(){
            var actions=this.inherited(arguments);
            var _t=this;
            if(this.removeAble){
                actions.push({
                    icon:'fa fa-close',
                    index:11,
                    onClick:function(){
                        _t.removeFromParent();
                    }
                });
            }
            return actions;
        }
    });
});