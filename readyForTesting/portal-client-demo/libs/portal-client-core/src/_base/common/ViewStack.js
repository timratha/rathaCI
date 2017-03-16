define([
    '../../views/NotFoundView',
    '../viewWrappers/ViewWrapper',
    'dojo/_base/array',
    'dijit/layout/StackContainer',
    'dojo/_base/declare',
    './ViewCacheQueue'
],function(NotFoundView, ViewWrapper, array, StackContainer, declare,ViewCacheQueue){

    return  declare([StackContainer],{
        declaredClass:'ViewStack',
        baseClass:'ViewStack',
        postCreate:function(){
            this.inherited(arguments);
        },
        _initNotFoundView:function(){
            this.addChild(new ViewWrapper({
                key:'notFound',
                autoSave:false, //no backend
                model:{
                    viewType:NotFoundView,
                    config:{
                        viewKey:''
                    }
                }
            }));
        },
        select:function(key){
            var _t=this;
            var view=this.getView(key);
            if(!view){
                if(!this.getView('notFound')){
                    this._initNotFoundView(); // TODO consider lazy load as other view.
                }
                view = this.getView('notFound');
                view.setConfig({
                    //here for only client side model use set config ok. will never save to server side.
                    viewKey:key || 'unknown'
                });
            }
            //console.debug('select view :',view.key);
            this.selectChild(view,true); //TODO animation
            if(view.compareQuery && !view.compareQuery()){
                view.model && view.removeInstance(); //TODO check if still need to check model.
            }
            ViewCacheQueue.add(view);
        },
        getView:function(key){
            var _t=this;
            return array.filter(_t.getChildren(),function(view){
                return view.key == key;
            })[0];
        }
    });
})