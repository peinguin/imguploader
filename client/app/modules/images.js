define(
	[
		'marionette',
		'app/app',
		'app/views/images/images',
		'app/collections/images',
		'app/models/image',
		'app/views/images/image_full',
		'app/views/images/image_not_found',
		'app/views/spinner',
		'app/views/images/search',
		'app/models/tag',
	],
	function (
		Marionette,
		App,
		MainView,
		ImagesCollection,
		ImageModel,
		ImageFullView,
		ImageNotFoundView,
		SpinnerView,
		SearchView,
		TagModel
	) {
		App.module("Images", function(MainModule){

		});

		return App.Images;
	}
);