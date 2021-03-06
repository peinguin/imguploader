define(
	[
		'marionette',
		'text!app/templates/images/search_form.htt',
	],
	function (
		Marionette,
		Template
	) {

		var SearchView = Marionette.ItemView.extend({
			el:'<form role="search" class="navbar-form navbar-left"></form>',
			template: function(model){
				return _.template(Template, model);
			},
			events:{
				"submit":"search"
			},
			search: function(e){
				e.preventDefault();
				(new Backbone.Router).navigate("#search/"+encodeURIComponent(this.$el.find('[type=text]').val()), {trigger: true, replace: true})
			}
		});

		return SearchView;
	}
);