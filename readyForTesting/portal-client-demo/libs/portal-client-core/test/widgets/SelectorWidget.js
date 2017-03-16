define(['dojo/on',
    'dojo/dom-geometry',
    'dojo/_base/declare',
    'dijit/form/Select'],function(on, domGeometry, declare, Select){

    return  declare([Select],{
        postCreate:function(){
            this.inherited(arguments);
            var _t=this;
            on(this,'change',function(){
                _t.emit('update_instance_data',{data:{value:_t.value}});
            })
        }
    });
})