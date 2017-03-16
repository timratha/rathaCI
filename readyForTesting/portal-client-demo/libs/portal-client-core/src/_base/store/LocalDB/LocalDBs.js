define(['dojo/_base/declare',
    'dstore/Memory',
    'dstore/LocalDB'],function(declare, Memory, LocalDB){
    var dbConfig = {
        version: 5,
        name:'portal-client-core',
        stores: {
            instanceCache: {
                id: {
                    indexed: true,
                    preference: 100
                },
                data: {
                    indexed: false
                }
            }
        }
    };

    LocalDB = new declare([LocalDB],{
        constructor:function(){
            var _t=this;
            this.db.otherwise(function(e){
                console.warn('create localDB failed, use memory instead',e);
                return _t.db = new Memory();
            })
        },
        _callOnStore:function(method, args, index, returnRequest) {
            var _t=this;
            if(_t.db instanceof Memory){
                return _t.db[method].apply(_t.db,args)  //TODO not support like : open cursor.
            }else{
                return _t.inherited(arguments);
            }

        }
    });


    return  {
        instanceCache: new LocalDB({dbConfig: dbConfig, storeName: 'instanceCache'})
    };
})