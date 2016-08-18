define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/request/xhr",
	"dijit/layout/ContentPane",
	"cbtree/Tree",
	"cbtree/model/TreeStoreModel",
	"app-client/map/Layer",
	"cbtree/store/Hierarchy",
	"cbtree/store/extensions/Ancestry"
], function (
	declare,
	arrayUtil,
	lang,
	on,
	xhr,
	ContentPane,
	Tree,
	TreeStoreModel,
	Layer,
	Hierarchy
) {
	return declare([ContentPane], {
		title: "Capas",
		iconClass: "fa fa-sitemap",
		map: null,
		_store: null,
		_model:null,

		postCreate: function () {
			lang.mixin(this, arguments);
			this._loadData();
		},

		// Carga la estructura del árbol de las capas
		_loadData: function() {
			xhr("/conf/capas.json", {
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

		// Evento que se lanza cuando se selecciona o deselecciona una capa
		// en el árbol
		_onSelectingLayer: function(node, widget, evt) {
			
			// Obtiene los hijos del nodo seleccionado
			var nodes = this._store.getDescendants(node);

			// Si no tiene hijos añade el item seleccionado
			if (nodes.length === 0)
				nodes = [node];
						
			// Recorre la lista de nodos
			arrayUtil.forEach(nodes, function(item) {

				// Se descartan los nodos carpetas
				if (item.type === "layer") {
					if (item.checked) {
						var layer = new Layer(item);
						this.map.addLayer(layer);
					} else {
						this.map.removeLayer(item.id);
					}
				}
			}, this);
		}
	});
});
 