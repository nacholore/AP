define([
	"dojo/_base/declare",
	"dijit/form/Button"
], function (
	declare,
	Button
) {
	return declare([Button], {
		// Mapa
		// map: null,
		iconClass: "icon-home",

		onClick: function(val) {
			this.map.zoomToMaxExtent();
		},

		postCreate: function () {
			this.inherited(arguments);
		}
	});
});