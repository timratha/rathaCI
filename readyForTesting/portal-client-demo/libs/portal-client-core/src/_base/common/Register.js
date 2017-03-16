/*
* view and widget can be found by viewType or widgetType
* */

define([
    'dojo/Deferred',
    'dojo/_base/declare'
], function (Deferred, declare
) {

    var views={
    };
    var widgets={};

    var layouts={
    };


    return {
       // getter function when not provide clazz
       // setter function when provide clazz
       view:function(type){
           var ready=new Deferred();
           require([type],function(clazz){
               ready.resolve(clazz);
           });
           return ready;
       },
       widget:function(type){
           var ready=new Deferred();
           require([type],function(clazz){
               ready.resolve(clazz);
           });
           return ready;
       },
       layout:function(type,clazz){
           //TODO consider have layout service.

            if(!type){
                return layouts;
            }
            type=type.toLowerCase();
            if(clazz){
                layouts[type]=clazz;
                //console.log('register layout',type);
            }else{
                return layouts[type];
            }
       }

    };
});
