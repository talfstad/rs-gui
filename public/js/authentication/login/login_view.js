define(["app",
        "tpl!authentication/login/templates/login.tpl", "parsley"],
       function(RipManager, viewTpl){
  RipManager.module("AuthenticationApp.Login.View", function(View, RipManager, Backbone, Marionette, $, _){
    
    View.Login = Marionette.ItemView.extend({
      template: viewTpl,

      events: {
        'click #login-btn': 'loginAttempt',
      },

      loginAttempt: function(e){
        e.preventDefault();
        
        this.$("#login-form").parsley().validate();
        
        if(this.$("#login-form").parsley().isValid()) {
            this.trigger("login:submit", {
                username: this.$("#login-username-input").val(),
                password: this.$("#login-password-input").val()
            });

        //     app.session.login({
        //         username: this.$("#login-username-input").val(),
        //         password: this.$("#login-password-input").val()
        //     }, {
        //         success: function(mod, res) {
        //             if(DEBUG) console.log("SUCCESS", mod, res);
        //         },
        //         error: function(err) {
        //             if(DEBUG) console.log("ERROR", err);
        //             app.showAlert('Bummer dude!', err.error, 'alert-danger'); 
        //         }
        //     });
        // } else {
        //     // Invalid clientside validations thru parsley
        //     if(DEBUG) console.log("Did not pass clientside validation");

        // }


      }
    
    }
  });
});

  return RipManager.AuthenticationApp.Login.View;
});
