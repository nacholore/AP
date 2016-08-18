define([
	"dojo/_base/declare"
	, "dojo/_base/lang"
	, "dojo/Evented"
	, "dojo/request/xhr"
	, "dijit/layout/BorderContainer"
	, "dijit/layout/ContentPane"
	, "dijit/form/TextBox"
	, "dgrid/Grid"
	, 'dojo/dom-construct'
	, "dgrid/extensions/DijitRegistry"

], function (
	declare
	, lang
	, Evented
	, xhr
	, BorderContainer
	, ContentPane
	, TextBox
	, Grid
	, domConstruct
	, DijitRegistry
) {
	return declare([BorderContainer, Evented], {
		title: "Buscador",
		iconClass: "icon-search",
		url: "/api/greeting",
		minLenght: 1,

		constructor: function() {
			this.lastQuery = {
				text: null,
				layers: null
			}

			this.newQuery = {
				text: null,
				layers: null
			}

			lang.mixin(this, arguments);

			this.on("search-new", this._newQuery);
			this.on("search-results", this._newFeatures);
			this.on("search-new, search-clear-results", this._clearResults);
		},

		postCreate: function() {
			this.inherited(arguments);
			this._createSearchBox();
			this._createResultList();		
		},

		_createSearchBox: function() {
			this.textBoxSearch = new TextBox({
				placeHolder: "Texto a buscar",
				intermediateChanges: true,
				style: "width:  calc(100% - 4px)",
				onChange: lang.hitch(this, this._newRequestTextSearch)
			});
			
			var textCP = new ContentPane({
				region: "top",
				style: "padding: 10px 0"
			});

			textCP.addChild(this.textBoxSearch);

			this.addChild(textCP);
		},

		_newRequestTextSearch: function(value) {
			if (value.trim().length > this.minLenght) {
				this._newRequestSerch();
			} else {
				this.emit("search-clear-results");
			}
			this.newQuery.text = value.trim();
		},

		_newRequestSerch: function() {
			if (this._hasChangedQuery()) {
				this.lastXHR && this.lastXHR.cancel();
				this.emit("search-new", this.newQuery);
			}
		},

		_hasChangedQuery: function() {
			return this.lastQuery.text != this.newQuery.text 
				|| this.lastQuery.layers != this.newQuery.layers;
		},


		_newQuery: function(query) {
			var self = this;
			
			this.lastQuery = lang.clone(query);
			this.lastXHR = xhr(this.url, {
				handleAs: "json",
				query: query,
				method: "GET"
			}).then(function(data) {
				self.emit("search-results", data);
			}, function(error) {
				self.emit("search-error", error)
			});
		},

		_getQuery: function(value) {
			return this.newQuery;
		},


		_createResultList: function() {
			this.grid = new (declare([ Grid, DijitRegistry ]))({
				columns: [{
						label: 'First Name',
						field: 'properties.description'
					},
					{
						label: 'Last Name',
						field: 'coordinates'
					}],
				pagingLinks: 1,
        		pagingTextBox: true,
        		firstLastArrows: true,
		        pageSizeOptions: [10, 15, 25],
				showHeader: false,
				renderRow: this._renderRow,
				region: "center"
			});

			this.grid.on('.dgrid-content .dgrid-row .zoomToFeature:click', lang.hitch(this, this.zoomToFeature));
			this.addChild(this.grid)

		},

		_renderRow: function (obj) {

			var node = domConstruct.create('div', {
				innerHTML: '<div class="featureRow"><div class="left">' + 
								'<span class="title">' + obj.properties.code + '</span>' +
								'<span class="subtitle">' + obj.properties.titular + '</span>' +
								'<span class="port">' + obj.properties.port + '</span>' +

						   '</div>' +
						   // Icono de zoom
						   '<div class="right zoomToFeature"><i class="icon-map-marker" aria-hidden="true"></i></div></div>'
			});
 
			return node;
		},



		zoomToFeature: function(evt) {
			var feature = this.grid.cell(evt).row.data;
			this.map.zoomToFeature(feature)
		},

		_newFeatures: function(features) {
			this.grid.refresh();
			this.grid.renderArray(features);
		},

		onShow:function() {
			this.textBoxSearch.focus();
		},

		_clearResults: function() {
			this.grid.refresh();
		}
	});
});
 
