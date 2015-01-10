define(["app", "apps/authentication/login/login_view"], function(RipManager, View){
  RipManager.module("LoginApp.Login", function(Login, RipManager, Backbone, Marionette, $, _){
    Login.Controller = {
      
      login: function(id){
        require(["entities/authentication"], function(){
          var loginView = new View.Login({user: "", pass: ""});

          loginView.on("login:submit", function(args){
            
            var attemptingLogin = RipManager.request("authentication:login:entity", args);
            $.when(attemptingLogin).done(function(status){
              if(status.error){
                loginView.trigger("login:invalid");
              } else {
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
