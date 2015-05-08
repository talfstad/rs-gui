define(["app"], function(RipManager){
  RipManager.module("UserModel", function(UserModel, RipManager, Backbone, Marionette, $, _){
    
    UserModel.User = Backbone.Model.extend({

      defaults: {
        id: null,
        user: "No User",
        username: "No User"
      }

    });

    UserModel.UserList = Backbone.Collection.extend({
      url: "/userlist",
      model: UserModel.User,

      notBuildcave: function(domain){
        filtered = this.filter(function(registeredModel) {
          return registeredModel.get("id") !== 34;
        });
      
        return filtered;
      }
    });

    var API = {
      userList: function(){
        var users = new UserModel.UserList();
        var defer = $.Deferred();
        users.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      }
    };

    RipManager.reqres.setHandler("users:userlist", function(){
      return API.userList();
    });
   
  });
  return RipManager.UserModel;
});