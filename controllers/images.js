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
		"nickname" : "listImage"
	},
	'action': function (req,res) {
		req.db.models.images.find({},function(err, conferences){
			if(err){
				res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
			}else{
				res.send(200, JSON.stringify(conferences));
			}
		});
	}
};

var search = {
	'spec': {
		"description" : "Search images",
		"path" : "/images.{format}/search/{phrase}",
		"notes" : "Search images",
		"summary" : "Search images",
		"method": "GET",
		"params" : [
			{
				"paramType": "path",
	            "name": "phrase",
	            "description": "Search string",
	            "dataType": "string",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "List(Image)",
		"errorResponses" : [],
		"nickname" : "searchImage"
	},
	'action': function (req,res) {
		
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
		
	}
};

exports.get = get;
exports.list = list;
exports.search = search;
exports.delete = remove;
exports.create = create;