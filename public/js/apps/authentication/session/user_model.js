/**
 * @desc    stores the POST state and response state of authentication for user
 */

define(["app"], function(RipManager){
var UserModel = Backbone.Model.extend({
      urlRoot: "/API/auth",

      defaults: {
        user: "",
        pass: "",
        logged_in: false
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
    return UserModel;
});