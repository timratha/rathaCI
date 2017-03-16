// summary:
//      set model, or fetch model.
// instance requirement:
//     configSchema or configForm:
//          summary:
//              [optional] provide information for instance setting
//          returns:
//              list of action options or action (TitleAction)
//TODO support store , listen the change of model
define([
    'dojo/when',
    'dojo/_base/lang',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    '../common/ModelWrapper',
    '../common/RequirePromise',
    '../common/Loader',
    '../common/Util'
],function(when, lang, TemplatedMixin, WidgetBase, declare,ModelWrapper,RequirePromise,Loader,Util
){

    return declare([],{
        autoSave:true,

        autoLoad:true, //if set false, need load manually  or  load when show event.

        //property name get id for model,some time avoid use id directly.
        //tag: protect
        _idProperty:'id',

        postCreate:function(){
            this.inherited(arguments);
            this._initListeners();
        },

        // store for update and get
        getStore:function(){
            throw 'need implement';
        },

        load:function(){
            var _t=this;
            this.set('instance',new Loader());
            return this._loadPromise = this._loadPromise && !this._loadPromise.isFulfilled() ? this._loadPromise : this.loadModel().then(function(model){
                console.debug('loaded model',model);
                _t.set('model',model);
            },function(err){
                _t.error(err);
            });
        },
        loadModel:function(){
            var id = this[this._idProperty];
            if(!id){
                throw 'have not id, can not load model'
            }
            console.debug('load model',id);
            return this.getStore().get(id);
        },
        saveModel:function(){
            console.debug('save model',this.model);
            return this.model.id ? this.getStore().put(this.model,{owner:this}):when(true);//just update, don't create
        },
        setConfig:function(config){
            this.inherited(arguments);
            if(this.autoSave){
                this.saveModel();
            }
        },
        startup:function(){
            this.inherited(arguments);
            if(!this.model && this.autoLoad){
                console.debug('have not model, load automatically');
                this.load();
            }
        },
        onShow:function(){
            if(!this.model){
                this.load();//try to load when show.
            }
        },
        destroy:function(){
            if(this._loadPromise){
                this._loadPromise.cancel('destroy');
            }
            this.inherited(arguments);
        },
        _initListeners:function(){
            var _t=this;
            this.getStore().on('update',function(e){
                var model=e.target;
                if(_t.model && _t.model.id == model.id && e.owner != _t){// just update which loaded
                    console.debug('automatic update instance when widget updated',model.id);
                    _t.set('model',lang.clone(model));//to keep different ref
                }
            });
        }
    });
});