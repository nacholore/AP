define(function (require) {
	var registerSuite = require('intern!object');
	var assert = require('intern/chai!assert');
	var Search = require('app-client/sidebar/Search');

	registerSuite({
		name: "Search",

		"Has changed query": function () {
			var searchItem = new Search({
					lastQuery: {
						text: null,
						layers: null
					},
					newQuery: {
						text: "hola",
						layers: null
					}
				});
			assert.isOk(searchItem._hasChangedQuery(), "No change query");
		}


	});
});
