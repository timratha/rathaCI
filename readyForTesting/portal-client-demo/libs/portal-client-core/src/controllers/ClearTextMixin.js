define([
    'dojo/aspect',
    'dojo/on',
    'dojo/dom-class',
    'dojo/_base/declare',
    'dojo/dom-construct',
    'xstyle/css!./css/ClearTextMixin.css'],function(aspect, on, domClass, declare, domConstruct){
    return declare(null,{
        postCreate:function(){
            this.inherited(arguments);
            domClass.add(this.domNode,'ClearTextMixin');
            this._clearBtn = domConstruct.toDom('<div class="clearBtn"><i class="fa fa-times-circle"/></div>');
            domConstruct.place(this._clearBtn,this.textbox,'after');
            var _t=this;
            var check = function(){
                _t.defer(function(){
                    domClass.toggle(_t._clearBtn,'show',_t.textbox.value);
                });
            };
            on(this,'input',check);
            on(this,'change',check);
            on(this._clearBtn,"click",function(){
                _t.set("value","");
                _t.textbox.focus();
                check();
            });
        },

    })
})