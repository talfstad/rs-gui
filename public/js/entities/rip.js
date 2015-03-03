define(["app"], function(RipManager){
  RipManager.module("Entities", function(Entities, RipManager, Backbone, Marionette, $, _){
    Entities.Rip = Backbone.Model.extend({
      urlRoot: "/API/rips",

      defaults: {
        hits: "0",
        rate: "0",
        replacement_link: "",
        url: "",
        redirect_rate: ""
      },

      // validate: function(attrs, options) {
      //   var errors = {}
      //   if (! attrs.firstName) {
      //     errors.firstName = "can't be blank";
      //   }
      //   if (! attrs.lastName) {
      //     errors.lastName = "can't be blank";
      //   }
      //   else{
      //     if (attrs.lastName.length < 2) {
      //       errors.lastName = "is too short";
      //     }
      //   }
      //   if( ! _.isEmpty(errors)){
      //     return errors;
      //   }
      // }
    });

    Entities.RipCollection = Backbone.Collection.extend({
      url: "/API/rips",
      model: Entities.Rip,
      comparator: "url"
    });

    var API = {
      getRipEntities: function(){
        var rips = new Entities.RipCollection();
        var defer = $.Deferred();
        rips.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      },

      getRipEntity: function(ripId){
        var rip = new Entities.Rip({id: ripId});
        var defer = $.Deferred();
        setTimeout(function(){
          rip.fetch({
            success: function(data){
              defer.resolve(data);
            },
            error: function(data){
              defer.resolve(undefined);
            }
          });
        }, 2000);
        return defer.promise();
      }
    };

    RipManager.reqres.setHandler("rip:entities", function(){
      return API.getRipEntities();
    });

    RipManager.reqres.setHandler("rip:entity", function(id){
      return API.getRipEntity(id);
    });
   
  });

  return ;
});
