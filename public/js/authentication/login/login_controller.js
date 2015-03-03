define(["app", "authentication/login/login_view", "authentication/session/user_model"], function(RipManager, View, UserModel){
  RipManager.module("LoginApp.Login", function(Login, RipManager, Backbone, Marionette, $, _){
    Login.Controller = {
      
      login: function(id){
        require(["entities/authentication", "apps/main/main/main_app"], function(){
          var loginView = new View.Login({user: "", pass: ""});

          loginView.on("login:submit", function(args){
            
            var attemptingLogin = RipManager.request("authentication:login:entity", args);
            $.when(attemptingLogin).done(function(status){
              if(status.models[0].attributes.error){
                loginView.trigger("login:invalid");
              } else {
                RipManager.session.set({logged_in: true});
                RipManager.trigger("main:dash:list");
              }
            });
          });

          RipManager.mainRegion.show(loginView);

        });
      }

    }
  });

  return RipManager.LoginApp.Login.Controller;
});
