define(['dojo/topic',
    'dojo/dom-attr',
    'dojo/dom-geometry',
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase'],function(topic, domAttr, domGeometry, declare, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase){

    return  declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
        templateString:'<div style="width: 400px;height: 400px;"><img src="" data-dojo-attach-point="imgNode" alt="" style="width: 99%;height: 99%;"/></div>',
        postCreate:function(){
            this.inherited(arguments);
            var _t=this;
            topic.subscribe('image_changed',function(e){
                _t.set('imgPath', e.imgPath);
                _t.emit('update_instance_data',{data:{imgPath:_t.imgPath}});
            },{
                source:_t
            })
        },
        _setImgPathAttr:function(imgPath){
            domAttr.set(this.imgNode,'src',require.toUrl(imgPath));
            this.imgPath=imgPath;
        },
        resize:function(dim){
            if(dim){
                domGeometry.setMarginBox(this.domNode,dim);
            }
        },
        getInstanceData:[
            'imgPath'
        ]
    });
})