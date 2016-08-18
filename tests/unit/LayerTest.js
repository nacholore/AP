define([
	'intern!object'
	, 'intern/chai!assert'
	, 'tests/support/data/Layers'
	, 'app-client/map/Layer'
], function (
	registerSuite
	, assert
	, LayerDef
	, Layer
) {
	registerSuite({
		name: "Layer",

		"Init Layer": function () {
			layer = new Layer(LayerDef.Tiled);

			assert.equal(layer.id, "OU", "Not layerID");
			assert.isNotOk(layer.isBaseLayer(), "Layer inserted with baselayer");
		},

		"Tiled": function() {
			layer = new Layer(LayerDef.Tiled);

			assert.isOk(layer.isTiled(), "No single layer")
		},

		"Compare equal layers": function() {
			layer1 = new Layer(LayerDef.Tiled);
			layer2 = new Layer(LayerDef.Tiled);

			assert.isOk(layer1.equalTo(layer2), "No equal layers");
		},

		"Compare distinct layers": function() {
			layer1 = new Layer(LayerDef.Tiled);
			layer2 = new Layer(LayerDef.Single);

			assert.isNotOk(layer1.equalTo(layer2), "Equal layers");
		},

		"Is queryable (infoTemplate)": function() {
			layer = new Layer(LayerDef.Template);

			assert.isOk(layer.isQueryable(), "Should return true");
		},

		"Is queryable (property)": function() {
			layer = new Layer(LayerDef.Queryable);

			assert.isOk(layer.isQueryable(), "Should return true");
		},

		"No queryable": function() {
			layer = new Layer(LayerDef.Tiled);

			assert.isNotOk(layer.isQueryable(), "Should return false");
		}

	});
});
