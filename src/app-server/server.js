require([
	"dojo/node!express"
	, "dojo/node!serve-favicon"
	, "dojo/node!jade"
	, "dojo/node!path"
	, "app-server/config"
], function(
	express
	, favicon
	, jade
	, path
	, config

){


	/* Express Application */
	var app = express(),
		appPort = process.env.PORT || config.port || 8002,
		env = process.env.NODE_ENV || 'development',
		__dirname = path.resolve(path.dirname(''));


	app.use(favicon(__dirname + '/public/resources/img/favicon.png'));
	app.set('view engine', 'jade');
	app.set('views', 'views');

	app.use(express.static('public'));
	app.use(express.static('src'));

	
	app.get('/', function (req, res) {
		res.render('index', { title: 'Autoridad Portuaria', message: 'Hello there!'});
	})

	
	app.listen(3000)

});