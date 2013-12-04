var cfg = require('../config');
var Kaiseki = require('kaiseki');

var clone = function(a){
	var new_obj = {};
	for(var i in a){
		new_obj[i] = a[i]
	}
	return new_obj;
}

var get = {
	'spec': {
		"description" : "Get image",
		"path" : "/images.{format}/{id}",
		"notes" : "Get image",
		"summary" : "Get image by Id",
		"method": "GET",
		"params" : [
			{
				"paramType": "path",
	            "name": "id",
	            "description": "Image Id",
	            "dataType": "int",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "Image",
		"errorResponses" : [],
		"nickname" : "getImage"
	},
	'action': function (req,res) {
		if (!req.params.id) {
	      throw swagger.errors.invalid('id'); }
	    var id = parseInt(req.params.id);

		req.db.models.images.get(id, function(err, image){
			if(err){
				res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
			}else{
				if(image){

					image = clone(image);
					req.db.models.tags.find({image_id: image.id}, function(err, tags){
						if(err){
							res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
						}else{
							image.tags = [];
							for(var i in tags){
								image.tags.push(tags[i].toJSON);
							}
							res.send(200, JSON.stringify(image));
						}
					});
				}else{
					throw swagger.errors.notFound('image');
				}
			}
		});
	}
};

var list = {
	'spec': {
		"description" : "List images",
		"path" : "/images.{format}",
		"notes" : "List images",
		"summary" : "List images",
		"method": "GET",
		"responseClass" : "List(Image)",
		"errorResponses" : [],
		"nickname" : "listImage",
		"parameters":[
        	{
	            "paramType": "query",
	            "name": "page",
	            "description": "Page num",
	            "dataType": "integer",
	            "required": false
			},
			{
	            "paramType": "query",
	            "name": "per_page",
	            "description": "Images per page",
	            "dataType": "integer",
	            "required": false
        	},
        	{
				"paramType": "query",
	            "name": "search",
	            "description": "Search string",
	            "dataType": "string",
	            "required": true,
	            "allowMultiple": false
			}
        ]
	},
	'action': function (req,res) {
		var limit = parseInt(req.query.per_page || 1);
		var page = parseInt(req.query.page || 0);
		var offset = page * limit

		var add_conds = ['True'];
		var params = [];

		var search = req.query.search || '';
		if(search.length > 0){

			var captions = [];
			var tags = [];

			search = search.split(/[\s,;\.]/);
			var word = undefined;
			while(word = search.pop()){
				if(word.indexOf('#') === 0){
					tags.push(word.substring(1));
				}else{
					captions.push(word);
				}
			}

			for(var i in tags){
				add_conds.push('tags.name LIKE ?');
				params.push('%'+tags[i]+'%');
			}

			for(var i in captions){
				add_conds.push('images.caption LIKE ?');
				params.push('%'+captions[i]+'%');
			}
		}
		add_conds = add_conds.join(' AND ');
		params.push(limit);
		params.push(offset);

		var sql = "SELECT images.*, MAX(tags.id) FROM images LEFT JOIN tags ON (tags.image_id = images.id) WHERE "+add_conds+" GROUP BY images.id ORDER BY images.id desc LIMIT ? OFFSET ?";

		req.db.driver.execQuery(sql, params, function (err, images) {
			if(err){
				res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
			}else{

				var len = images.length;
				var processed = 0;

				var check = function(){
					if(processed == len){
						res.send(200, JSON.stringify(images));
					}
				}

				for(var j in images){
					images[j] = clone(images[j]);
					req.db.models.tags.find({image_id: images[j].id}, function(err, tags){
						if(err){
							res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
						}else{
							images[j].tags = [];
							for(var i in tags){
								images[j].tags.push(clone(tags[i]));
							}
							processed++;
							check();
						}
					});
				}
			}
		});
	}
};

var remove = {
	'spec': {
		"description" : "Remove image",
		"path" : "/images.{format}/{id}",
		"notes" : "Remove image",
		"summary" : "Remove image",
		"method": "DELETE",
		"params" : [
			{
				"paramType": "path",
	            "name": "id",
	            "description": "Image Id",
	            "dataType": "int",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "removeImage"
	},
	'action': function (req,res) {
		if (!req.params.id) {
	      throw swagger.errors.invalid('id'); }
	    var id = parseInt(req.params.id);

	    if(!id){
	    	res.send(401);
	    }

		req.db.models.images.get(id, function(err, image){
			if(err){
				res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
			}else{
				if(image){
					if(image.user_id == req.user){
						image.remove(function (err) {
							if(err){
								res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
							}else{
					        	res.send(200, JSON.stringify({'status':"OK"}));
					        }
					    });
					}else{
						res.send(403);
					}					
				}else{
					throw swagger.errors.notFound('image');
				}
			}
		});
	}
};

var change = {
	'spec': {
		"description" : "Change image",
		"path" : "/images.{format}/{id}",
		"notes" : "Change image",
		"summary" : "Change image",
		"method": "PUT",
		"params" : [
			{
				"paramType": "path",
	            "name": "id",
	            "description": "Image Id",
	            "dataType": "int",
	            "required": true,
	            "allowMultiple": false
			},
			{
				"paramType": "body",
	            "name": "Image",
	            "description": "Image (caption only)",
	            "dataType": "Image",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "removeImage"
	},
	'action': function (req,res) {
		if (!req.params.id) {
	      throw swagger.errors.invalid('id'); }
	    var id = parseInt(req.params.id);
	    var caption = req.body.caption || null;

	    if( !id || !caption){
	    	res.send(401);
	    }

		req.db.models.images.get(id, function(err, image){
			if(err){
				res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
			}else{
				if(image){
					if(image.user_id == req.user){
						image.save({caption: caption}, function (err) {
							if(err){
								res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
							}else{
					        	res.send(200, JSON.stringify({'status':"OK"}));
					        }
					    });
					}else{
						res.send(403);
					}					
				}else{
					throw swagger.errors.notFound('image');
				}
			}
		});
	}
};

var create = {
	'spec': {
		"description" : "Create image",
		"path" : "/images.{format}",
		"notes" : "Change tag",
		"summary" : "Change tag",
		"method": "POST",
		"params" : [
			{
				"paramType": "body",
	            "name": "image",
	            "description": "Image",
	            "dataType": "file",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "createImage"
	},
	'action': function (req,res) {

		if(req.files.files.length == 1){
			var file = req.files.files.pop();

			var kaiseki = new Kaiseki(cfg.parsecom.AppID, cfg.parsecom.ApiKEY);
			kaiseki.uploadFile(file.path, function(err, kaiseki_res, body, success) {
				if(err){
					return res.send(500, JSON.stringify(err));
				}
				req.db.models.images.create(
					[
						{
							url: body.url,
							caption: file.name,
							user_id: req.user
						}
					], function (err, items) {
					    if(err){
					    	res.send(401, JSON.stringify(err));
					    }else{
							res.send(JSON.stringify(items[0]));
					    }
					}
				);
			});
		}else{
			res.send(401, JSON.stringify({'mesasge': 'File not found in request'}));
		}
	}
};

exports.get = get;
exports.list = list;
exports.delete = remove;
exports.create = create;
exports.change = change;