define([
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/Dialog",
        "dojo/text!./templates/bug.report.html",
        "jsPDF/jspdf",
        "jsPDF/html2canvas"
    ],
    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Dialog, template, jsPDF, html2canvas){
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {

            templateString: template,
            create: function() {
                return this.inherited(arguments);
            },
            dialog: null,
            download_file_name : 'bug_report',

            createDialog: function(args) {
                if (this.dialog == null)
                    this.dialog = new Dialog(dojo.mixin({
                        content: this
                    }, args));
                return this.dialog;
            },
            showDialog: function (args) {
                this.createDialog(args);
                this.dialog.show().then(function () {
                });
            },

            hideDialog: function() {
                if (this.dialog != null)
                    this.dialog.hide();
            },

            destroyDialog: function() {
                if (this.dialog != null)
                    this.dialog.destroy();
            },
            browserInfo : function(){
                var OSName="Unknown OS";
                if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
                if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
                if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
                if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

                var ua= navigator.userAgent, tem,
                    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                if(/trident/i.test(M[1])){
                    tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return ['IE ', (tem[1] || ''), OSName];
                }
                if(M[1]=== 'Chrome'){
                    tem= ua.match(/\bOPR\/(\d+)/);
                    if(tem!= null) return ['Opera ', tem[1], OSName];
                }
                M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
                if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);

                M[2] = OSName;
                return M;
            },
            actionReport: function () {
                this.hideDialog();
                var _t=this;
                setTimeout(function(){
                    _t.html2pdf();
                },1000);
            },

            html2pdf : function(){
                var file_name = this.download_file_name;
                var pdf = new jsPDF('p', 'pt', 'letter');
                var bug_description = this.bug_report_description.value;
                var browserInfo = this.browserInfo();   //arr[0]->browser name, arr[1]->version, arr[2]->os name
                var line_height = pdf.getLineHeight();
                pdf.setFontSize(12).setFontType('bold').text(10, line_height, 'url/ip: ').setFontSize(10).setFontType('').text(80, line_height, location.href);
                pdf.setFontSize(12).setFontType('bold').text(10, line_height * 2, 'brower: ').setFontSize(10).setFontType('').text(80, line_height * 2, browserInfo[0] + ' ' + browserInfo[1] + '  ' + browserInfo[2]);
                pdf.setFontSize(12).setFontType('bold').text(10, line_height * 3, 'version: ').setFontSize(10).setFontType('').text(80, line_height * 3, '0.1.2');//
                pdf.setFontSize(12).setFontType('bold').text(10, line_height * 4 , 'description:').setFontSize(10).setFontType('').text(80, line_height * 4, bug_description);

                window.html2canvas(document.body, {
                    onrendered:function(canvas){
                        var imgData = canvas.toDataURL('image/png',1.0);
                        pdf.addImage(imgData, 'png',5,line_height * 5,590,canvas.height*590/canvas.width);
                        pdf.save(file_name + '.pdf');
                    }
                });
            },

            actionCancel: function() {
                this.hideDialog();
            }

        });

    }
)