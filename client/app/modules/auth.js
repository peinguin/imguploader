define(
	[
		'app/app',
		'marionette',
		'app/models/user',
		'app/views/auth/register',
		'app/views/auth/profile'
	],
	function(
		MyConference,
		Marionette,
		UserModel,
		RegisterView,
		ProfileView
	){

		MyConference.module("Auth", function(AuthModule){

			var User = new UserModel;

			var AuthController = Marionette.Controller.extend({
				register: function(){

					if(User.isNew()){
						var registerView = new RegisterView;
						registerView.model = User;
						MyConference.mainView.currentView.content.show(registerView);
					}else{
						return (new Backbone.Router).navigate("", {trigger: true, replace: true});
					}
				},
				logout: function(){
					if(User.isNew()){
						return (new Backbone.Router).navigate("", {trigger: true, replace: true});
					}else{
						User.logout();
					}
				},
				profile: function(){
					if(User.isNew()){
						return (new Backbone.Router).navigate("", {trigger: true, replace: true});
					}else{
						var profileView = new ProfileView;
						profileView.model = User;
						MyConference.mainView.currentView.content.show(profileView);
					}
				}
			});

			var AuthRouter = Backbone.Marionette.AppRouter.extend({
				appRoutes: {
					"register": "register",
					"logout":   "logout",
					"profile":  "profile"
				},
				controller: new AuthController
			});

			AuthModule.addInitializer(function(){
				new AuthRouter;
			});

			this.getUser = function(){
				return User;
			}

			this.startWithParent = false;

		});

		return MyConference.Auth;
	}
);