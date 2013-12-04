define(
	[
		'app/models/tag',
		'app/config'
	],
	function (
		TagModel,
		cfg
	) {
		var TagsCollection = Backbone.Collection.extend({
			model: TagModel,
			url: cfg.baseUrl + 'tags.json'
		});

		return TagsCollection;
	}
);