define(
	[
		'marionette',
		'text!app/templates/images/image.htt'
	],
	function (
		Marionette,
		ImageTemplate
	) {

		var ImageView = Marionette.ItemView.extend({
			el:'<div class="image"></div>',
			template: function(model){
				return _.template(ImageTemplate, model);
			}
		});

		return ImageView;
	}
);