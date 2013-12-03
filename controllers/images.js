var cfg = require('../config');
var Kaiseki = require('kaiseki');

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
					res.send(200, JSON.stringify(image));
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

		var search = req.query.search || '';console.log(search);
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

			console.log(tags, captions);
		}

		//db.driver.execQuery("SELECT id, email FROM user", function (err, data) { ... })

		req.db.models.images.find({},{ limit:limit,offset:offset},function(err, images){
			if(err){
				res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
			}else{
				res.send(200, JSON.stringify(images));
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