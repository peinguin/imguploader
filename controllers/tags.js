var remove = {
	'spec': {
		"description" : "Remove tag",
		"path" : "/tag.{format}/{id}",
		"notes" : "Remove tag",
		"summary" : "Remove tag",
		"method": "DELETE",
		"params" : [
			{
				"paramType": "path",
	            "name": "id",
	            "description": "Tag Id",
	            "dataType": "int",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "removeTag"
	},
	'action': function (req,res) {
		
	}
};

var change = {
	'spec': {
		"description" : "Change tag",
		"path" : "/tag.{format}/{id}",
		"notes" : "Change tag",
		"summary" : "Change tag",
		"method": "PUT",
		"params" : [
			{
				"paramType": "path",
	            "name": "id",
	            "description": "Tag Id",
	            "dataType": "int",
	            "required": true,
	            "allowMultiple": false
			},
			{
				"paramType": "body",
	            "name": "new_tag",
	            "description": "New tag",
	            "dataType": "string",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "changeTag"
	},
	'action': function (req,res) {
		
	}
};

var create = {
	'spec': {
		"description" : "Create tag",
		"path" : "/tag.{format}/{image_id}",
		"notes" : "Change tag",
		"summary" : "Change tag",
		"method": "POST",
		"params" : [
			{
				"paramType": "path",
	            "name": "image_id",
	            "description": "Image Id",
	            "dataType": "int",
	            "required": true,
	            "allowMultiple": false
			},
			{
				"paramType": "body",
	            "name": "new_tag",
	            "description": "New tag",
	            "dataType": "string",
	            "required": true,
	            "allowMultiple": false
			}
		],
		"responseClass" : "string",
		"errorResponses" : [],
		"nickname" : "createTag"
	},
	'action': function (req,res) {
		
	}
};

exports.delete = remove;
exports.create = create;
exports.change = change;