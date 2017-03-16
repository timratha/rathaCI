define(['dojo/topic',
    'dojo/on',
    'dojo/dom-geometry',
    'dojo/_base/declare',
    'dijit/form/Select'],function(topic, on, domGeometry, declare, Select){

    return  declare([Select],{
        topic:topic,
        style:"width: 400px;",
        postCreate:function(){
            this.inherited(arguments);
            var _t=this;
            on(_t,'change',function(){
                topic.publish('image_changed',{ imgPath : _t.get('value')},{
                    source:_t
                });
            });
        },
        resize:function(dim){
            if(dim){
                domGeometry.setMarginBox(this.domNode,{w:dim.w});
            }
        }
    });
})