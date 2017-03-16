define(['dojo/when',
    'dojo/Deferred',
    'dstore/Memory',
    'dojo/_base/lang',
    'dojo/request',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable'], function (when, Deferred, Memory, lang, request, declare, Rest, Trackable) {

    return declare([Memory, Trackable], {

        tsDataKIWIS: new declare([Memory, Trackable])({
            idProperty: 'ts_id',
            createRandomData: function (id, options) {
                var startDate = (options && options.startDate) || new Date('2012-11-01');
                var endDate = (options && options.endDate) || new Date('2013-12-01');
                var period = (options && options.period) || 24 * 3600 * 1000;
                startDate = startDate.valueOf();
                endDate = endDate.valueOf();

                var data = [];
                for (var d = startDate; d < endDate; d += period) {
                    data.push([
                        new Date(d).toString(),
                        Math.random() * 10
                    ])
                }
                return {
                    "ts_id": id,
                    "rows": data.length,
                    "columns": "Timestamp,Value",
                    "data": data
                }
            },
            getData: function (obj) {
                return this.filter(obj.ts_id).fetch()
            }
        })
    })
})