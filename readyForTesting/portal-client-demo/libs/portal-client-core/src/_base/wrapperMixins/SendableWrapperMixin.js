
define([
    'dojo/_base/declare',
    '../title-bar/SendToAction',
    '../store/PortalStore'
],function(declare,SendToAction,PortalStore
){
    // summary:
    //
    return declare([],{
        sendAble:true,
        _buildInActions:function(){
            var _t=this;
            var actions= this.inherited(arguments);
            if(this.sendAble && PortalStore.users.checkPermission('core.config.widget.dashboard')){
                actions.push( new SendToAction({
                    getModel:function(){
                        return _t.model;
                    }
                }));
            }
            return actions;
        }
    });
});