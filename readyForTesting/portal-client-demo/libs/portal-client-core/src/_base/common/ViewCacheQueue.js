define(['dojo/hash',
    'dojo/_base/array',
    'dojo/_base/declare'],function(hash, array, declare){
    //this cashQueue will destroy the unused view instance inside wrapper when reach limit.
    return new declare([],{
        cacheSize:2,
        _queue:[],
        constructor:function(args){
            declare.safeMixin(this,args);
            this.cacheSize=this.cacheSize>1?this.cacheSize:1;// at least have one
        },
        add:function(view){
            view.__hashPath=hash();
            if(!view.get('instance') || view.instance.refreshOnShow ){
                //refreshOnShow is flag to set view refresh every time.
                view.update();//create instance if not have
            }
            var index=this._queue.indexOf(view);
            if(index>=0){
                //already exist. move to last..
                this._queue.splice(index,1);
                this._queue.push(view);
            }else{
                this._queue.push(view);
                if(this._queue.length > this.cacheSize){
                    console.debug(this._queue.length,' size is up to ',this.cacheSize);
                    this.shiftOne();
                }
                console.debug('add one',this._queue.length,array.map(this._queue,function(item){
                    return item.__hashPath
                }));
            }
        },
        shiftOne:function(){
            var wrapper = this._queue.shift();
            wrapper.removeInstance();//remove instance
            console.debug('remove one',wrapper.__hashPath);
            return wrapper;
        }
    })();
})