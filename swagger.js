var swagger = require("swagger-node-express"),
	models = require("./models"),
	controllers = require('./controllers'),
	cfg = require('./config'),
	express = require("express");

module.exports = exports = function (app) {

	app.use(function(req, res, next) {
	    res.header('Access-Control-Allow-Origin', '*');
	    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	    res.header('Access-Control-Allow-Headers',  cfg.header+', Content-Type');
	    res.header('Access-Control-Expose-Headers', cfg.header+', Content-Type');

	    if (req.method == 'OPTIONS') {
	        res.send(200);
	    }
	    else {
	        next();
	    }
	});

	swagger.setAppHandler(app);
	swagger.addModels(models);
	controllers.init(swagger);
	swagger.configure(cfg.basePath, "0.1");
	// Serve up swagger ui at /docs via static route
	var docs_handler = express.static(__dirname + '/../documentation/swagger/');
	app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
		if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
			res.writeHead(302, { 'Location' : req.url + '/' });
			res.end();
			return;
		}
		// take off leading /docs so that connect locates file correctly
		req.url = req.url.substr('/docs'.length);
		return docs_handler(req, res, next);
	});
}