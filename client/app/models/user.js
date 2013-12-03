define(
	[
		'backbone',
		'app/models/localStorage',
		'app/config',
		'app/app',
		'app/views/auth/login_form',
		'app/views/auth/user_info',
		'app/views/alert',
		'app/helper',
		'app/models/new_user'
	],
	function (
		Backbone,
		Storage,
		cfg,
		App,
		LoginForm,
		UserInfo,
		AlertView,
		Helper,
		NewUserModel
	) {
		
		var process_social_resporce = function(model, data, xhr){
			if(data.error){
				(new AlertView).render(Helper.getErrorStringInHtml(xhr));
			}else{
				if(xhr && xhr.getResponseHeader(cfg.authHeader)){
					Storage.set('API_KEY', xhr.getResponseHeader(cfg.authHeader));
				}else if(data.length > 0){
					Storage.set('API_KEY', data);
				}
				renew_headers();
				model.fetch();
			}
		}

		var renew_headers = function(){
			if(Storage.get('API_KEY')){
				var headers = {};
				headers[cfg.authHeader] = Storage.get('API_KEY');
				$.ajaxSetup({headers: headers});
			}
		}

		var userModel = NewUserModel.extend({
			defaults: {
				email: undefined,
				twitter: undefined,
				google: undefined,
				facebook: undefined,
				linkedin: undefined
			},
			showHeader: function(){

				var model = this;

				if(
					App.mainView.currentView &&
					App.mainView.currentView.header.currentView
				){
					if(model.isNew()){
						var loginForm = new LoginForm({model: model});
						App.mainView.currentView.header.currentView.auth.show(loginForm);
					}else{
						var userInfo = new UserInfo({model: model});
						App.mainView.currentView.header.currentView.auth.show(userInfo);
					}
				}
			},
			initialize: function(){

				var model = this;

				renew_headers();

				this.on('change:id', function(){
					if(
						window.location.hash.match(/register/)
					){
						(new Backbone.Router).navigate("", {trigger: true, replace: true});
					}else{
						App.mainView.currentView.content.currentView.render();
					}

					model.showHeader();
				});

				this.on('renewHeader', function(){
					model.showHeader();
				})

				this.fetch({
					error: function(){
						Storage.set('API_KEY', undefined);
						renew_headers();
						model.trigger('renewHeader');
					}
				});
			},
			logout: function(){
				var model = this;
				$.ajax({
					method:'DELETE',
					dataType: 'html',
					url: cfg.baseUrl + 'auth.json',
					error: function(jqXHR, textStatus, errorThrown){
						console.log(jqXHR, textStatus, errorThrown);
					},
					success: function(){
						Storage.set('API_KEY', undefined);
						model.set({
							id: undefined,
							email: undefined
						});
						renew_headers();
						App.mainView.currentView.content.currentView.render();
					}
				});
			},
			login: function(form){

				var model = this;

				$.ajax({
					url: cfg.baseUrl + 'auth.json',
					data: {
						email: form.email.value,
						password: form.password.value
					},
					dataType: "text",
					method:'POST',
					success :function(user, message, xhr){
						Storage.set('API_KEY', xhr.getResponseHeader(cfg.authHeader));
						renew_headers();
						model.fetch();
					},
					error: function(xhr){
						if(xhr.status == 403){
							(new AlertView).render(Helper.getErrorStringInHtml(xhr));
						}
					}
				});
			},
			facebook: function(){

				var model = this;

				var afterInit = function(){
					var sendAccessToken = function(response){
				    	$.post(
				    		cfg.baseUrl + 'auth.json/facebook',
				    		{FacebookKEY: response.authResponse.accessToken},
				    		function(data, message, xhr){
				    			process_social_resporce(model, data, xhr);
				    		},
					    	"text"
				    	);
				    }

					FB.getLoginStatus(function(response) {
						if(response.status == "not_authorized" || response.status == "unknown"){
						    FB.login(function(response, a) {
							    if (response.authResponse) {
							    	sendAccessToken(response);
							    } else {
							        console.log(response, a)
							    }
							}, {scope:'email'});
						}else{
							sendAccessToken(response);
						}
					});
				}

				window.fbAsyncInit = function() {
				    FB.init({
				      appId      : cfg.facebookAppId, // App ID
				      status     : true, // check login status
				      cookie     : true, // enable cookies to allow the server to access the session
				      xfbml      : true  // parse XFBML
				    });
				    afterInit();
				};

				// Load the SDK asynchronously
				(function(d){
				     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
				     if (d.getElementById(id)) {return afterInit();}
				     js = d.createElement('script'); js.id = id; js.async = true;
				     js.src = "//connect.facebook.net/en_US/all.js";
				     ref.parentNode.insertBefore(js, ref);
				}(document));
			},
			setHeader: function(header){
				Storage.set('API_KEY', header);
				renew_headers();
				this.fetch();
			}
		});

		return userModel;
	}
);