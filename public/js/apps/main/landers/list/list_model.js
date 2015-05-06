define(["app"], function(RipManager){
  RipManager.module("GetLanders", function(GetLanders, RipManager, Backbone, Marionette, $, _){

    GetLanders.Lander = Backbone.Model.extend({
      urlRoot: "/edit_notes",

      events: {

      },

      defaults: {
        notes: ""
      },

      validation: {
        notes: {
          required: true
        }
      }

    });

    GetLanders.LanderCollection = Backbone.Collection.extend({
      url: "/get_landers",
      model: GetLanders.Lander
    });

    var API = {
      getLanders: function(){
        var landers = new GetLanders.LanderCollection();
        var defer = $.Deferred();
        landers.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        return promise;
      }

    };

    RipManager.reqres.setHandler("landers:getlanders", function(){
      return API.getLanders();
    });
   
  });
  return RipManager.GetLanders;
});
