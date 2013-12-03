define(
	[
		'backbone',
		'app/config',
	],
	function (
		Backbone,
		cfg
	) {
		var NewUserModel = Backbone.Model.extend({
			url: cfg.baseUrl+'user.json',
			defaults: {
				email: undefined,
				password: undefined
			},
			idAttribute: 'id',
			validate: function(attrs, options) {
			    if (attrs.email.length == 0) {
			      return "Email must be non-empty";
			    }
			}
		});

		return NewUserModel;
	}
);