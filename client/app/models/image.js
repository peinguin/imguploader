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
			urlRoot: cfg.baseUrl + 'images.json'
		});

		return ImageModel;
	}
);