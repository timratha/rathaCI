define(['dojo/_base/lang',
    'dojo/date/locale',
    'dojo/dom-class',
    'dojo/on',
    'dijit/_WidgetBase',
    'dojo/date',
    'dijit/Calendar',
    'dojo/_base/declare',
    "dijit/popup"], function(lang, locale, domClass, on, WidgetBase, date, Calendar, declare, popup){
    return declare([WidgetBase],{
        calenderOptions:null,
        declaredClass:'CalendarPopup',

        inputFormatOptions:{
            selector:'date',
            datePattern:'yyyy-MM-dd'
        },
        startup:function(){
            this.inherited(arguments);
            var _t=this;
            on(_t.domNode,'focus',function(){
                _t.open();
            });
            //TODO how to handle when mouse move out of dropDown
        },
        open:function(){
            var _t=this;
            if(this.dropDown){
                this.dropDown.destroy();
            }
            var dropDown = this.dropDown = new Calendar(lang.mixin({
                value:Date.parse(_t.domNode.value)
            },_t.calenderOptions));
            popup.moveOffScreen(dropDown);

            if(dropDown.startup && !dropDown._started){
                dropDown.startup();
            }

            popup.open({
                parent: this,
                popup: this.dropDown,
                around: this.domNode,
                orient: ["below-centered", "above-centered"],
                onExecute: function(){
                    //console.log(_t.dropDown.get('value'));
                    _t.domNode.value=locale.format(_t.dropDown.get('value'),_t.inputFormatOptions);
                    _t.domNode.onchange();//TODO may have bug
                    popup.close(_t.dropDown);
                },
                onCancel: function(){
                    popup.close(_t.dropDown);
                },
                onClose: function(){
                }
            });
        },
        close:function(){
            popup.close(this.dropDown);
        }


    })

});
