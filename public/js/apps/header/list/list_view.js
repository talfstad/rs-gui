define(["app",
        "tpl!apps/header/list/templates/list.tpl", "adminLTEapp"],
        function(RipManager, listTpl, listItemTpl){

  RipManager.module("HeaderApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.Header = Marionette.ItemView.extend({
      template: listTpl,
      
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

        //If window is small enough, enable sidebar push menu
        if ($(window).width() <= 992) {
            $('.row-offcanvas').toggleClass('active');
            $('.left-side').removeClass("collapse-left");
            $(".right-side").removeClass("strech");
            $('.row-offcanvas').toggleClass("relative");
        } else {
            //Else, enable content streching
            $('.left-side').toggleClass("collapse-left");
            $(".right-side").toggleClass("strech");
        }
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
