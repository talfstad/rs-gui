define(["app"], function(RipManager){
  RipManager.module("Entities", function(Entities, RipManager, Backbone, Marionette, $, _){
    Entities.Authentication = Backbone.Model.extend({
      urlRoot: "/API/auth",

      defaults: {
        user: "",
        pass: ""
      },

      validate: function(attrs, options) {
        var errors = {}
        if (! attrs.user) {
          errors.user = "can't be blank";
        }
        if (! attrs.pass) {
          errors.user = "can't be blank";
        }
        if( ! _.isEmpty(errors)){
          return errors;
        }
      }
    });

    Entities.CheckCollection = Backbone.Collection.extend({
      url: "/api/auth",
      model: Entities.Authentication,
      comparator: "user"
    });

    Entities.LoginCollection = Backbone.Collection.extend({
      url: "/api/auth/login",
      model: Entities.Authentication,
      comparator: "user"
    });

    var API = {
      checkAuthEntity: function(){
        var check = new Entities.CheckCollection();
        var defer = $.Deferred();
        check.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        
        return promise;
      },

      authenticationEntity: function(args){
        var login = new Entities.LoginCollection();
        var defer = $.Deferred();
        login.fetch({
          success: function(data){
            defer.resolve(data);
          }, 
          type: 'POST',
          data: $.param(args)
        });
        var promise = defer.promise();
        
        return promise;
      }
    };

    RipManager.reqres.setHandler("authentication:login:entity", function(args){
      return API.authenticationEntity(args);
    });

    RipManager.reqres.setHandler("authentication:check:entity", function(){
      return API.checkAuthEntity();
    });
  });

  return ;
});
