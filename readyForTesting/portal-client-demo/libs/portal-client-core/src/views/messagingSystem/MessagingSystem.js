define([
    'xstyle/css!./css/MessagingSystem.css',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/MessagingSystem.html',
    "dojo/i18n!./nls/MessagingSystem",
    "dijit/layout/LayoutContainer",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dijit/DropDownMenu",
    "dijit/MenuItem",
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dgrid/Selector",
    "./ComposeDialog",
    "./MessageDialog",
    "./formatter",
    "portal/_base/store/PortalStore",
    "dojo/when",
    "dojo/dom-style",
    "dojo/dom-class"
], function (css, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare, template, nls, LayoutContainer, ContentPane,
             Button, DropDownMenu, MenuItem, OnDemandGrid, Selection, Selector, ComposeDialog, MessageDialog, formatter,
             PortalStore, when, domStyle, domClass) {

    var _MessagesGrid = declare([OnDemandGrid, Selection, Selector], {
        selectionMode: "none",
        columns: [
            {
                label: "",
                selector: "checkbox",
                className: "selectorColumn"
            },
            {
                label: nls.from + " / " + nls.to,
                className: "senderColumn readMessage",
                get: function (data) {
                    return formatter.formatGridSender(data)
                },
                formatter: function (value) {
                    return value;
                }
            },
            {
                label: nls.subject + " - " + nls.message,
                className: "messageColumn readMessage",
                get: function (data) {
                    return formatter.formatGridMessage(data)
                },
                formatter: function (value) {
                    return value;
                }
            },
            {
                label: nls.date,
                className: "dateColumn readMessage",
                get: function (data) {
                    return formatter.formatGridDate(data)
                },
                formatter: function (value) {
                    return value;
                }
            }
        ],

        showInboxMessages: function () {
            this.set('collection', PortalStore.messages.getInboxMemory());
        },

        showSentMessages: function () {
            this.set('collection', PortalStore.messages.getSentMemory());
        },

        showTrashMessages: function () {
            this.set('collection', PortalStore.messages.getTrashMemory());
        }
    });

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        baseClass: "messagingSystem",
        version: "0.0.1",
        nls: nls,

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);

            var _t = this;
            PortalStore.messages.on("update", function () {
                _t._showSentMessages();
            });
            PortalStore.messages.getInbox().on("update", function () {
                _t._showInboxMessages();
            });
            PortalStore.messages.getSent().on("delete", function () {
                _t._showSentMessages();
            });
            PortalStore.messages.getTrash().on("delete", function () {
                _t._showTrashMessages();
            });
            this.readButton.on("click", function () {
                for (var id in _t.messagesGrid.selection) {
                    PortalStore.messages.read(_t.messagesGrid.row(id).data);
                }
            });
            this.unreadButton.on("click", function () {
                for (var id in _t.messagesGrid.selection) {
                    PortalStore.messages.unread(_t.messagesGrid.row(id).data);
                }
            });
            this.deleteButton.on("click", function () {
                for (var id in _t.messagesGrid.selection) {
                    PortalStore.messages.deleteM(_t.messagesGrid.row(id).data);
                }
            });

            this.composeDialog = new ComposeDialog();
            when(PortalStore.users.getUsers(), function (response) {
                _t.composeDialog.users = response;
            });
            when(PortalStore.users.getCurrentUser(), function (response) {
                _t.composeDialog.currentUser = response.userName;
            });
            this.composeDialog.on(this.composeDialog.events.send, function (event) {
                PortalStore.messages.send(event.data);
            });
            this.composeButton.on("click", function () {
                _t.composeDialog.show();
            });
            this.inboxButton.on("click, blur", function () {
                _t._showInboxMessages();
            });
            this.sentButton.on("click, blur", function () {
                _t._showSentMessages();
            });
            this.trashButton.on("click, blur", function () {
                _t._showTrashMessages();
            });

            this.messageDialog = new MessageDialog();
            this.messageDialog.on(this.messageDialog.events.read, function (event) {
                PortalStore.messages.read(event.data);
            });
            this.messageDialog.on(this.messageDialog.events.reply, function (event) {
                _t.composeDialog.reply(event.data);
            });
            this.messageDialog.on(this.messageDialog.events.forward, function (event) {
                _t.composeDialog.forward(event.data);
            });
            this.messageDialog.on(this.messageDialog.events.deleteEvent, function (event) {
                PortalStore.messages.deleteM(event.data);
            });
            this.messagesGrid = new _MessagesGrid({}, this.gridAttach);
            this.messagesGrid.on('.readMessage:click', function (event) {
                _t.messageDialog.read(_t.messagesGrid.cell(event).row.data);
            });

            this._showInboxMessages();
        },

        startup: function () {
            this.inherited(arguments);
        },

        resize: function () {
            this.container.resize();
        },

        _updateMessageCounter: function() {
            var _t = this;
            PortalStore.messages.getNew().then(function (response) {
                if (response.length>0) {
                    _t.inboxButton.set("label", nls.inbox + " (" + response.length + ")");
                } else {
                    _t.inboxButton.set("label", nls.inbox);
                }
                _t.inboxButton.startup();
            });
        },

        _showInboxMessages: function() {
            this._updateMessageCounter();
            this.messagesGrid.showInboxMessages();
            domStyle.set(this.readButton.domNode, { display: "inline-block" });
            domStyle.set(this.unreadButton.domNode, { display: "inline-block" });
            domClass.add(this.inboxButton.domNode, "dijitMenuItemSelected");
            domClass.remove(this.sentButton.domNode, "dijitMenuItemSelected");
            domClass.remove(this.trashButton.domNode, "dijitMenuItemSelected");
        },

        _showSentMessages: function() {
            this._updateMessageCounter();
            this.messagesGrid.showSentMessages();
            domStyle.set(this.readButton.domNode, { display: "none" });
            domStyle.set(this.unreadButton.domNode, { display: "none" });
            domClass.remove(this.inboxButton.domNode, "dijitMenuItemSelected");
            domClass.add(this.sentButton.domNode, "dijitMenuItemSelected");
            domClass.remove(this.trashButton.domNode, "dijitMenuItemSelected");
        },

        _showTrashMessages: function() {
            this._updateMessageCounter();
            this.messagesGrid.showTrashMessages();
            domStyle.set(this.readButton.domNode, { display: "none" });
            domStyle.set(this.unreadButton.domNode, { display: "none" });
            domClass.remove(this.inboxButton.domNode, "dijitMenuItemSelected");
            domClass.remove(this.sentButton.domNode, "dijitMenuItemSelected");
            domClass.add(this.trashButton.domNode, "dijitMenuItemSelected");
        },
        destroy:function(){
            this.messageDialog.destroyRecursive();
            this.composeDialog.destroyRecursive();
            this.inherited(arguments);
        }
    });
});