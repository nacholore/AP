require([
	"dojo/node!express"
	, "dojo/node!path"
], function(
	express
	,path
){

	var app = express()
	var __dirname = path.resolve(path.dirname(''));
	
	app.get('/', function (req, res) {
		//res.send(__dirname)
		res.sendFile(path.join(__dirname + '/index.html'));
	})

	app.use(express.static('public'));
	app.use(express.static('src'));

	app.listen(3000)

});