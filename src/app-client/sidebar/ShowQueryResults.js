define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/number',
	'dijit/layout/TabContainer',
	'dijit/layout/BorderContainer',
	'dijit/layout/ContentPane',
	'dijit/layout/StackContainer',
	'app-client/StackControllerNumber'
], function (
	declare,
	lang,
	arrayUtil,
	number,
	TabContainer,
	BorderContainer,
	ContentPane,
	StackContainer,
	StackController
) {
	return declare([TabContainer], {
		style: 'height: 100%; width: 100%;',
		
		postCreate: function() {
			lang.mixin(this, arguments);
			this.tab2layer = [];
		},

		cleanResults: function() {
			for (var i = 0; i < this.tab2layer.length; i++) {
				var tab = this.tab2layer[i];
				tab && this.getIndexOfChild(tab) >= 0 && this.removeChild(tab);
			}
		},

		showFeature: function(data) {
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
					this.addChild(tab);
				}
			}
		},

		_isEmpty: function(featureCollection) {
			return featureCollection && featureCollection.features && featureCollection.features.length === 0;
		},

		_count: function(featureCollection) {
			return !this._isEmpty(featureCollection) && featureCollection.features.length || 0;
		},

		_createStackContainer: function(refCont) {
			var sc = new StackContainer({
				region: 'center'
			});
			
			refCont.addChild(new StackController({
				region: 'bottom',
				containerId: sc.id
			}));
			
			refCont.addChild(sc);

			return sc;
		},

		_createContentByFeature: function(layer, features, refCont) {
			arrayUtil.forEach(features.features, function(feature) {				
				var content = layer.getInfoTemplate();
					
				this._cleanFeature(feature.properties);
				
				feature.properties.photos && feature.properties.photos.forEach(function(fotoUrl) {
					content += '<img class="thumbnail" src="' + fotoUrl + '">';
				});

				refCont.addChild(new ContentPane({
					title: layer.getLabel(),
					region: 'center',
					'class': 'form-horizontal',
					content: lang.replace(content, feature.properties)
				}));
			}, this);
		},

		_cleanFeature: function(props) {
			var photos = []
			for (var key in props) {
				var value = props[key];

				if (!this._isPropEmpty(value)) {
					if (!isNaN(props[key]))
						props[key] = number.format(value, { places: 2})
					else if (props[key] && this._isPropPhoto(key)) {
						photos.push(props[key]);
						delete props[key];
					}
				}
			}
			if (photos.length)
				props['photos'] = photos;

			return props;
		},

		_isPropPhoto: function(key) {
			return key.match(/foto\d*/);
		},

		_isPropEmpty: function(value) {
			var empty = false;
			if (value) {
				if (typeof value === 'string' && value.match(/"(null)?"|'(null)?'/))
					empty = true;
			}
			return empty;
		}

	});
}); 