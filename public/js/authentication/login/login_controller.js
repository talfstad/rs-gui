define(["app", "authentication/login/login_view", "authentication/session/user_model"], function(RipManager, View, UserModel){
  RipManager.module("LoginApp.Login", function(Login, RipManager, Backbone, Marionette, $, _){
    Login.Controller = {
      
      login: function(id){
        require(["entities/authentication", "apps/main/main/main_app"], function(){

          //if header isn't loaded, load it
          // RipManager.session.set({username: null});
          // if(RipManager.)

          var loginView = new View.Login({user: "", pass: ""});

          loginView.on("login:submit", function(args){
            
            var attemptingLogin = RipManager.request("authentication:login:entity", args);
            $.when(attemptingLogin).done(function(status){
              if(status.models[0].attributes.error){
                loginView.trigger("login:invalid");
              } else {
                RipManager.session.set({
                  user: status.models[0].attributes.user.user,
                  logged_in: true,
                  username: status.models[0].attributes.user.username
                });
                if(status.models[0].attributes.user.admin) {
                  RipManager.session.set({admin: true});
                }
                RipManager.navigate("dash", {trigger: true});
                // RipManager.trigger("main:dash:list");
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
