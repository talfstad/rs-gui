define(["app", "apps/authentication/login/login_view", "apps/authentication/session/user_model"], function(RipManager, View, UserModel){
  RipManager.module("LoginApp.Login", function(Login, RipManager, Backbone, Marionette, $, _){
    Login.Controller = {
      
      login: function(id){
        require(["entities/authentication"], function(){
          var loginView = new View.Login({user: "", pass: ""});

          loginView.on("login:submit", function(args){
            
            var attemptingLogin = RipManager.request("authentication:login:entity", args);
            $.when(attemptingLogin).done(function(status){
              if(status.models[0].attributes.error){
                loginView.trigger("login:invalid");
              } else {
                RipManager.session.set({logged_in: true});
                RipManager.trigger("rips:list");
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
