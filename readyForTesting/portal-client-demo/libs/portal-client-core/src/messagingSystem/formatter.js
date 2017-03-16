define([
    "dojo/date/locale",
    "dojo/i18n!./nls/MessagingSystem",
    "portal/_base/store/PortalStore"
], function (locale, nls, PortalStore) {

    return {

        _messagePreviewLength: 50,

        _formatNewMessage: function (data, value) {
            if (data.hasOwnProperty('status') && data.status==PortalStore.messages.status.newM) {
                value = "<strong>" + value + "</strong>";
            }
            return value;
        },

        formatDialogSender: function (data) {
            var sender = "<strong>";
            if (data.hasOwnProperty('sender')) {
                sender += nls.from + ": </strong>" + data.sender;
            } else {
                sender += nls.to + ": </strong>" + data.recipients;
            }
            return sender;
        },

        formatGridSender: function (data) {
            var sender = "";
            if (data.hasOwnProperty('sender')) {
                sender = data.sender;
            } else {
                sender = nls.to + ": " + data.recipients;
            }
            return this._formatNewMessage(data, sender);
        },

        formatDialogSubject: function (data) {
            return data.subject || nls.noSubject;
        },

        formatReplySubject: function (data) {
            return nls.re + ": " + this.formatDialogSubject(data);
        },

        formatForwardSubject: function (data) {
            return nls.fwd + ": " + this.formatDialogSubject(data);
        },

        formatGridSubject: function (data) {
            return this._formatNewMessage(data, this.formatDialogSubject(data));
        },

        formatDialogMessage: function (data) {
            return data.message || nls.emptyMessage;
        },

        formatReplyMessage: function (data) {
            var message = "\n\n\n---\n" + this.formatDialogDate(data);
            message += " - " + data.sender + ":\n\n";
            return message + data.message.replace(/<br>/g,"\n");
        },

        formatForwardMessage: function (data) {
            var message = "\n\n\n--- " + nls.forwardedMessage + " ---\n";
            message += nls.from + ": " + data.sender + "\n";
            message += nls.date + ": " + this.formatDialogDate(data) + "\n";
            message += nls.subject + ": " + data.subject + "\n\n";
            return message + data.message.replace(/<br>/g,"\n");
        },

        formatGridMessage: function (data) {
            var preview = this.formatGridSubject(data);
            preview += "<span class='messagePreview'> - ";
            var message = this.formatDialogMessage(data).split("<br>")[0];
            if (message.length>this._messagePreviewLength) {
                message = message.substr(0,this._messagePreviewLength) + "...";
            }
            return preview + message + "</span>";
        },

        _getDateDay: function (date) {
            return locale.format(date, {
                selector: "time",
                datePattern: "h:mm a"
            }).toLowerCase();
        },

        _getDateMonth: function (date) {
            return locale.format(date, {
                selector: "date",
                datePattern: "d MMM"
            });
        },

        _getDateYear: function (date) {
            return locale.format(date, {
                selector: "date",
                datePattern: "d/MM/yyyy"
            });
        },

        formatDialogDate: function (data) {
            var date = new Date(data.timestamp);
            return this._getDateYear(date) + ", " + this._getDateDay(date);
        },

        formatGridDate: function (data) {
            var date = new Date(data.timestamp);
            var today = new Date();
            var dateString = "";
            if (date.getFullYear()!=today.getFullYear()) {
                dateString = this._getDateYear(date);
            } else if (date.getMonth()!=today.getMonth() || date.getDate()!=today.getDate()) {
                dateString = this._getDateMonth(date);
            } else {
                dateString = this._getDateDay(date);
            }
            return this._formatNewMessage(data, dateString);
        }
    };
});