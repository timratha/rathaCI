define(['dojo/Deferred'],function(Deferred){
    return {
        require:function(type){
            var ready = new Deferred();
            if(type == undefined){
                console.error('unable to load type ',type);
                ready.reject('unable to load type:'+type)
            }
            try{
                if(typeof type == 'string'){
                    //console.debug('require type',type);

                    var errorListener = require.on('error',function(e){
                        var info = e.info[0];

                        if( info
                            &&
                            (
                                info == require.toUrl(type)+'.js'  ||
                                info == require.toUrl(type)+'/main.js'
                            )
                        ){
                            ready.reject('unable to load type:'+type);
                            errorListener.remove();
                        }
                    });

                    require([type],function(clazz){
                        errorListener.remove();
                        ready.resolve(clazz);
                    });
                }else{
                    ready.resolve(type);
                }
            }catch(err){
                ready.reject('unable to load type:'+type);
            }
            return ready.promise;
        }
    }
})