define(
	[
		'marionette',
		'text!app/templates/images/image.htt',
		'app/app'
	],
	function (
		Marionette,
		ImageTemplate,
		App
	) {

		var ImageView = Marionette.CompositeView.extend({
			el:'<div class="one-image"></div>',
			template: function(model){
				model.isOwner = (App.Auth.getUser().get('id') == model.user_id);
				return _.template(ImageTemplate, model);
			},
			events:{
				'click .remove': 'removeThis',
				'change input.title': 'changeThis',
				"click img":'toggle'
			},
			block: function(){
				var view = this;
				view.$el.find('input.title').attr('disabled', 'disabled');
			},
			unblock: function(){
				var view = this;
				view.$el.find('input.title').removeAttr('disabled');
			},
			toggle: function(e){
				e.preventDefault();
				var view = this;
				if(view.$el.hasClass('active')){
					view.$el.removeClass('active');
				}else{
					view.$el.addClass('active');
				}
			},
			removeThis: function(e){
				e.preventDefault();
				var view = this;
				view.model.destroy({
					success: function(){
						console.log(success);
					},
					error: function(){
						console.log('error');
					}
				})
			},
			changeThis: function(e){
				e.preventDefault();
				var view = this;

				view.block();
				view.model.set('caption', view.$el.find('input.title').val());
				Backbone.sync('update', view.model, {
					success: function(){
						view.unblock();
					},
					error: function(){
						console.log('error');
					}
				});
			}
		});

		return ImageView;
	}
);