var cfg = require('./../config'),
	url = require("url");

var connect_by = function(service, id, email, req, res){

	var cond = {};
	cond[service] = id;

	req.db.models.users.find(cond, function(err, user){
		if(err){
			res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
		}else{
			if(user.length > 0){
				user = user[0];
				if(req.user){
					if(req.user == user.id){
						user[service] = id;
						user.save(function (err) {
							res.send(200);
						});
					}else{
						res.send(401, JSON.stringify({error:"This "+service+" account already used by other user"}));
					}
				}else{
					req.generate_code(function(code){
						req.memcache.set(code, user.id, function(){
							res.header(cfg.header,  code);
							res.send(code);
						});
					});
				}
			}else{
				if(req.user){
					req.db.models.users.get(req.user, function(err, user){
						if(err){
							res.send(500, JSON.stringify(err));
						}else{
							user[service] = id;
						    user.save(function (err) {
								res.send();
							});
						}
					});
				}else{
					req.db.models.users.find({email: email}, function(err, finded_user){

						var user = {};

						if(finded_user.length == 0){
							user.email = email;
						}

						user[service] = id;

						req.db.models.users.create(
							[user], function (err, items) {
							    if(err){
							    	res.send(JSON.stringify(err));
							    }else{

							    	var finded_user = items[0];

							    	req.generate_code(function(code){
										req.memcache.set(code, finded_user.id, function(){
											res.header(cfg.header,  code);
											res.send(code);
										});
									});
							    }
							}
						);
					});
				}
			}
		}
	});
}

var post = {
	'spec': {
		"description" : "User auth",
		"path" : "/auth.{format}",
		"notes" : "User auth",
		"summary" : "User auth",
		"method": "POST",
		"params" : [
			{
				"paramType": "body",
	            "name": "User",
	            "description": "User credentials",
	            "dataType": "User",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "authUser"
	},
	'action': function (req,res) {
		req.db.models.users.find(
			{email: req.body.email||'', password:req.body.password||''},
			function(err, user){
			if(err){
				console.log(err);
				res.send(JSON.stringify(err));
			}else{
				if(user.length != 1){
					res.status(404);
					res.send(JSON.stringify({code: '404', header: 'not found',message: 'User not found'}));
				}else{
					var finded_user = user.pop();
					req.generate_code(function(code){
						req.memcache.set(code, finded_user.id, function(){
							res.header(cfg.header,  code);
							res.send();
						});
					});
				}
			}
		});
	}
};

var facebook = {
	'spec': {
		"description" : "User facebook auth",
		"path" : "/auth.{format}/facebook",
		"notes" : "User auth",
		"summary" : "User auth",
		"method": "POST",
		"params" : [
			{
				"paramType": "body",
	            "name": "FacebookKEY",
	            "description": "Fasebook API key",
	            "dataType": "string",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "authUserFacebook"
	},
	'action': function (req,res) {
		var FB = new (require('facebook-node-sdk'))({ appId: cfg.facebook.appID, secret: cfg.facebook.secret });

		FB.setAccessToken(req.body.FacebookKEY);

		FB.api('/me', function(err, data) {
			connect_by('facebook', data.id, data.email, req, res);
		});
	}
};

var del = {
	'spec': {
		"description" : "Logout",
		"path" : "/auth.{format}",
		"notes" : "Logout",
		"summary" : "Logout",
		"method": "DELETE",
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "logoutUser"
	},
	'action': function (req,res) {
		if(req.user){
			req.memcache.delete(req.headers[cfg.header.toLowerCase()], function(){
				res.send(undefined);
			});
		}else{
			res.send(403, JSON.stringify({code: 403, header: 'Forbidden', message: 'You have to log in'}));
		}
	}
};

exports.post = post;
exports.del = del;

exports.facebook = facebook;