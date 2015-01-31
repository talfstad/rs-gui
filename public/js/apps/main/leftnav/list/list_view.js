define(["app","tpl!apps/main/leftnav/list/templates/list.tpl", "adminLTEapp","adminLTEdemo"],
        function(RipManager, listTpl){

  RipManager.module("LeftNavApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.LeftNav = Marionette.ItemView.extend({
      template: listTpl,

    });

  });

  return RipManager.LeftNavApp.List.View;
});
