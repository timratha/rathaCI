define([
    'dojo/on',
    'dojo/_base/declare'
],function(on, declare
){
    //TODO about jsdoc, provide event information from mixin.
    // summary:
    return declare([],{

        _setInstanceAttr:function(){
            this.inherited(arguments);
            var _t=this;
            //TODO check if need remove listeners when remove instance.
            this.own(on(this.instance,'resize',function(){
                // just resize. no need to support resize with size, size always control by outside
                if(!this.__resizing){ //ensure not cause circle issue by mistake;
                    _t.resize();
                }else{
                    console.warn('already in resize process');
                }
            }))
        },

        resize:function(){
            this.__resizing=true;
            this.inherited(arguments);
            this.__resizing=false;
        }


    });
});