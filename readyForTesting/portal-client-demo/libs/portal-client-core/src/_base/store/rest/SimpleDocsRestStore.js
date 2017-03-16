define([
    'dojo/_base/Deferred',
    'dstore/Memory',
    'dojo/request',
    './storeMixins/_filterGet',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Cache',
    'dstore/Trackable'
], function(Deferred, Memory, request, filterGet, declare, Rest, Cache, Trackable) {

    return declare([],{
        constructor:function(args){
            this.configs=new declare([Rest,Trackable,Cache])({
                target:args.basepath+"/rest/simpleDocs/configs"
            });
            this.templates=new declare([Rest,Trackable])({
                target:args.basepath+"/rest/simpleDocs/templates"
            });

            this.docs=new declare([Rest,Trackable,filterGet])({
                target:args.basepath+"/rest/simpleDocs",
                getDoc:function(simpleDocID,targetFormat,templateFileName){
                    return request(this.target+"/"+simpleDocID,{query:{templateFileName:templateFileName,targetFormat:targetFormat,downloading:false}})
                },
                getDocWithoutId:function(targetFormat,templateFileName, body){
                    var ret = new Deferred()
                    var oReq = new XMLHttpRequest();
                    oReq.open("POST", this.target+"?templateFileName="+templateFileName+"&targetFormat="+targetFormat+"&downloading=false", true);
                    oReq.responseType = (targetFormat=="pdf")? "arraybuffer":"text";

                    oReq.onload = function(oEvent) {
                        var blob = oReq.response;
                        ret.resolve(blob);
                    };

                    oReq.send(JSON.stringify(body));

                    return ret;
                },

                getDocUrl:function(simpleDocID,targetFormat,templateFileName,downloading){
                    return this.target+"/"+simpleDocID+"?templateFileName="+ templateFileName+"&targetFormat="+targetFormat+"&downloading="+downloading;
                },
                bulk:function(simpleDocID,conf){
                    return request.post(this.target+"/"+simpleDocID+"/bulk",{
                        data:JSON.stringify(conf),
                        headers:{
                            'Accept':'application/json',
                            'Content-Type':'application/json'
                        }})
                }
            });
        }
    })
});