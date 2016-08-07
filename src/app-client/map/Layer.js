define([
	"dojo/_base/declare"
	, "dojo/_base/lang"
	, "dojo/Evented"
	, "dojo/request/xhr"
	, "dojo/io-query"
	, "leaflet"
], function (
	declare
	, lang
	, Evented
	, xhr
	, ioQuery
	, L
) {
	return declare([Evented], {
		id: "",
		baselayer: false,
		name: "",
		url: "/geoserver/ap/wms",
		tiled: false,		
		layerL: null,


		constructor: function(args) {
			this.properties = {
				format: "image/png",
				service: "WMS",
				version: "1.1.1",
				layers: null,
				srs: "EPSG:4326"
			};

			this.featureInfo = {
				request: "GetFeatureInfo",
				query_layers: "ap:boya",
				info_format: "application/json",
				feature_count: 50
			};

			this.legendOptions = {
				request: "GetLegendGraphic",
				format: "image/jpeg",
				width: 15,
				height: 15
			}

			lang.mixin(this.properties, args.layersInfo);
			lang.mixin(this, args);
			delete this["layersInfo"]

			this.layerL = this._createLayer();
		},

		_createLayer: function() {
			return this.isTiled() ? 
				this._createTiledLayer() : this._createSingleLayer();
		},

		isTiled: function() {
			return this.tiled;
		},

		_createTiledLayer: function() {
			return new L.TileLayer.WMS(this.url, this._mixinProps());		
		},

		_createSingleLayer: function() {
			return new L.NonTiledLayer.WMS(this.url, this._mixinProps());
		},

		_mixinProps: function() {
			return this.properties;
		},

		isBaseLayer: function() {
			return this.baselayer;
		},

		equalTo: function(layer) {
			return this.id == layer.id;
		},

		getLayerL: function() {
			return this.layerL;
		},

		getFeatureInfo: function(query) {
			var self = this;
			this.emit("query-request");
			return xhr(this.url, {
				handleAs: "json",
				query: lang.mixin(query, this.featureInfo, this.properties),
				method: "GET"
			}).then(function(data) {
				self.emit("query-response");
			}, function(erro) {
				self.emit("query-error");
			});
		},

		_getQueryLegend: function() {
			var query =  {
				layer: this.properties.layers
			}
			return lang.mixin(query, this.legendOptions);
		},

		getLegend: function() {
			return url = this.url + "?" + ioQuery.objectToQuery(this._getQueryLegend());
		},

		getLabel: function() {
			return this.name;
		},

		clone: function() {
			return this._createLayer();
		}


	})
});