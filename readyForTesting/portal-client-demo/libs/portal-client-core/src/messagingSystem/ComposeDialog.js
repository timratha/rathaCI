define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/declare',
    'dijit/Dialog',
    'dojo/text!./templates/ComposeDialog.html',
    "dojo/i18n!./nls/MessagingSystem",
    "dijit/layout/ContentPane",
    "dojox/form/MultiComboBox",
    "dijit/form/TextBox",
    "dijit/form/SimpleTextarea",
    "dijit/form/Button",
    "dojo/store/Memory",
    "./formatter"
], function (TemplatedMixin, WidgetsInTemplateMixin, declare, Dialog, template, nls, ContentPane, MultiComboBox,
             TextBox, SimpleTextarea, Button, Memory, formatter) {

    return declare([Dialog, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        baseClass: "messagingSystem",
        version: "0.0.1",
        nls: nls,

        title: nls.newMessage,
        events: {
            send: "messaging/system/send"
        },
        users: null,
        currentUser: "",

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);
            var _t = this;
            var word = "( )*[a-zA-Z]+( )*";
            var c = this.recipientsCombobox.delimiter;
            this.recipientsCombobox.set("pattern", "^"+word+"("+c+word+")*("+c+")?( )*$");
            this.recipientsCombobox.set("validator", function (value) {
                return _t._validator(value);
            });
            this.recipientsCombobox.set("searchAttr", "userName");
            this.on("show", function () {
                _t.reset();
                _t.recipientsCombobox._previousMatches = false;
                _t.recipientsCombobox.set("store", new Memory({ data: _t.users }));
            });
            this.sendButton.on("click", function () {
                _t._send();
            });
        },

        startup: function () {
            this.inherited(arguments);
        },

        _validator: function (value) {
            var isValid = true;
            if (new RegExp(this.recipientsCombobox.pattern).test(value)) {
                var recipients = value.split(this.recipientsCombobox.delimiter);
                for (var r in recipients) {
                    var recipient = recipients[r].trim();
                    if (recipient.length>0) {
                        var results = this.recipientsCombobox.store.query({ userName: recipient });
                        if (results.length == 0) {
                            isValid = false;
                            break;
                        }
                    }
                }
            } else {
                isValid = false;
            }
            return isValid;
        },

        _send: function () {
            if (!this.recipientsCombobox.isValid()) {
                this.recipientsCombobox.focus();
            } else {
                var recipients = this.recipientsCombobox.get("value").replace(" ","");
                if (recipients.lastIndexOf(this.recipientsCombobox.delimiter)==recipients.length-1) {
                    recipients = recipients.substr(0,recipients.length-1).replace(",",", ");
                }
                this.emit(this.events.send, {
                    data: {
                        recipients: recipients,
                        subject: this.subjectTextbox.get("value"),
                        message: this.messageTextbox.get("value").replace(/\n/g, "<br>")
                    }
                });
                this.hide();
            }
        },

        reply: function (data) {
            var _t = this;
            this.show();
            if (!data.hasOwnProperty('sender')) {
                data.sender = this.currentUser;
            }
            this.recipientsCombobox.set("value", data.sender);
            this.subjectTextbox.set("value", formatter.formatReplySubject(data));
            this.messageTextbox.set("value", formatter.formatReplyMessage(data));
        },

        forward: function (data) {
            var _t = this;
            this.show();
            if (!data.hasOwnProperty('sender')) {
                data.sender = this.currentUser;
            }
            this.subjectTextbox.set("value", formatter.formatForwardSubject(data));
            this.messageTextbox.set("value", formatter.formatForwardMessage(data));
        }
    });
});
