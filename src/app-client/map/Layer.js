define([
	"dojo/_base/declare"
	, "dojo/_base/lang"
	, "leaflet"
	, "L-notTiled/NonTiledLayer"
	, "L-notTiled/NonTiledLayer.WMS"
], function (
	declare
	, lang
	, L
) {
	return declare(null, {
		id: "",
		baselayer: false,
		name: "",
		url: "/geoserver/ap/wms",
		tiled: false,		
		layerL: null,

		constructor: function(args) {
			this.properties={
				format: "image/png"
			};

			lang.mixin(this, args);
			this._createLayer();
		},

		_createLayer: function() {
			this.layerL = this.isTiled() ? 
				this._createTiledLayer() : this._createSingleLayer();
		},

		isTiled: function() {
			return this.tiled;
		},

		_createTiledLayer: function() {
			return L.tileLayer.wms(this.url, this._mixinProps());		
		},

		_createSingleLayer: function() {
			return new L.NonTiledLayer.WMS(this.url, this._mixinProps());
		},

		_mixinProps: function() {
			var props = lang.mixin(this.properties, this.layersInfo);
			console.debug(props);
			return lang.mixin(this.properties, this.layersInfo);
		},

		isBaseLayer: function() {
			return this.baselayer;
		},

		addTo: function(map) {
			this.layer.addTo(map);
		},

		equalTo: function(layer) {
			return this.id == layer.id;
		},

		getLayerL: function() {
			return this.layerL;
		}
	});
});