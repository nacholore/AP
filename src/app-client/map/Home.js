define([
	"dojo/_base/declare"
	, "leaflet"
	, "dijit/_WidgetBase"
	, "L-navBar"
	, "L-measure"
], function (
	declare
	, L
	, _WidgetBase
) {
	return declare(_WidgetBase,{
		// Mapa
		// map: null,

		postCreate: function () {
			this.inherited(arguments);
			this.addHome();
			this.addMeasureTools();
		},

		addHome: function() {
			L.control.navbar().addTo(this.map.map);		
		},

		addMeasureTools: function() {
			L.control.measure({
				position: 'topright',
				primaryLengthUnit: 'meters', 
				secondaryLengthUnit: 'kilometers',
				primaryAreaUnit: 'sqmeters', 
				secondaryAreaUnit: 'hectares',
				localization: 'es'
			}).addTo(this.map.map);
		}
	});
});