define([
    'dijit/Viewport',
    'dojo/dom-geometry',
    'dojo/window',
    './MessageBar',
    'dojo/topic',
    'dojox/widget/Toaster',
    'dojo/dom-construct',
    'dojo/_base/declare',
    "dojo/_base/array",
    'xstyle/css!dojox/widget/Toaster/Toaster.css',
    'xstyle/css!./css/NotificationCenter.css'
], function (Viewport, domGeometry, window, MessageBar, topic, Toaster, domConstruct, declare,
                       array
) {

    var msgBar = new declare([MessageBar],{
        style:"position:absolute;z-index:99999;width:400px;",
        resize:function(){
            var view = window.getBox();
            var dim = domGeometry.getMarginBox(this.domNode);
            domGeometry.setMarginBox(this.domNode,{
                l:(view.w-dim.w)/2
            });
        },
        removeChild:function(){
            this.inherited(arguments);
            this.resize();
        }
    })();
    msgBar.placeAt(document.body,0);
    Viewport.on('resize',function(){
        msgBar.resize();
    })

    topic.subscribe("portal/systemMessage", function(e){
            if(e.type=='error'){
                console.error(e.err || e);
            }
            if(!e.seconds){
                if(e.type =='success' || e.type == 'message'){
                    e.seconds = 2000;
                }else if(e.type =='warn'){
                    e.seconds = 5000;
                }else {
                    e.seconds = -1;//close manually
                }
            }

            msgBar.addMsg( e.type,e.content, e.seconds);
            msgBar.resize();
    });
});
