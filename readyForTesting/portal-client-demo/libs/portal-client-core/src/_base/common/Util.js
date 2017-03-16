define([
    'dojo/i18n!./nls/Util',
    'dojo/Deferred',
    'dojo/promise/all',
    'dojo/request',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/_base/array',
    'dojo/_base/declare'
],function(nls,Deferred, all, request, lang, on, array, declare
){
    return {
        concatArray:function(arrs){
            var re=[];
            array.forEach(arrs,function(arr){
                array.forEach(arr,function(item){
                    re.push(item);
                })
            });
            return re;
        },
        keys:function(obj){
            var result=[];
            for(var key in obj){
                result.push(key);
            }
            return result;
        },
        removeFromArray:function(arr,checkFn){
            if(lang.isFunction(checkFn)){
                for(var i=0;i<arr.length;){
                    if(checkFn(arr[i])){
                        arr.splice(i,1);
                    }else{
                        i++;
                    }
                }
            }else{
                var i;
                if((i = array.indexOf(arr,checkFn)) >= 0){
                    arr.splice(i,1);
                }
            }

        },
        addUnique:function(arr,item){// add item if not exist
            array.indexOf(arr,item) == -1 ? arr.push(item):'';
        },
        unionArray:function(ary1,ary2){
            var result= lang.clone(ary1);
            array.forEach(ary2,function(item){
                if(array.indexOf(result,item) == -1){
                    result.push(item);
                }
            });
            return result;
        },
        isEqual:function(obj1,obj2,skipExp){
            if(typeof obj1 == 'object' && typeof obj2== 'object' ){
                var keys = this.unionArray(this.keys(obj1),this.keys(obj2));
                for(var i = 0;i<keys.length;i++){
                    var key = keys[i];
                    if(!skipExp.test(key)){
                        if( typeof obj1[key] == 'object'){
                            var re = this.isEqual(obj1[key],obj2[key],skipExp);
                            if(!re){
                                //console.log('compare field is different',key,obj1[key],obj2[key]);
                                return false;
                            }
                        }else if(obj1[key] !== obj2[key]){
                            //console.log('compare field is different',key,obj1[key],obj2[key]);
                            return false
                        }
                    }
                }
                return true;
            }
        },
        requirePackageResource:function(packageName){
            var deferred = new Deferred();

            /*   TODO why load package files with request why not simply use require like this ?
                require(['dojo/ready',packageName + "/layer",'xstyle/css!'+packageName + "/layer.css"],function(ready){
                     ready(function(){
                         deferred.resolve()
                         });
                     })*/
            
          all([
                request.get( packageName + "/layer.js"),
                request.get( packageName + "/layer.css")
            ]).then(function(){
               require(['dojo/ready',packageName + "/layer.js",'xstyle/css!'+packageName + "/layer.css"],function(ready){
                   ready(function(){
                       deferred.resolve()
                   });
               })
           },function(){
                console.warn('build resource not found :',packageName);
                deferred.resolve();
           });

            return deferred.promise;
        },
        period:{
            stringify:function(interval,/*not yet*/start,/*not yet*/end){
                return this.buildInterval(interval);
            },
            parse:function(text){
                // now just parse interval.
                return this.parseInterval(text);
            },
            _getNumber:function(text){
                if(text){
                    var n=/^[\d]+/.exec(text)[0];
                    return parseInt(n);//TODO float?
                }
            },
            buildInterval:function(interval){
                return  'P'+(interval.year?interval.year+'Y':'')+
                    (interval.month?interval.month+'M':'')+
                    (interval.week?interval.week+'W':'')+
                    (interval.day?interval.day+'D':'')+
                    (interval.hour || interval.min ||interval.sec ?'T':'' )+
                    (interval.hour?interval.hour+'H':'')+
                    (interval.min?interval.min+'M':'')+
                    (interval.sec?interval.sec+'S':'');
            },
            parseInterval:function(text){
                var p={};
                //P1Y2M10DT2H30M
                var m1=/^P([\dYMWDymwd]*)?(T[\dHMShms]*)?$/.exec(text);
                var dateText=m1[1];
                var timeText=m1[2];
                if(dateText){
                    //date
                    var m=/^([\d]+[Yy])?([\d]+[Mm])?([\d]+[Ww])?([\d]+[Dd])?$/.exec(dateText);
                    m[1]?p.year=this._getNumber(m[1]):'';
                    m[2]?p.month=this._getNumber(m[2]):'';
                    m[3]?p.week=this._getNumber(m[3]):'';
                    m[4]?p.day=this._getNumber(m[4]):'';
                }
                if(timeText){
                    //time
                    var m=/^([\d]+[Hh])?([\d]+[Mm])?([\d]+[Ss])?$/.exec(timeText.substr(1));
                    m[1]?p.hour=this._getNumber(m[1]):'';
                    m[2]?p.min=this._getNumber(m[2]):'';
                    m[3]?p.sec=this._getNumber(m[3]):'';
                }
                return p;
            },
            getIntervalLabel:function(interval){
                interval = typeof interval == 'string' ? this.parse(interval):interval;
                return  (interval.year?interval.year+' '+nls.year:'')+
                    (interval.month?interval.month+' '+nls.month:'')+
                    (interval.week?interval.week+' '+nls.week:'')+
                    (interval.day?interval.day+' '+nls.day:'')+
                    (interval.hour?interval.hour+' '+nls.hour:'')+
                    (interval.min?interval.min+' '+nls.min:'')+
                    (interval.sec?interval.sec+' '+nls.sec:'');
            }
        }


    };
});