define([
    'dojo/string',
    'dojo/_base/declare'
],function(string, declare
){
    // summary:
    //
    return declare([],{

        _setInstanceAttr:function(){
            this.inherited(arguments);
            var _t=this;
            this.set('title',string.substitute(this.get('title'),this.get('instance')));
        }
    });
});