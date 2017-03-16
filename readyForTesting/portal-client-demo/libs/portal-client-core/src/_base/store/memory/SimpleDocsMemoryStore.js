define([
    'dstore/Memory',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable'
], function(Memory, declare, Rest, Trackable) {

    return declare([],{
        constructor:function(args){
            this.configs=new declare([Memory,Trackable])({
            });
            this.templates=new declare([Rest,Trackable])({
            });
            this.docs=new declare([Memory,Trackable])({
            });
        }
    })
});