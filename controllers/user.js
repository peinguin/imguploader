var cfg = require('./../config');

var post = {
	'spec': {
		"description" : "Register new user",
		"path" : "/user.{format}",
		"notes" : "Register new user",
		"summary" : "Register new user",
		"method": "POST",
		"params" : [
			{
				"paramType": "body",
	            "name": "User",
	            "description": "User to register",
	            "dataType": "User",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "User",
		"errorResponses" : [],
		"nickname" : "registerUser"
	},
	'action': function (req,res) {
		req.db.models.users.create(
			[
				{
					email: req.body.email,
					password: req.body.password
				}
			], function (err, items) {
			    if(err){
			    	res.send(401, JSON.stringify(err));
			    }else{
			    	req.generate_code(function(code){
						req.memcache.set(code, items[0].id, function(){
							res.header(cfg.header,  code);
							res.send(JSON.stringify({user:items[0],header:code}));
						});
					});
			    }
			}
		);
	}
};

var email = {
	'spec': {
		"description" : "Get users email",
		"path" : "/user.{format}/email",
		"notes" : "Get users email",
		"summary" : "Get users email",
		"method": "GET",
		"responseClass" : "string",
		"nickname" : "userEmail"
	},
	'action': function (req,res) {
		if(req.user){
			req.db.models.users.get(req.user, function(err, User){
				if(err){
					res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
				}else{
					res.send(200, JSON.stringify({email: User.email}));
				}
			});
		}else{
			res.send(403, JSON.stringify({code: 403, header: 'Forbidden', message: 'You have to log in'}));
		}
	}
};

var get = {
	'spec': {
		"description" : "Get user info",
		"path" : "/user.{format}",
		"notes" : "Get user info",
		"summary" : "Get user info",
		"method": "GET",
		"responseClass" : "string",
		"nickname" : "getUser"
	},
	'action': function (req,res) {
		if(req.user){
			req.db.models.users.get(req.user, function(err, User){
				if(err){
					res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
				}else{

					User.password = undefined;

					res.send(200, JSON.stringify(User));
				}
			});
		}else{
			res.send(403, JSON.stringify({code: 403, header: 'Forbidden', message: 'You have to log in'}));
		}
	}
};

var change = {
	'spec': {
		"description" : "Change user info",
		"path" : "/user.{format}",
		"notes" : "Change user info",
		"summary" : "Change user info",
		"method": "PUT",
		"responseClass" : "string",
		"nickname" : "chengeUser",
		"params" : [
			{
				"paramType": "body",
	            "name": "User",
	            "description": "User data",
	            "dataType": "User",
	            "required": true,
	            "allowMultiple": false
			}
		],
	},
	'action': function (req,res) {
		if(req.user){
			req.db.models.users.get(req.user, function(err, User){
				if(err){
					res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
				}else{
					if(req.body.email){
						User.email = req.body.email;
					}
					if(req.body.password){
						User.password = req.body.password;	
					}
					User.save(function(err){
						if(err){
							res.send(401, JSON.stringify(err));
						}else{
							res.send(200, JSON.stringify({status: 'OK'}));
						}
					});
				}
			});
		}else{
			res.send(403, JSON.stringify({code: 403, header: 'Forbidden', message: 'You have to log in'}));
		}
	}
};

exports.post = post;
exports.email = email;
exports.get = get;
exports.change = change;