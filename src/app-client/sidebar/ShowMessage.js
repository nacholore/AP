define([
	'dojo/_base/declare'
	, 'dojo/_base/lang'
	, 'dojo/dom-construct'
	, 'dojo/dom-class'
	, 'dijit/layout/ContentPane'
], function (
	declare
	, lang
	, domConstruct
	, domClass
	, ContentPane
) {
	return declare([ContentPane], {
		'class': 'message center',
		classBaseIcon: 'fa fa-5x fa-fw',
		spinIcon: false,

		postCreate: function() {
			lang.mixin(this, arguments);
			
			var contNode = domConstruct.create('div', {'class': 'contentMsg'}, this.containerNode);
			this.iconNode = domConstruct.create('i', {'class': this.classBaseIcon }, contNode);
			this.titleNode = domConstruct.create('div', {'class': 'title', innerHTML: this.message }, contNode);

			this._setIcon(this.icon, this.spinIcon);
		},

		_setIcon: function(icon, spin) {
			domClass.replace(this.iconNode, icon, this.icon);
			domClass[spin ? "add" : "remove"](this.iconNode, 'fa-pulse');
			this.icon = icon;
		},


		setContent: function(message, icon, spin) {
			this.titleNode.innerHTML = message;
			this._setIcon(icon, spin);
		}

	});
}); 