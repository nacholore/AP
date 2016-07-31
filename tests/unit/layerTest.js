define(function (require) {
	var registerSuite = require('intern!object');
	var assert = require('intern/chai!assert');
	var Layer = require('app-client/map/Layer');

	var layerConfTiled = {
		"id": "OU",
		"label": "Satélite",
		"default": true,
		"url": "http://idecan3.grafcan.es/ServicioWMS/OrtoUrb",
		"layersInfo": {
			"layers": ["OU"],
			"version": "1.1.1",
			"format": "image/jpeg"
		},
		"img": "baselayers/satellite.png"
	};

	var layerConfSingle = {
		"id": "OU",
		"label": "Satélite",
		"url": "http://idecan3.grafcan.es/ServicioWMS/OrtoUrb",
		"tiled": true,
		"layersInfo": {
			"layers": ["OU"],
			"version": "1.1.1",
			"format": "image/jpeg"
		},
		"img": "baselayers/satellite.png"
	};

	var layer3ConfSingle = {
		"id": "IT",
		"label": "Satélite",
		"url": "http://idecan3.grafcan.es/ServicioWMS/OrtoUrb",
		"tiled": true,
		"layersInfo": {
			"layers": ["OU"],
			"version": "1.1.1",
			"format": "image/jpeg"
		},
		"img": "baselayers/satellite.png"
	};


	registerSuite({
		name: "hello",

		"Init Layer": function () {
			layerItem = new Layer(layerConfTiled);

			console.log(layerItem.layer);

			assert.equal(layerItem.id, "OU", "Not layerID");
			assert.isNotOk(layerItem.isBaseLayer(), "Layer inserted with baselayer");
		},

		"Tiled or single": function() {
			layerItem = new Layer(layerConfSingle);

			assert.isOk(layerItem.isTiled(), "No single layer")
		},

		"Compare layers": function() {
			layerItem1 = new Layer(layerConfSingle);
			layerItem2 = new Layer(layerConfSingle);
			layerItem3 = new Layer(layer3ConfSingle);

			assert.isOk(layerItem1.equalTo(layerItem2), "No equal layers");
			assert.isNotOk(layerItem1.equalTo(layerItem3), "Equal layers");
		}
	});
});
