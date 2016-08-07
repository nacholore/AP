define(function (require) {
	var registerSuite = require('intern!object');
	var assert = require('intern/chai!assert');
	var _Map = require('app-client/map/_Map');
	var Layer = require('app-client/map/Layer');

	registerSuite({
		name: "Map",

		"Add layers": function () {
			var mapItem = new _Map({}),
				layer = new Layer({
					id: "prueba"
				}),
				dfd = this.async(1000);

			mapItem.on("add-layer", dfd.callback(function(layer) {
				assert.equal(layer.id, "prueba", "Not event fired 'add-layer'");
			}));

			mapItem.addLayer(layer);
		},

		"Add baselayer": function () {
			var mapItem = new _Map(),
				layer = new Layer({
					id: "prueba",
					baselayer: true
				}),
				outLayers = [],
				dfd = this.async(1000, 2);

			mapItem.on("change-baselayer, add-layer", dfd.callback(function(layer) {
				assert.equal(layer.id, "prueba", "Not event fired 'add-layer'");
				assert.isOk(layer.isBaseLayer(), "Overwrite property baselayer");
			}));

			mapItem.addLayer(layer);
		},

		"Remove layer": function () {
			var mapItem = new _Map({}),
				layer = new Layer({
					id: "prueba"
				}),
				dfd = this.async(1000);

			mapItem.on("remove-layer", dfd.callback(function(layer) {
				assert.equal(layer.id, "prueba", "Not event fired 'remove-layer'");
			}));

			mapItem.addLayer(layer);
			mapItem.removeLayer(layer);
		},


		"Layer removed": function () {
			var mapItem = new _Map({}),
				layer = new Layer({
					id: "prueba"
				}),
				dfd = this.async(1000);

			mapItem.on("layer-removed", dfd.callback(function(layer) {
				assert.equal(layer.id, "prueba", "Not event fired 'removed-layer'");
				assert.equal(mapItem.layers.data.length, 0, "No delete item in store");
			}));

			mapItem.addLayer(layer);
			mapItem.removeLayer(layer);
		},

	});
});
