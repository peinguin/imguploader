var restricted = {
	'GET':[
		/^\/user(\.format)?\/email$/,
		/^\/user(\.format)?$/
	],
	'PUT':[
		/^\/user(\.format)?$/,
		/^\/images(\.json)?\/\d+$/,
		/^\/tag(\.json)?\/\d+$/
	],
	'DELETE': [
		/^\/auth(\.json)?$/,
		/^\/images(\.json)?\/\d+$/,
		/^\/tag(\.json)?\/\d+$/
	],
	'POST': [
		/^\/images(\.json)?$/,
		/^\/tag(\.json)?\/\d+$/
	]
};

exports = module.exports = function (req, res, next) {
	if(typeof restricted[req.method] != 'undefined'){
		for(var i in restricted[req.method]){
			if(!req.user && req.url.match(restricted[req.method][i])){
				return res.send(403, JSON.stringify({code: 403, header: 'Forbidden', message: 'You have to log in'}));
			}
		}
	}
	next();
	
}