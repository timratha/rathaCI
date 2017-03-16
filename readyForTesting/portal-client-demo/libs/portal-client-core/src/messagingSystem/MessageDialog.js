define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/declare',
    'dijit/Dialog',
    'dojo/text!./templates/MessageDialog.html',
    "dojo/i18n!./nls/MessagingSystem",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "./formatter",
    "dojo/dom-style"
], function (TemplatedMixin, WidgetsInTemplateMixin, declare, Dialog, template, nls, ContentPane, Button, formatter,
             domStyle) {

    return declare([Dialog, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        baseClass: "messagingSystem",
        version: "0.0.1",
        nls: nls,

        events: {
            read: "messaging/system/read",
            reply: "messaging/system/reply",
            forward: "messaging/system/forward",
            deleteEvent: "messaging/system/delete"
        },

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
            var _t = this;
            this.replyButton.on("click", function() {
                _t._reply();
            });
            this.forwardButton.on("click", function() {
                _t._forward();
            });
            this.deleteButton.on("click", function() {
                _t._delete();
            });
        },

        startup: function () {
            this.inherited(arguments);
        },

        read: function (data) {
            this.data = data;
            this.emit(this.events.read, { data: this.data });
            this.set("title", formatter.formatDialogSubject(data));
            this.sender.innerHTML = formatter.formatDialogSender(data);
            this.timestamp.innerHTML = formatter.formatDialogDate(data);
            this.message.innerHTML = formatter.formatDialogMessage(data);
            this.show();
        },

        _reply: function () {
            this.emit(this.events.reply, { data: this.data });
            this.hide();
        },

        _forward: function () {
            this.emit(this.events.forward, { data: this.data });
            this.hide();
        },

        _delete: function () {
            this.emit(this.events.deleteEvent, { data: this.data });
            this.hide();
        }
    });
});
