define({
	Tiled: {
		'id': 'OU',
		'label': 'Satélite',
		'default': true,
		'tiled': true,
		'url': 'http://idecan3.grafcan.es/ServicioWMS/OrtoUrb',
		'layersInfo': {
			'layers': ['OU'],
			'version': '1.1.1',
			'format': 'image/jpeg'
		},
		'img': 'baselayers/satellite.png'
	},

	Single: {
		'id': 'OU2',
		'label': 'Satélite',
		'url': 'http://idecan3.grafcan.es/ServicioWMS/OrtoUrb',
		'tiled': true,
		'layersInfo': {
			'layers': ['OU'],
			'version': '1.1.1',
			'format': 'image/jpeg'
		},
		'img': 'baselayers/satellite.png'
	},

	Template: {
		"id": "Usos",
		"name": "Usos",
		"type": "layer",
		"parent": "01_puep",
		"layersInfo": {
			"layers": ["AutoridadPortuaria:Usos"],
			"transparent": true
		},
		"infoTemplate": [
			"<div class='form-group'><div>Tipo</div><div>{tipo}</div></div>",
			"<div class='form-group'><div>Área</div><div>{area} m<sup>2</sup></div></div>",
			"<div class='form-group'><div>Puerto</div><div>{Puerto}</div></div>"
		]
	},

	Queryable: {
		"id": "Usos",
		"name": "Usos",
		"type": "layer",
		"parent": "01_puep",
		"layersInfo": {
			"layers": ["AutoridadPortuaria:Usos"],
			"transparent": true
		},
		"queryable": true
	}
})