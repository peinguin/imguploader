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
		var id = parseInt(req.params.id);

		if(!id){
			return res.send(401);
		}

		req.db.models.tags.get(id, function(err, tag){
			req.db.models.images.get(tag.image_id, function(err, image){
				if(err){
					res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
				}else{
					if(image){
						if(image.user_id == req.user){
							tag.remove(function (err) {
							    if(err){
							    	res.send(500, JSON.stringify(err));
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
		});
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
		var id = parseInt(req.params.id);
		var name = req.body.name;

		if(!id || !name){
			return res.send(401);
		}

		req.db.models.tags.get(id, function(err, tag){
			req.db.models.images.get(tag.image_id, function(err, image){
				if(err){
					res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
				}else{
					if(image){
						if(image.user_id == req.user){
							tag.save({name: name}, function (err, items) {
							    if(err){
							    	res.send(401, JSON.stringify(err));
							    }else{
									res.send(200, JSON.stringify(items));
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
		});
	}
};

var create = {
	'spec': {
		"description" : "Create tag",
		"path" : "/tags.{format}/{image_id}",
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

		var image_id = parseInt(req.params.image_id);
		var name = req.body.name;

		if(!image_id || !name){
			return res.send(401);
		}

		req.db.models.images.get(image_id, function(err, image){
			if(err){
				res.send(500, JSON.stringify({code: 500, header: 'Internal Server Error', message: JSON.stringify(err)}));
			}else{
				if(image){
					if(image.user_id == req.user){
						req.db.models.tags.create(
							[
								{
									name: name,
									image_id: image_id
								}
							], function (err, items) {
							    if(err){
							    	res.send(401, JSON.stringify(err));
							    }else{
									res.send(JSON.stringify(items[0]));
							    }
							}
						);
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

exports.delete = remove;
exports.create = create;
exports.change = change;