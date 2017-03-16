define([
    'dstore/Rest',
    'dojo/request',
    'dojo/when',
    'dojo/_base/lang',
    'dojo/json',
    'dojo/io-query',
    'dojo/_base/declare'
], function(Rest, request,when,lang,json,ioQuery,declare) {
    // Customized Rest Store, provide functionality as
    //   emit event with owner useful avoid update the widgetWrapper which start the save process.(for auto save in dashboard)


    return declare([Rest],{

        put: function (object, options) {
            options = options || {};
            var id = ('id' in options) ? options.id : this.getIdentity(object);
            var hasId = typeof id !== 'undefined';
            var store = this;

            var positionHeaders = 'beforeId' in options
                ? (options.beforeId === null
                ? { 'Put-Default-Position': 'end' }
                : { 'Put-Before': options.beforeId })
                : (!hasId || options.overwrite === false
                ? { 'Put-Default-Position': (this.defaultNewToStart ? 'start' : 'end') }
                : null);

            var initialResponse = request(hasId ? this._getTarget(id) : this.target, {
                method: hasId && !options.incremental ? 'PUT' : 'POST',
                query:options.query,                        // add query option
                data: this.stringify(object),
                headers: lang.mixin({
                    'Content-Type': 'application/json',
                    Accept: this.accepts,
                    'If-Match': options.overwrite === true ? '*' : null,
                    'If-None-Match': options.overwrite === false ? '*' : null
                }, positionHeaders, this.headers, options.headers)
            });
            return initialResponse.then(function (response) {
                var event = {owner :options.owner};         // add the owner

                if ('beforeId' in options) {
                    event.beforeId = options.beforeId;
                }

                var result = event.target = response && store._restore(store.parse(response), true) || object;

                when(initialResponse.response, function (httpResponse) {
                    store.emit(httpResponse.status === 201 ? 'add' : 'update', event);
                });

                return result;
            });
        }


    })
});

