define([
'intern!tdd',
'intern/chai!assert',
'intern/node_modules/dojo/has!host-browser?./app-client/map/QueryFeature'
], function (tdd, assert, QueryFeature) {
		tdd.suite('query', function() {
			var widget;

			tdd.before(function () {
				//widget = new QueryFeature({});
			});

			tdd.test('Hola', function () {
			//	var json = widget._getGeoJson();
				assert.strictEqual('Hola', 'Hola', 'Ok _getGeoJson');
			});
		});
});