define([
	'dojo/_base/declare', 'dojo/_base/lang', 'dojo/request'
], function (declare, lang, request) {
	return declare(null, {

		get: function (id, options) {
			// summary:
			//		Retrieves an object by its identity. This will trigger a GET request to the server using
			//		the url `this.target + id`.
			// id: Number
			//		The identity to use to lookup the object
			// options: Object?
			//		HTTP headers. For consistency with other methods, if a `headers` key exists on this
			//		object, it will be used to provide HTTP headers instead.
			// returns: Object
			//		The object in the store that matches the given id.
			options = options || {};
			var headers = lang.mixin({Accept: this.accepts}, this.headers, options.headers || options);
			var store = this;
			return request(this._getTarget(id), {
				headers: headers, query: options.query || {}
			}).then(function (response) {
				return store._restore(store.parse(response), true);
			});
		}
	})
});