define(
	[
		'app/models/image',
		'app/config'
	],
	function (
		ImageModel,
		cfg
	) {
		var ImagesCollection = Backbone.Collection.extend({
			model: ImageModel,
			url: cfg.baseUrl + 'images.json'
		});

		return ImagesCollection;
	}
);