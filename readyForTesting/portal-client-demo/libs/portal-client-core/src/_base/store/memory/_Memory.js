/*
* dstore/memory will return the same object ref when get by different place. this will make some problem when update.
* */
define([
    'dojo/_base/lang',
    'dojo/_base/declare',
    "dstore/Memory"
],function(lang, declare, Memory){

    return declare([Memory],{
        getSync: function (id) {
            return lang.clone(this.inherited(arguments));
        },
        fetchSync:function(){
            return lang.clone(this.inherited(arguments));
        },
        putSync: function (object, options) {
            object = lang.clone(object);
            object.editTime=new Date();//update editTime
            object.id?0:object.creationTime=new Date().toLocaleDateString();//set creationTime if create

            options = options || {};

            var storage = this.storage,
                index = storage.index,
                data = storage.fullData;

            var Model = this.Model;
            if (Model && !(object instanceof Model)) {
                object = this._restore(object);
            }
            var id = this.getIdentity(object);
            if (id == null) {
                this._setIdentity(object, ('id' in options) ? options.id : Math.random());
                id = this.getIdentity(object);
            }
            storage.version++;

            var eventType = id in index ? 'update' : 'add',
                event = { target: object },
                previousIndex,
                defaultDestination;
            if (eventType === 'update') {
                if (options.overwrite === false) {
                    throw new Error('Object already exists');
                } else {
                    data.splice(previousIndex = index[id], 1);
                    defaultDestination = previousIndex;
                }
            } else {
                defaultDestination = this.defaultNewToStart ? 0 : data.length;
            }

            var destination;
            if ('beforeId' in options) {
                var beforeId = options.beforeId;

                if (beforeId === null) {
                    destination = data.length;
                } else {
                    destination = index[beforeId];

                    // Account for the removed item
                    if (previousIndex < destination) {
                        --destination;
                    }
                }

                if (destination !== undefined) {
                    event.beforeId = beforeId;
                } else {
                    console.error('options.beforeId was specified but no corresponding index was found');
                    destination = defaultDestination;
                }
            } else {
                destination = defaultDestination;
            }
            data.splice(destination, 0, object);

            var i = isFinite(previousIndex) ? Math.min(previousIndex, destination) : destination;
            for (var l = data.length; i < l; ++i) {
                index[this.getIdentity(data[i])] = i;
            }

            event.owner= options.owner ; // add owner
            this.emit(eventType, event);

            return object;
        }
    })

})