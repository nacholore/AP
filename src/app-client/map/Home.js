define([
	"dojo/_base/declare"
	, "dojo/_base/lang"
	, "dijit/_WidgetBase"
	, "leaflet"
	, "L-minimap"
	, "L-navBar"
	, "L-measure"
], function (
	declare
	, lang
	, _WidgetBase
	, L
	, MiniMap
) {
	return declare(_WidgetBase, {
		// Mapa
		// map: null,
		postCreate: function () {
			this.inherited(arguments);
			this._addHome();
			this._addMeasureTools();
			this.map.on("basemap-changed", lang.hitch(this, this._manageMinimap));
			this.map.on("ready", lang.hitch(this, this._addScaleBar));
		},

		_addHome: function() {
			L.control.navbar().addTo(this.map.map);		
		},

		_addMeasureTools: function() {
			L.control.measure({
				position: 'topleft',
				primaryLengthUnit: 'meters', 
				secondaryLengthUnit: 'kilometers',
				primaryAreaUnit: 'sqmeters', 
				secondaryAreaUnit: 'hectares',
				localization: 'es'
			}).addTo(this.map.map);
		},

		_manageMinimap: function(layerIn) {
			var layer = layerIn.clone();
			this.minimap ? this._changeLayerMinimap(layer) : this._createMinimap(layer);
		},

		_createMinimap: function(layer) {
			this.minimap = new MiniMap(layer, { 
					toggleDisplay: true,
					minimized: true,
				}).addTo(this.map.map);
		},

		_changeLayerMinimap: function(layer) {
			this.minimap.changeLayer(layer);
		},

		_addScaleBar: function() {
			L.control.scale().addTo(this.map.map);
		}

	});
});