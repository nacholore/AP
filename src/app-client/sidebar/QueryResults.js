define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/query",
	"dojo/Deferred",
	"dijit/layout/TabContainer",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/StackContainer",
	"app-client/StackControllerNumber",
	"dojo/NodeList-dom"
], function (
	declare,
	lang,
	arrayUtil,
	query,
	Deferred,
	TabContainer,
	BorderContainer,
	ContentPane,
	StackContainer,
	StackController
) {
	return declare([ContentPane], {
		title: "Info",
		iconClass: 'fa fa-info-circle',
		map: null,
		
		postCreate: function() {
			lang.mixin(this, arguments);
			this.tab2layer = [];

			this.tabContainer = new TabContainer({
				style: "height: 100%; width: 100%;"
			});

			this.addChild(this.tabContainer);

			this.map.on("map-new-query", lang.hitch(this, this._cleanResults));
			this.map.on("map-response-query", lang.hitch(this, this._showFeature));

		},

		startup: function(){
			this.tabContainer.startup();
			this.tabContainer.resize();
		},

		_cleanResults: function() {
			for (var i = 0; i < this.tab2layer.length; i++) {
				var tab = this.tab2layer[i];
				tab && this.tabContainer.getIndexOfChild(tab) >= 0 && this.tabContainer.removeChild(tab);
			}
		},

		_showFeature: function(data) {
			for (var key in data) {
				var layer = data[key].layer,
					features = data[key].features;

				if (!this._isEmpty(features)) {
					var tab = new BorderContainer({
						style: 'padding: 10px;',
						title: layer.getLabel()
					});

					refCont = this._count(features) > 1 ? this._createStackContainer(tab) : tab;

					this._createContentByFeature(layer, features, refCont);

					this.tab2layer.push(tab);
					this.tabContainer.addChild(tab);
				}
			}

			this.tab2layer.length && this._focus();

		},

		_focus: function() {
			this.getParent().getParent().selectChild(this, true);
		},

		_isEmpty: function(featureCollection) {
			return featureCollection && featureCollection.features && featureCollection.features.length === 0;
		},

		_count: function(featureCollection) {
			return !this._isEmpty(featureCollection) && featureCollection.features.length || 0;
		},

		_createStackContainer: function(refCont) {
			var sc = new StackContainer({
				region: "center"
			});
			
			refCont.addChild(new StackController({
				region: "bottom",
				containerId: sc.id
			}));
			
			refCont.addChild(sc);

			return sc;
		},

		_createContentByFeature: function(layer, features, refCont) {
			arrayUtil.forEach(features.features, function(feature) {				

				var content = layer.getInfoTemplate();
				console.debug(content, feature.properties);	
				if (feature.foto) {
					arrayUtil.forEach(feature.foto, function(foto) {
						content += "<img class='thumbnail' src='" + foto + "'>";
					});
				}
				
				var feat = new ContentPane({
					title: layer.getLabel(),
					region: "center",
					"class": "form-horizontal",
					content: lang.replace(content, feature.properties)
				});
				refCont.addChild(feat);
			});
		}

	});
}); 