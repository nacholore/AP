define([
	'dojo/_base/declare'
	, 'dojo/_base/lang'
	, 'dijit/layout/StackContainer'
	, 'app-client/sidebar/ShowMessage'
	, 'app-client/sidebar/ShowQueryResults'
], function (
	declare
	, lang
	, StackContainer
	, ShowMessage
	, ShowQueryResults
) {
	return declare([StackContainer], {
		title: 'Info',
		iconClass: 'fa fa-map-pin',
		map: null,
		
		postCreate: function() {
			lang.mixin(this, arguments);

			this.cpMessage = new ShowMessage({
				icon: "fa-map",
				message: "Haga click en el mapa"
			});

			this.tcResults = new ShowQueryResults({
				style: 'height: 100%; width: 100%;'
			});

			this.addChild(this.cpMessage);
			this.addChild(this.tcResults);

			this.map.on('map-new-query', lang.hitch(this, this._cleanResults));
			this.map.on('map-response-query', lang.hitch(this, this._showFeature));

		},

		_cleanResults: function() {
			this.tcResults.cleanResults();
			this.cpMessage.setContent(null, 'fa-spinner', true);
			this.selectChild(this.cpMessage, true);

			this.getParent().getParent().selectChild(this, true);
		},

		_showFeature: function(data) {
			if (this._isEmptyAllResults(data)) {
				this.cpMessage.setContent('No hay datos para ese lugar', 'fa-flag', false);
				this.selectChild(this.cpMessage, true);
			} else {
				this.selectChild(this.tcResults, true);
				this.tcResults.showFeature(data);
			}
		},

		_isEmptyAllResults: function(data) {
			for (var key in data) {
				console.debug("entro", key, data)
				if (data[key].features.features.length)
					return false;
			}
			return true;
		},

		_focus: function() {
			this.getParent().getParent().selectChild(this, true);
		}
	});
}); 