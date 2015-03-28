define(["app"], function(RipManager){
  RipManager.module("RipsEditModel", function(RipsEditModel, RipManager, Backbone, Marionette, $, _){

    RipsEditModel.submitRipEditModel = Backbone.Model.extend({
      url: "/update_ripped_url",
      defaults: {} //no defaults!
    });

    var API = {
      submitRipEdit: function(args){
        var submitRips = new RipsEditModel.submitRipEditModel({model: args});
        var defer = $.Deferred();
        submitRips.save(null, {
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      }
    }


    RipManager.reqres.setHandler("model:rip:submit", function(args){
      return API.submitRipEdit(args);
    });


  });
});