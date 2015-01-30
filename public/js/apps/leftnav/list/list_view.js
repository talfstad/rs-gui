define(["app",
        "tpl!apps/leftnav/list/templates/list.tpl"],
        function(RipManager, listTpl){

  RipManager.module("LeftNavApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.LeftNav = Marionette.ItemView.extend({
      template: listTpl,

      // initialize: function() {
      //   RipManager.session.on("change:logged_in", this.render());
      // },

      modelEvents: {
        'change': 'render'
      },

      // events: {
      //   "click a": "navigate",
      //   "click #logout-link": "logout"
      // },

      // logout: function(e){
      //   e.preventDefault();
      //   this.trigger("logout:clicked");
      // },

      navigate: function(e){
        // e.preventDefault();
        // this.trigger("navigate", this.model);
      },

      onRender: function(){

        //MAGIC GET RID OF DUMB WRAPPING DIV
        // Get rid of that pesky wrapping-div.
        // Assumes 1 child element present in template.
        this.$el = this.$el.children();
        // Unwrap the element to prevent infinitely 
        // nesting elements during re-render.
        this.$el.unwrap();
        this.setElement(this.$el);
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

  return RipManager.LeftNavApp.List.View;
});
