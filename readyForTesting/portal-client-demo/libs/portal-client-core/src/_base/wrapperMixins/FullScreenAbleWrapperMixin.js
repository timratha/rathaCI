define([
    'dojo/_base/lang',
    '../widgetWrappers/DialogWidgetWrapper',
    'dojo/_base/declare'
],function(lang, DialogWidgetWrapper,declare
){
    // summary:
    //
    return declare([],{

        //action flags
        fullScreenAble:true,

        _buildInActions:function(){
            var _t=this;
            var actions= this.inherited(arguments);
            if(this.fullScreenAble){
                actions.push({
                    icon:'fa fa-expand',
                    onClick:function(){
                        _t.fullScreen();
                    }
                });
            }
            return actions;
        },

        fullScreen:function(){
            var _t=this;

            var options={
                widgetId:this.widgetId,
                model:this.model, // at begin , we need clone it for compare when update ui. but now, we use owner to stop update current wrapper.
                onHide:function(){
                    _t.update(); // ensure update the origin one?(especial model without id which will not sync by store event).
                }
            };
            if(this.instance.dialogSize){
                options.style="width:"+this.instance.dialogSize.w+";height:"+this.instance.dialogSize.h //TODO consider
            }else{
                options.style="width:90%;height:80%";
            }
            console.debug(this.instance.domNode.clientHeight,this.instance.domNode.clientWidth);

            var dw = new DialogWidgetWrapper(options);
            dw.startup();
            dw.show();

            // consider udpate origin one, when hide dialog
            //
            // 23.11.2015 16:35 changed by Gufron to destroy instance after dialog is closed
            dw.on("Hide", function () {
                dw.destroyRecursive();
            });
        }
    });
});