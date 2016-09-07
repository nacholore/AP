define([
	"dojo/_base/declare"
	, "dojo/_base/lang"
	, "dojo/Evented"
	, "dojo/request/xhr"
	, "dojo/Deferred"
	, "dojo/io-query"
	, "leaflet"
], function (
	declare
	, lang
	, Evented
	, xhr
	, Deferred
	, ioQuery
	, L
) {
	return declare([Evented], {
		id: "",
		baselayer: false,
		service: "WMS",
		format: "image/png",
		name: "",
		tiled: false,		
		layerL: null,
		srs: "EPSG:4326",
		uppercase: true,
		version: "1.1.1",
		transparent: true,
		legend: true,
		maxZoom: 21,

		props: ["opacity", "service", "name", "url", "format", "layers", "srs", "version", "transparent"],
		constructor: function(args) {
			this.url = window.location.protocol + "//" + window.location.hostname + "/geoserver/wms";
			this.properties = {
				format: "image/png",
				service: "WMS",
				version: "1.1.1",
				layers: null,
				srs: "EPSG:4326"
			};

			this.featureInfo = {
				request: "GetFeatureInfo",
				query_layers: null,
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
			lang.mixin(this, args.layersInfo);
			lang.mixin(this, args);
			this.featureInfo["query_layers"] = this.properties["layers"];
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
			return new L.TileLayer.WMS(this.url, this._getPropertiesL());		
		},

		_createSingleLayer: function() {
			return new L.NonTiledLayer.WMS(this.url, this._getPropertiesL());
		},

		_getPropertiesL: function() {
			var props = this._getProperties();
			props['uppercase'] = this.uppercase;
			props['maxZoom'] = this.maxZoom;
			return props;
		},

		_getProperties: function() {
			return {
				format: this.get("format"),
				service: this.get("service"),
				version: this.get("version"),
				layers: this.get("layers"),
				srs: this.get("srs"),
				transparent: this.get("transparent")
			};
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

		getFeatureInfo: function(query, uid) {
			var self = this,
				dfd = new Deferred();
				
			this.queryInProgress && this.queryInProgress.cancel('New request query');

			this.queryInProgress = xhr(this.url, {
				handleAs: "json",
				query: lang.mixin(query, this.featureInfo, this.properties),
				method: "GET"
			}).then(function(features){
				dfd.resolve({
					layer: self,
					features: features
				});
			}, function(error) {
				dfd.reject(error);
			});

			return dfd.promise;
		},

		_getQueryLegend: function() {
			var query =  {
				layer: this.properties.layers
			}
			return lang.mixin(query, this.legendOptions);
		},

		clone: function() {
			return this._createLayer();
		},

		isQueryable: function() {
			return this.queryable || this.infoTemplate
		},

		getLabel: function() {
			return this.name;
		},

		getInfoTemplate: function() {
			return this.infoTemplate && this.infoTemplate.join('');
		},

		get: function(name) {
			if (this.props.indexOf(name)) {
				return this[name];
			}
		},

		getLegendUrl: function() {
			return this.hasLegend() && this.url + "?" + ioQuery.objectToQuery(this._getQueryLegend());
		},

		hasLegend: function() {
			return !this.isBaseLayer() && this.legend;
		},

		getSizeLegend: function() {
			return this.hasLegend() && this.legendSize;
		},

		setSizeLegend: function(size) {
			this.legendSize = size;
		}
	})
});