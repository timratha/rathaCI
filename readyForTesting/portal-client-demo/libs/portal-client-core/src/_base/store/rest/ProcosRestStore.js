define([
	'dojo/_base/lang',
	'dojo/json',
	'dojo/request',
	'dojo/_base/declare',
	'dstore/Rest',
	'dstore/Trackable'
],function(lang, JSON, request, declare, Rest, Trackable){
	var basePath ="";
	return declare(null,{
		constructor:function(args){
			this.inherited(arguments);
			basePath =  args.basepath;
			this.users.target =  basePath  +"/rest/procos/dataSources/1/users";
			this.sections.target =  basePath  +"/rest/procos/dataSources/1/sections";
			this.variableTypes.target =  basePath  +"/rest/procos/dataSources/1/variableTypes";
			this.substations.target =  basePath  +"/rest/procos/dataSources/1/substations";
			this.variables.target =  basePath  +"/rest/procos/dataSources/1/variables";
			this.timeSeries.target =  basePath  +"/rest/procos/dataSources/1/timeseries";
			this.timeSeriesData.target =  basePath  +"/rest/procos/dataSources/1/timeseries/data";
			this.variablesCurrent.target =  basePath  +"/rest/procos/dataSources/1/variables/current";
			this.processImages.target =  basePath  +"/rest/procos/dataSources/1/processImages";
			this.charts.target =  basePath  +"/rest/procos/dataSources/1/charts";
			this.notifications.target =  basePath  +"/rest/procos/dataSources/1/notifications";
			this.calculatedSeries.target =  basePath  +"/rest/procos/dataSources/1/calculatedSeries";
			this.reports.target = basePath + "/rest/procos/dataSources/1/reports";
		},
		users : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		}),

		sections : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		}),

		variableTypes : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		}),

		substations : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		}),

		variables : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		}),

		timeSeries : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		}),

		timeSeriesData : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'},
			put: function(object, options) {
				var _t = lang.clone(this);
				_t.target = _t.target + "?showStatus=true";
				return _t.inherited(arguments);
			}
		}),

		variablesCurrent : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		}),

		processImages : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'},
			getSvgString: function(id) {
				return request(this.target + "?svgId=" + id, {handleAs: "text"});
			}
		}),

		charts : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		}),

		notifications : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'},
			confirm: function(data){
				return request.put(this.target, {handleAs: "json", headers: {Accept: "application/json", 'Content-Type': 'application/json;charset=utf-8'}, data: JSON.stringify(data) });
			}
		}),

		calculatedSeries : new declare([ Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'},
			put: function(object, options) {
				var _t = lang.clone(this);
				_t.target = _t.target + "?showStatus=true";
				return _t.inherited(arguments);
			}
		}),

		reports: new declare([Rest, Trackable])({
			headers: {'Content-Type': 'application/json;charset=utf-8'},
			getReport: function (data) {
				return request(this.target + "/" + data.id + "/" + "from=" + data.from, {
					handleAs: "text",
					headers: {
						Accept: "application/json",
						'Content-Type': 'application/json;charset=utf-8'
					}
				});
			}
		})
	})
});