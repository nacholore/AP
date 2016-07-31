define(function (require) {
	var registerSuite = require('intern!object');
	var assert = require('intern/chai!assert');
	var BaseMap = require('app-client/sidebar/BaseMap');

	registerSuite({
		name: "hello",

		"Init basemap": function () {
			baseMapItem = new BaseMap();

			assert.equal(baseMapItem._baseLayerStore.data.length, 3, "Not layerID");
		}

	});
});
