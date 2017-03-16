define(['dojo/Evented',
    './Util',
    'dojo/_base/array',
    'dojo/query',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/NodeList-traverse'], function(Evented, Util, array, query, lang, topic){
    // use TopicScope class to identify the scope

    //TODO maybe we can define some more advanced scope concept in future.

    var hub = new Evented;

    //TODO may have bug. need check more.
    lang.mixin(topic,{

        publish: function(topic, event,scopeOptions){
            return hub.emit.apply(hub, arguments);
        },

        subscribe: function(topic, listener,subScopeOptions){
            var _t=this;
            var listener2 = function(event,pubScopeOptions){
                if(subScopeOptions && subScopeOptions.source){
                    if(pubScopeOptions && pubScopeOptions.source){
                        if(_t.isInSameScope(subScopeOptions.source,pubScopeOptions.source)){
                            listener.apply(this,arguments);
                        }
                    }
                }else{
                    listener.apply(this,arguments);
                }
            };
            return hub.on.apply(hub, [topic, listener2]);
        },

        isInSameScope:function(source1,source2){
            return query(source1.domNode).parents('.TopicScope')[0] ==  query(source2.domNode).parents('.TopicScope')[0]
        }
    })
});
