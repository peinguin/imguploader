define(
	[
		'marionette',
		'text!app/templates/images/image.htt',
		'app/app',
		'app/collections/tags',
		'text!app/templates/images/tag.htt',
		'app/models/tag'
	],
	function (
		Marionette,
		ImageTemplate,
		App,
		TagsCollection,
		TagTemplate,
		TagModel
	) {

		var TagView = Marionette.ItemView.extend({
			el: '<div class="tag">',
			template: function(model){
				model.isOwner = (App.Auth.getUser().get('id') == model.image.user_id);
				return _.template(TagTemplate, model);
			},
			events:{
				'change input': 'edit',
				'click button': 'removeThis'
			},
			block: function(){
				var view = this;
				view.$el.find('input').attr('disabled', 'disabled');
			},
			unblock: function(){
				var view = this;
				view.$el.find('input').removeAttr('disabled');
			},
			edit: function(e){
				e.preventDefault();
				var view = this;
				view.block();
				var str = view.$el.find('input').val();
				if(str.length > 0){
					view.model.set('name', str);
					Backbone.sync('update', view.model, {
						success: function(){
							view.unblock();
						},
						error: function(){
							console.log('error');
						}
					});
				}else{
					view.removeThis(e);
				}
			},
			removeThis: function(e){
				e.preventDefault();
				var view = this;
				view.block();
				view.model.destroy({
					success: function(){
						console.log(success);
					},
					error: function(){
						console.log('error');
					}
				});
			}
		});

		var ImageView = Marionette.CompositeView.extend({
			itemViewContainer: '.tags .exists',
			itemView: TagView,
			el:'<div class="one-image"></div>',
			template: function(model){
				model.isOwner = (App.Auth.getUser().get('id') == model.user_id);
				return _.template(ImageTemplate, model);
			},
			onRender:function(){
				var view = this;

				view.collection = new TagsCollection;

				view.listenTo(view.collection, "add", view.addChildView, view);
		        view.listenTo(view.collection, "remove", view.removeItemView, view);
		        view.listenTo(view.collection, "reset", view._renderChildren, view);

		        var tags = view.model.get('tags');
		        for(var i in tags){
		        	var model = new TagModel(tags[i]);
		        	model.set({image: view.model.toJSON()});
		        	view.collection.add(model);
		        }
			},
			events:{
				'click .remove': 'removeThis',
				'change input.title': 'changeThis',
				"click img":'toggle',
				"click .new_tag button":'createNewTag'
			},
			createNewTag: function(e){
				e.preventDefault();

				var view = this;

				var $el = view.$el.find('.new_tag input');
				var str = $el.val();
					if(str.length > 0){
						view.block();
						var model = new TagModel();
						model.save(
							{image_id: view.model.get('id'), name: str},
							{
							success: function(){
								model.set({'image': view.model.toJSON()});
								view.collection.add(model);
								view.unblock();
							},
							error: function(){
								console.log('error');
							}
						}
					);
				}
			},
			block: function(){
				var view = this;
				view.$el.find('input.title').attr('disabled', 'disabled');
				view.$el.find('.new_tag input').attr('disabled', 'disabled');
			},
			unblock: function(){
				var view = this;
				view.$el.find('input.title').removeAttr('disabled');
				view.$el.find('.new_tag input').removeAttr('disabled');
			},
			toggle: function(e){
				e.preventDefault();
				var view = this;

				var is_active = view.$el.hasClass('active');
				var all_active = view.$el.parent().find('.active').removeClass('active');

				if(!is_active){
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
				});
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