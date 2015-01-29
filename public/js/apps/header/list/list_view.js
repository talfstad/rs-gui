define(["app",
        "tpl!apps/header/list/templates/list.tpl", "adminLTEapp"],
        function(RipManager, listTpl, listItemTpl){

  RipManager.module("HeaderApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.Header = Marionette.ItemView.extend({
      template: listTpl,
      tagName: "header",
      className: "header",

      // initialize: function() {
      //   RipManager.session.on("change:logged_in", this.render());
      // },

      modelEvents: {
        'change': 'render'
      },

      events: {
        "click a": "navigate",
        "click #logout-link": "logout"
      },

      logout: function(e){
        e.preventDefault();
        this.trigger("logout:clicked");
      },

      navigate: function(e){
        // e.preventDefault();
        // this.trigger("navigate", this.model);
      },

      onRender: function(){
        // if(this.model.selected){
        //   // add class so Bootstrap will highlight the active entry in the navbar
        //   this.$el.addClass("active");
        // };
      }
    });

    // View.Headers = Marionette.CompositeView.extend({
    //   template: listTpl,
    //   className: "navbar navbar-inverse navbar-fixed-top",
    //   childView: View.Header,
    //   childViewContainer: "ul",

    //   events: {
    //     "click a.brand": "brandClicked"
    //   },

    //   brandClicked: function(e){
    //     e.preventDefault();
    //     this.trigger("brand:clicked");
    //   }
    // });
  });

  return RipManager.HeaderApp.List.View;
});
