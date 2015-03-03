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
        }
      },

      onDomRefresh: function() {
        var me = this;

        //little trick to login on enter key
        $("#login-password-input, #login-username-input").keyup(function(e){
          if(e.keyCode == 13){
            me.loginAttempt(e);
          }
        });
      }   


    });
  });

  return RipManager.AuthenticationApp.Login.View;
});
