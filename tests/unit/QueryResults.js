define([
	'intern!object'
	, 'intern/chai!assert'
	, 'app-client/map/_Map'
	, 'app-client/sidebar/QueryResults'
], function (
	registerSuite
	, assert
	, _Map
	, QueryResults
) {
	var mapItem, queryItem,
		empty = {"type":"FeatureCollection","totalFeatures":"unknown","features":[],"crs":null},
		full = {"type":"FeatureCollection","totalFeatures":"unknown","features":[{"type":"Feature","id":"Zonificacion_marina.20","geometry":{"type":"MultiPolygon","coordinates":[[[[373530.51351544,3144612.06737813],[387850.33085118,3155299.48587894],[387910.32696918,3155296.39403161],[387950.41942061,3155292.39168298],[387996.14406055,3155297.89147682],[388023.13517327,3155287.29320862],[388037.77158875,3155296.09446686],[388041.57729818,3155322.25261616],[388060.04122976,3155365.70769981],[388098.30672934,3155427.93976442],[390298.80749553,3152479.42416321],[375176.19849553,3141193.30016321],[373106.24484738,3143966.89041338],[373156.36796921,3144183.24561756],[373158.51188893,3144182.74963599],[373396.61774878,3144331.42967737],[373460.67228356,3144431.9561498],[373467.8779939,3144484.51277665],[373530.51351544,3144612.06737813],[373530.51351544,3144612.06737813]]]]},"geometry_name":"the_geom","properties":{"layer":"$_ZONA_II","area":14738259,"zonaid":null,"puertoid":1,"tipoid":1,"obid":null,"fechaactual":null,"fechabaja":"99999999","tipo":"Zona II","Puerto":"Santa Cruz de Tenerife","valor_m":null}}],"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG::32628"}}};
	
	registerSuite({
		name: "QueryResults",
		setup: function() {
			mapItem = new _Map({});
			queryItem = new QueryResults({
				map: mapItem
			});
		},

		'Feature empty': function () {	
			assert.isOk(queryItem._isEmpty(empty), 'Should return "true"');
		},

		'Feature full': function () {
			assert.isNotOk(queryItem._isEmpty(full), 'Should return "false"');
		},

		'Count feature empty': function () {
			assert.equal(queryItem._count(empty), 0, 'Should return 0');
		},

		'Count feature': function () {
			assert.equal(queryItem._count(full), 1, 'Should return 1');
		}
	});
});
