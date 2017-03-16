define([
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dijit/Dialog",
        "dojo/text!./templates/BugReportDialog.template.html",
        "dojo/date/locale",
        "dojo/query",
        "dojo/request",
        "dojo/promise/all",
        "../store/PortalStore",
        "dojo/i18n!./nls/BugReportDialog",
        "jspdf/jspdf",
        "jspdf/html2canvas"
    ],
    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Dialog, template, locale, query, request, all, PortalStore,nls,jsPDF){
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            declaredClass:'BugReportDialog',
            templateString: template,
            constructor:function(){
                this.nls=nls;
            },
            create: function() {
                return this.inherited(arguments);
            },
            dialog: null,
            download_file_name : 'bug_report',

            createDialog: function(args) {
                if (this.dialog == null)
                    this.dialog = new Dialog(dojo.mixin({
                        title:'Bug Report',
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
                var formatted_time = locale.format(new Date(), {
                    selector:"date"
                    ,datePattern:"y-M-d_H-m-s"
                });
                this.download_file_name = 'bug_report_' + formatted_time;
                var pdf = new jsPDF('l', 'pt', 'a4');
                var bug_description = this.bug_report_description.value;
                var browserInfo = this.browserInfo();   //arr[0]->browser name, arr[1]->version, arr[2]->os name
                var line_height = pdf.getLineHeight();
                var footer_element = query('.app-footer')[0];
                var details = footer_element.innerText || footer_element.textContent;
                var line_th = 1; //which line to display the content on the pdf

                pdf.setFontSize(12).setFontType('bold').text(10, line_height * line_th, 'Url/ip: ').setFontSize(10).setFontType('').text(80, line_height * line_th, location.href);
                pdf.setFontSize(12).setFontType('bold').text(10, line_height * (++line_th), 'Brower: ').setFontSize(10).setFontType('').text(80, line_height * line_th, browserInfo[0] + ' ' + browserInfo[1] + '  ' + browserInfo[2]);
                pdf.setFontSize(12).setFontType('bold').text(10, line_height * (++line_th), 'Version: ').setFontSize(10).setFontType('').text(80, line_height * line_th, '0.1.3');//
                pdf.setFontSize(12).setFontType('bold').text(10, line_height * (++line_th) , 'Description:').setFontSize(10).setFontType('').text(80, line_height * line_th, bug_description);
                pdf.setFontSize(12).setFontType('bold').text(10, line_height * (++line_th), 'Detail: ').setFontSize(10).setFontType('').text(80, line_height * line_th, details);//
                var _t = this;
                var user_info_request = request('//' + window.location.host + "/KiWebPortal" + "/rest/users/current?includeRoles=true&includeFunctionalPermissions=true", {handleAs:'json'});
                all({
                    user_info: user_info_request
                    ,response: user_info_request.response
                    ,sys_about: PortalStore.system.about()
                    ,sys_status: PortalStore.system.status()
                }).then(function(results){
                    var user_info = results.user_info;
                    pdf.setFontSize(12).setFontType('bold').text(10, line_height * (++line_th), 'User Name: ').setFontSize(10).setFontType('').text(80, line_height * line_th, user_info.userName);
                    for(var i= 0, user_roles = ''; i<user_info.userRoles.length; i++){  //user roles
                        user_roles += user_info.userRoles[i].name + ' ';
                    }
                    pdf.setFontSize(12).setFontType('bold').text(10, line_height * (++line_th), 'User roles: ').setFontSize(10).setFontType('').text(80, line_height * line_th, user_roles);
                    var functional_permission = '';
                    for(var i in user_info.functionalPermissions){
                        functional_permission += user_info.functionalPermissions[i] + ' ';
                    }
                    pdf.setFontSize(12).setFontType('bold').text(10, line_height * (++line_th), 'functionalPermissions: ').setFontSize(10).setFontType('').text(80, line_height * line_th, functional_permission);

                    var response_headers = results.response.xhr.getAllResponseHeaders();  //response headers
                    line_th++;  //separate the above information and respose information with a blank line
                    for(var i= 0, arr_headers = response_headers.split("\r\n"); i<arr_headers.length; i++){ // output response header
                        var colon_pos = arr_headers[i].indexOf(':');
                        var hearder_caption = arr_headers[i].substr(0, colon_pos + 1);
                        var hearder_content = arr_headers[i].substr(colon_pos + 1);
                        pdf.setFontSize(12).setFontType('bold');
                        var caption_text_width = pdf.getStringUnitWidth(hearder_caption) * 12;  // 12 is the font size of the header options
                        pdf.text(10, line_height * (++line_th), hearder_caption).setFontSize(10).setFontType('').text(caption_text_width + 15, line_height * line_th, hearder_content);
                    }

                    if(results.sys_about && results.sys_about.dbDriver){ //db server
                        pdf.setFontSize(12).setFontType('bold').text(10, line_height * (++line_th), 'dbDriver: ').setFontSize(10).setFontType('').text(80, line_height * line_th, results.sys_about.dbDriver);
                    }
                    for(var i in results.sys_status){ //server status
                        pdf.setFontSize(12).setFontType('bold');
                        var key_text_width = pdf.getStringUnitWidth(i) * 12;
                        pdf.text(10, line_height * (++line_th), i + ':').setFontSize(10).setFontType('').text(key_text_width + 15, line_height * line_th, results.sys_status[i]);
                    }
                    pdf.addPage();
                    window.html2canvas(document.body, {
                        onrendered:function(canvas){
                            var imgData = canvas.toDataURL('image/png',1.0);
                            pdf.addImage(imgData, 'png',10, line_height * 1, 820, canvas.height*820/canvas.width);
                            pdf.save(_t.download_file_name + '.pdf');
                        }
                    });
                });
            },

            actionCancel: function() {
                this.hideDialog();
            }

        });

    }
)