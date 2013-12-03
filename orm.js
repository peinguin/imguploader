var orm = require('orm');
var config = require('./config');

exports.init = function (app) {
	app.use(orm.express(config.db, {
	    define: function (db, models) {

	        var Users = db.define("users",
	        	{
			        email    : String,
			        password : String,
			        facebook : Number
			    },
			    {
			        validations: {
			        	email: [
			        		orm.enforce.unique("Email already taken!"),
			        		orm.enforce.unique({ ignoreCase: true }),
			            	orm.enforce.notEmptyString()
			            ],
			            password: orm.enforce.notEmptyString()
			        },
			    	id: "id",
			    	autoFetch: false
		    	}
		    );
		    var Images = db.define("images",
			    {
			        url         : String,
			        user_id     : String,
			        caption     : String
			    },{
			    	id: "id",
			    	autoFetch: false
			    }
		    );
		    var Tags = db.define("tags",
			    {
			        name        : String,
			        image_id    : String
			    },{
			    	id: "id",
			    	autoFetch: false
			    }
		    );
		    Tags.hasOne('image', Images, {reverse: 'tags'});
		    Images.hasOne('user', Users, {reverse: 'images'});
	    }
	}));
}