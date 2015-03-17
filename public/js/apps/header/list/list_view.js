define(["app",
        "tpl!apps/header/list/templates/list.tpl", "slimscroll"],
        function(RipManager, listTpl, listItemTpl){

  RipManager.module("HeaderApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.Header = Marionette.ItemView.extend({
      template: listTpl,
      tagName: "header",
      className: "main-header",
      modelEvents: {
        'change': 'render'
      },

      events: {
        "click #logout-link": "logout"
      },

      logout: function(e){
        e.preventDefault();
        this.trigger("logout:clicked");
      },

      onDomRefresh: function() {

        //Enable sidebar toggle
    $("[data-toggle='offcanvas']").click(function(e) {
        e.preventDefault();
        $("body").toggleClass('sidebar-collapse');
        $("body").toggleClass('sidebar-open');
    });


        /*
         * ADD SLIMSCROLL TO THE TOP NAV DROPDOWNS
         * ---------------------------------------
         */
        $(".navbar .menu").slimscroll({
            height: "200px",
            alwaysVisible: false,
            size: "3px"
        }).css("width", "100%");
      }

    });

  });

  return RipManager.HeaderApp.List.View;
});
