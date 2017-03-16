define(['dojo/when',
    'dojo/Deferred',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dstore/Memory'
],function(when, Deferred, array, declare, Memory){
    return declare([],{
        _widgetStore:null,//to be set.
        constructor:function(args){
            declare.safeMixin(this,args);
        },
        getChildren:function(object){
            array.forEach(object.widgets,function(item){
                item.label = (item.config && item.config.label) || item.label;
            });
            return new Memory({data:object.widgets})
        },
        mayHaveChildren:function(object){
            return !!object.widgets && object.widgets.length>0
        },

        addWidget2Dashboard:function(dashboardId,data){
            var _t=this;
            data.storeType='dashboard';
            return _t.get(dashboardId).then(function(d){
                var maxNum = d.layout.config.maxNum || 100;
                if(d.widgets.length<maxNum){
                    return _t._widgetStore.add(data).then(function(widget){
                        d.widgets.push({
                            id: widget.id,
                            key: widget.key,
                            layoutChildConfig:{}
                        });
                        return _t.put(d);
                    })
                }else{
                    throw new Error('reached max num:'+maxNum);
                }
            });
        },
        getWidgets:function(widgets){
            var _ret = new Deferred();
            var ids = array.map(widgets,function(_w){
                return _w.id;
            });
            if(ids.length>0) {
                _ret = this._widgetStore.getItems(ids,'dashboard');
            }else{
                _ret.resolve([])
            }
            return _ret;
        },
        removeWidget:function(widgetId){
            return this._widgetStore.remove(widgetId);
        }
    })
})