var memcache = require('memcache');
var cfg = require('./config');

var client = new memcache.Client(cfg.memcache.port, cfg.memcache.host);

client.on('connect', function(){});

client.on('close', function(){});

client.on('timeout', function(){console.log('memcache socket timeout');});

client.on('error', function(e){console.log('memcache error', e);});

// connect to the memcache server after subscribing to some or all of these events
client.connect()

var generate_code = function(callback){
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz123456789";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}

	client.get(randomstring, function(error, result){
		if(result){
			generate_code();
		}else{
			if(callback)
				callback(randomstring);
		}
	});
}

exports.init = function(app) {
	app.use(function(req, res, next){

		req.memcache = client;
		req.generate_code = generate_code;

		if(typeof req.headers[cfg.header.toLowerCase()] !== 'undefined'){
			client.get(
				req.headers[cfg.header.toLowerCase()],
				function(error, result){
					if(result){
						req.user = parseInt(result.toString());
					}
					next();
				}
			);
		}else{
			next();
		}
	});
}