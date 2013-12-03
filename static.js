var express = require("express");

module.exports = exports = function(app){
	var main_handler = express.static(__dirname + '/client/');
	app.get(/^\/(.*)$/, function(req, res, next) {
		if(!req.url){
			req.url = 'index.html';
		}
		return main_handler(req, res, next);
	});
}