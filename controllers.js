var user = require('./controllers/user');
var auth = require('./controllers/auth');
var images = require('./controllers/images');
var tags = require('./controllers/tags');

exports.init = function(swagger) {
	swagger.addPost(user.post);
	swagger.addGET(user.email);
	swagger.addGET(user.get);
	swagger.addPUT(user.change);

	swagger.addPost(auth.post);
	swagger.addPost(auth.facebook);
	swagger.addDELETE(auth.del);

	swagger.addGET(images.get);
	swagger.addGET(images.list);
	swagger.addDELETE(images.delete);
	swagger.addPOST(images.create);

	swagger.addDELETE(tags.delete);
	swagger.addPOST(tags.create);
	swagger.addPUT(tags.change);
}