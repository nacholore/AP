/*
 *
 * Autor: Ignacio Lorenzo García
 * Email: nacholore@gmail.com
 * Fecha de creación: 03/03/2014
 *
 * Nombre: Home.js
 * Descripción: Botón con el cúal ir al maxExtent
 *
 */
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