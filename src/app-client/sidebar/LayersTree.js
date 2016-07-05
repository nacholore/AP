/*
 *
 * Autor: Ignacio Lorenzo García
 * Email: nacholore@gmail.com
 * Fecha de creación: 03/06/2013
 *
 * Nombre: LayersWidget.js
 * Descripción: Crea un widget donde muestra un árbol
 *		con todas las capas disponibles. Permite
 *		activar o desactivar su visualización
 *		individualmente.
 *
 */
define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/request/xhr",
	"dojo/when",
	"dijit/layout/ContentPane",
	"cbtree/Tree",
	"cbtree/model/TreeStoreModel",
	"app-client/map/WMSLayer",
	"cbtree/store/Hierarchy",
	"cbtree/store/extensions/Ancestry",

], function (
	declare,
	arrayUtil,
	lang,
	on,
	xhr,
	when,
	ContentPane,
	Tree,
	TreeStoreModel,
	WMSLayer,
	Hierarchy
) {
	return declare([ContentPane], {
		title: "Capas",
		map: null,
		_store: null,
		_model:null,

		// Evento que se lanza cuando se selecciona o deselecciona una capa
		// en el árbol
		_onSelectingLayer: function(node, widget, evt) {
			
			// Estado del node sobre el que se ha hecho click
			var newState = widget.get("checked");

			// Obtiene los hijos del nodo seleccionado
			var nodes = this._store.getDescendants(node);

			// Si no tiene hijos añade el item seleccionado
			if (nodes.length === 0)
				nodes = [node];
						
			// Recorre la lista de nodos
			arrayUtil.forEach(nodes, function(item) {

				// Se descartan los nodos carpetas
				if (item.type === "layer") {
					var layer = this.map.getLayer(item.id);

					if (layer) {
						// La capa está creada y cargada en el mapa
						layer.set("visible", newState);

					} else {
						// La capa no existe
						var layer = new WMSLayer({
							layerId: item.id,
							url: item.url || dojoConfig.geoserver.wms,
							opacity: 0.9,
							name: item.name,
							infoTemplate: item.infoTemplate,
							layersInfo: item.layersInfo
						});
						this.map.addLayer(layer);
					}
				}
			}, this);
		},
		
		// Carga los datos desde el servidor
		_loadData: function() {
			xhr( dojoConfig.pathLayers + "Layers.json", {
				handleAs: "json"
			}).then(lang.hitch(this, this.buildTree));
		},

		// Construye el árbol
		buildTree: function(data) {
			this._store = new Hierarchy({
				data: data.data
			});
			
			this._model = new TreeStoreModel({
				store: this._store,
				query: {
					id: "layers"
				},
				rootLabel: "Puertos de Tenerife",
				checkedRoot: true
			});

			this._tree = new Tree({
				model: this._model,
				showRoot: false,
				"class": "full-height"
			}).placeAt(this.containerNode);

			this._tree.on("checkBoxClick", 
				lang.hitch(this, this._onSelectingLayer));
		},

		postCreate: function () {
			lang.mixin(this, arguments);
			this._loadData();
		}
	});
});
 