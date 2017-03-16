define(['dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/declare'],function(lang, array, declare){
    return declare([],{
        //MARK column start with 0
        //fix bug for GridContainer support column
        hasResizableColumns:false,
        addChild:function(w,col,p){
            this.inherited(arguments,[ w,col == undefined ? w.column : col ,p]);
        },
        _organizeChildrenManually: function (){
            // bug patch
            var children = dojox.layout.GridContainerLite.superclass.getChildren.call(this),
                length = children.length,
                child;
            for(var i = 0; i < length; i++){
                child = children[i];
                try{
                    this._insertChild(child, child.column); //tip: fix the bug on child.column.
                }
                catch(e){
                    console.error("Unable to insert child in GridContainer", e);
                }
            }
        },
        layout: function(){
            //TODO
            var _t = this;
            var _zoneWidth = parseInt(_t._contentBox.w/_t.nbZones);
            //     var _zoneHeight = parseInt(_t._contentBox.h/_t.nbZones);
            array.forEach(this.getChildren(), function(widget){
                if(widget.resize && lang.isFunction(widget.resize)){
                    widget.resize({w:_zoneWidth});
                }
            });
        }
    })
})