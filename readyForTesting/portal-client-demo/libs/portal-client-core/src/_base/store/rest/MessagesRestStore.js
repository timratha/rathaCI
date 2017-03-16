define([
    'dojo/_base/lang',
    'dojo/request',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable',
    'dstore/RequestMemory'
], function(lang, request, declare, Rest, Trackable, RequestMemory) {
    var basePath ="";
    return declare([Rest, Trackable],{
        _started:false,
        constructor:function(args){
            this.inherited(arguments);
            basePath = args.basepath;
            this.target = basePath+"/rest/messages/";
            this._messagesReceivedStore.target =basePath+"/rest/messages/received/";
            this._messagesSentStore.target =basePath+"/rest/messages/sent/";
        },
        _messagesReceivedStore : new declare([ Rest, Trackable])({
            headers: { 'Content-Type': 'application/json' }
        }),
        _messagesSentStore : new declare([ Rest, Trackable])({
            headers: { 'Content-Type': 'application/json' }
        }),
        status: {
            newM: 0,
            read: 1,
            trash: 2
        },
        send: function(data){
            this.put(data);
        },
        read: function (data) {
            if (data.hasOwnProperty('status') && data.status==this.status.newM) {
                this._messagesReceivedStore.put({ "status": this.status.read }, { id: data.MessageID });
            }
        },
        unread: function (data) {
            if (data.hasOwnProperty('status') && data.status==this.status.read) {
                this._messagesReceivedStore.put({ "status": this.status.newM }, { id: data.MessageID });
            }
        },
        deleteM: function (data) {
            if (!data.hasOwnProperty('status')) {
                this._messagesSentStore.remove(data.messageID);
            } else if (data.status==this.status.trash) {
                this._messagesReceivedStore.remove(data.MessageID);
            } else {
                this._messagesReceivedStore.put({ "status": this.status.trash }, { id: data.MessageID });
            }
        },
        getInbox: function() {
            return this._messagesReceivedStore;
        },
        getSent: function() {
            return this._messagesSentStore;
        },
        getTrash: function () {
            return this._messagesReceivedStore.filter({ status: this.status.trash });
        },
        getNew: function () {
            return request.get(this._messagesReceivedStore.target + "?status=" + this.status.newM, {
                handleAs: "json",
                headers: this._messagesReceivedStore.headers
            });
        },
        getInboxMemory: function() {
            return new RequestMemory({
                target: this._messagesReceivedStore.target,
                headers:this. _messagesReceivedStore.headers
            });
        },
        getSentMemory: function() {
            return new RequestMemory({
                target: this._messagesSentStore.target,
                headers: this._messagesSentStore.headers
            });
        },
        getTrashMemory: function () {
            return new RequestMemory({
                target: this._messagesReceivedStore.target + "?status=" + this.status.trash,
                headers: this._messagesReceivedStore.headers
            });
        },
        startup:function(){
            var _t=this;
            if(!this._started){
                var interval = setInterval(function(){
                    _t.getNew().then(function (response) {
                        _t.emit('newMessages',response); //also emit when empty
                    },function(error){
                        clearInterval(interval);

                    });
                },120000);
                this._started=true;
            }
        }

    })
});