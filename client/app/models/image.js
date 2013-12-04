define(
	[
		'backbone',
		'app/config'
	],
	function(
		Backbone,
		cfg
	) {
		var ImageModel = Backbone.Model.extend({
			urlRoot: cfg.baseUrl + 'images.json',
			idAttribute: 'id'
		});

		return ImageModel;
	}
);