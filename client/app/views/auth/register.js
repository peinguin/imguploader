define(
	[
		'marionette',
		'text!app/templates/auth/register.htt',
		'app/config',
		'app/helper',
		'app/views/alert',
		'app/models/new_user'
	],
	function (
		Marionette,
		Template,
		cfg,
		Helper,
		AlertView,
		NewUserModel
	) {

		var hide_problems = function($form){
			$form.find('.help-block').hide();
			$form.find('.form-group').removeClass('has-error');
		}

		var LoginView = Marionette.ItemView.extend({
			template: function(){
				return _.template(Template, {cfg: cfg});
			},
			events:{
				'submit form': 'register'
			},
			register: function(e){

				var view = this;

				e.preventDefault();

				var form = e.target;

				var $form = $(form);

				hide_problems($form);
				if(form.password.value == form.password2.value){

					var newUserModel = new NewUserModel({email: form.email.value, password: form.password.value});

					newUserModel.on("invalid", function(model, error) {
						(new AlertView).render(error);
					});

					newUserModel.save(undefined, {
						success: function(m, data, jqXhr){
							view.model.setHeader(jqXhr.xhr.getResponseHeader(cfg.authHeader) || jqXhr.xhr.responseText);
							(new Backbone.Router).navigate("", {trigger: true, replace: true});
						},
						error: function(model, xhr, options){
							Helper.process_errors(JSON.parse(xhr.responseText), $form);
						}
					});
				}else{
					Helper.process_errors({password2:{message:'Passwords must be equals'}}, $form);
				}
			}
		});

		return LoginView;
	}
);