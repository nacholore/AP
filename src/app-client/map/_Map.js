define([
	"dojo/_base/declare"
	, "dojo/_base/lang"
	, "dojo/Evented"
	, "dojo/promise/all"
	, "dijit/layout/_LayoutWidget"
	, "dojo/store/Memory"
	, "leaflet"
], function (
	declare
	, lang
	, Evented
	, all
	, _LayoutWidget
	, Memory
	, L
) {
	return declare([_LayoutWidget, Evented], {
		map: null,
		layers: null,
		baselayer: null,

		constructor: function() {
			lang.mixin(this, arguments);

			this.layers = new Memory({
						data: []
					});

			this.on("add-layer", this._addLayer);
			this.on("remove-layer", this._removeLayer);
			this.on("change-baselayer", this._changeBaselayer);
			this.on("map-new-query", this._removeFeature);
			this.on("map-new-query", this._manageQueryMarker);
		},

		addLayer: function(layer) {
			if (!this.layers.get(layer.id)) {
				this.layers.add(layer);

				if (!layer.isBaseLayer()) {
					this.emit("add-layer", layer)
				} else {
					if (!this.baselayer || this.baselayer && !this.baselayer.equalTo(layer))
						this.emit("change-baselayer", layer);
				}
			}
		},

		removeLayer: function(layer) {
			var layerId = typeof layer === 'string' ? layer : layer.id,
				layer = this.layers.get(layerId)

			if (layer) {
				this.layers.remove(layer.id);
				this.emit("remove-layer", layer);
			}
		},

		postCreate: function () {
			this._buildMap();
		},

		startup: function() {
			this.emit("ready");
		},

		_buildMap: function() {

			this.map = L.map(this.domNode, {
					center: [28.5, -16.0],
					doubleClickZoom: false,
					attributionControl: false,
					zoom: 12,
					crs: L.CRS.EPSG4326,
					uppercase: true
			}); 

			this.map.on("click", lang.hitch(this, this._getFeatureInfo));
		},
	
		_addLayer: function(layer, index) {
			layer.getLayerL().addTo(this.map);
			if (index == 0)
				layer.getLayerL().bringToBack();
			this.emit("layer-added", layer);
		},

		_removeLayer: function(layer) {
			this.map.removeLayer(layer.getLayerL());
			this.emit("layer-removed", layer);
		},

		_changeBaselayer: function(layer) {

			this.baselayer && this.removeLayer(this.baselayer);

			this.emit("add-layer", layer, 0);
			this.emit("basemap-changed", layer);
			
			this.baselayer = layer;
		},

		existsLayer: function(layerId) {
			return this.layers.get(layerId) ? true : false;
		},

		resize: function() {
			this.map.invalidateSize();
		},

		_getFeatureInfo: function(evt) {
			var self = this,
			  	size = this.map.getSize(),
				bounds = this.map.getBounds(),
				query = {
					"width": size.x,
					"height": size.y,
					"bbox": [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].join(','),
					"x": parseInt(evt.containerPoint.x),
					"y": parseInt(evt.containerPoint.y)
				};
			
			var listDfd = {};
			this.layers.query({}).map(function(item){
				if (!item.isBaseLayer() && item.isQueryable())
					listDfd[item.id] = item.getFeatureInfo(query);
			});

			if (Object.keys(listDfd).length) {
				this.emit("map-new-query", evt.latlng);

				all(listDfd).then(function(features) {
					self.emit("map-response-query", features);
				});
			}
		},

		_manageQueryMarker: function(latlng) {
			var marker = L.marker(latlng);
			
			this.lastQueryMarker && this.lastQueryMarker.remove();

			this.lastQueryMarker = marker;
			this.lastQueryMarker.addTo(this.map);
		},

		zoomToFeature: function(feature) {
			this._removeFeature();

			this._addFeature(feature);
			this.map.flyToBounds(this.layersFeatures.getBounds());
		},

		_addFeature: function(feature) {
			this.layersFeatures = new L.geoJson(feature, {}).addTo(this.map);
		},

		_removeFeature: function() {
			this.layersFeatures && this.map.removeLayer(this.layersFeatures);
		},

		setMaxBound: function(bound) {
			var maxBounds = {
					xmin: bound[0],
					ymin: bound[1],
					xmax: bound[2],
					ymax: bound[3]
				}
				southWest = new L.LatLng(maxBounds.ymin, maxBounds.xmin),
				northEast = new L.LatLng(maxBounds.ymax, maxBounds.xmax),
				bound = new L.LatLngBounds(southWest, northEast)
				center = bound.getCenter();

			this.map.setMaxBounds(bound);
			this.map.fitBounds(bound);
			//this.setView(center);
			this.emit("set-max-bounds", maxBounds);
		},

		getLayers: function() {
			return this.layers;
		},

		getCenter: function() {
			return this.map.getCenter();
		},

		getZoom: function() {
			return this.map.getZoom();
		},

		getScale: function() {
			return L.CRS.EPSG4326.scale(this.getZoom());
		}
	});
});