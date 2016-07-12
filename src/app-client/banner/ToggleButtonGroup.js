define([
	"dojo/_base/declare",
	"dojo/on",
	"dijit/_WidgetBase",
	"dijit/registry"
], function (
	declare,
	on,
	_WidgetBase,
	registry
) {
	return declare([_WidgetBase ], {
		_widgets: null,
		
		startup: function() {
			alert("Hola");
			console.debug(this.domNode);
			this._widgets = registry.findWidgets(this.domNode);
			var self = this;
			alert("Hola");
			console.debug(this._widgets);
			this._widgets.forEach(function(widget) {
				widget.on("change",function(evt) {
					alert("Entro");
					// Si está seleccionado no se puede deseleccionar
					if (!this.get("checked")) {
						return false;
					} else {
						self._widgets.forEach(function(item) {
							if (item != widget)
								item.set("checked", false);
						});
						return true;
					}
				});
			});
		},
		
		checked: function(widget) {
			this._widgets.forEach(function(item) {
				if (item != widget) {
					item.set("checked", false);
				} else {
					item.set("checked", true);
 				}
			});
		}
	});
});