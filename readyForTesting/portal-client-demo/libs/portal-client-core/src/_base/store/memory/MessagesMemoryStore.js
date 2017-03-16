//TODO
define([
    'dstore/Memory',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable',
    'dstore/RequestMemory'
], function(Memory, declare, Rest, Trackable, RequestMemory) {
    return declare([Memory, Trackable],{
        data:[
        ],
        _messagesReceivedStore : new declare([ Memory, Trackable])(),
        _messagesSentStore : new declare([ Memory, Trackable])(),
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
            return new Memory().fetch("");//TODO
        },
        getInboxMemory: function() {
            return new Memory();//TODO
        },
        getSentMemory: function() {
            return new Memory();//TODO
        },
        getTrashMemory: function () {
            return new Memory();//TODO
        },
        startup:function(){

        }
    })
});