define([
    'dojo/io-query',
    'dojo/_base/declare',
    'dojo/topic',
    'dojo/hash'],function(ioQuery, declare, topic, hash){
//TODO in future maybe need complex router.
    var Helper= declare([], {
        switchView:function(viewKey,query){
            var hashes=hash().split('/');
            this.switchTo(hashes[0],viewKey,query);
        },
        switchApp:function(appKey){
            this.switchTo(appKey);
        },
        switchTo:function(appKey,viewKey,query){
            appKey = appKey?encodeURIComponent(appKey):appKey;
            viewKey = viewKey?encodeURIComponent(viewKey):viewKey;
            query = query? '?'+ioQuery.objectToQuery(query):'';//TODO
            hash( appKey + ( viewKey?('/'+viewKey+query):'' ));
        },
        getAppKey:function(){
            var appKey = hash().split('?')[0].split('/')[0];
            appKey = appKey?decodeURIComponent(appKey):appKey;
            return appKey;
        },
        getViewKey:function(){
            var viewKey = hash().split('?')[0].split('/')[1];
            viewKey = viewKey?decodeURIComponent(viewKey):viewKey;
            return viewKey;
        },
        getViewQuery:function(){
            var q= hash().split('?')[1];
            return q?ioQuery.queryToObject(q):{};
        },
        getViewQueryString:function(){
            return hash().split('?')[1];
        },
        start:function(){

        }
    });

    return new Helper();
})