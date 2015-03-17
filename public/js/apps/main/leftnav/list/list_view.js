define(["app","tpl!apps/main/leftnav/list/templates/list.tpl",
        "tpl!apps/main/leftnav/list/templates/linkItem.tpl", "slimscroll", "treeview"],
        function(RipManager, listTpl, linkTpl){

  RipManager.module("LeftNavApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.LeftNavItem = Marionette.ItemView.extend({
      template: linkTpl,
      tagName: "li",
      events: {
        'click a': "navigate"
      },

      navigate: function(e) {
        e.preventDefault();
        this.trigger("navigate", this.model);
      }
    });


    View.LeftNav = Marionette.CompositeView.extend({
      template: listTpl,
      className: "",
      childView: View.LeftNavItem,
      childViewContainer: "ul",

      onRender: function() {
        $(".skin-blue > #header-region .logo").css("background-color", "#222d32");
      },

      onDomRefresh: function() {
        $("[data-widget='remove']").click(function() {
            //Find the box parent        
            var box = $(this).parents(".box").first();
            box.slideUp();
        });

        /* Sidebar tree view */
        $(".sidebar .treeview").tree();

        /* 
         * Make sure that the sidebar is streched full height
         * ---------------------------------------------
         * We are gonna assign a min-height value every time the
         * wrapper gets resized and upon page load. We will use
         * Ben Alman's method for detecting the resize event.
         * 
         **/
        
        //Get window height and the wrapper height
        var height = $(window).height() - $("body > .header").height() - ($("body > .footer").outerHeight() || 0);
        $(".wrapper").css("min-height", height + "px");
        var content = $(".wrapper").height();
        //If the wrapper height is greater than the window
        if (content > height)
            //then set sidebar height to the wrapper
            $(".left-side, html, body").css("min-height", content + "px");
        else {
            //Otherwise, set the sidebar to the height of the window
            $(".left-side, html, body").css("min-height", height + "px");
        }
        
        //Fire when wrapper is resized
        $(".wrapper").resize(function() {
          //Get window height and the wrapper height
          var height = $(window).height() - $("body > .header").height() - ($("body > .footer").outerHeight() || 0);
          $(".wrapper").css("min-height", height + "px");
          var content = $(".wrapper").height();
          //If the wrapper height is greater than the window
          if (content > height)
              //then set sidebar height to the wrapper
              $(".left-side, html, body").css("min-height", content + "px");
          else {
              //Otherwise, set the sidebar to the height of the window
              $(".left-side, html, body").css("min-height", height + "px");
          }

                     //Make sure the body tag has the .fixed class
          if (!$("body").hasClass("fixed")) {
              return;
          }

          //Add slimscroll
          $(".sidebar").slimscroll({
              height: ($(window).height() - $(".header").height()) + "px",
              color: "rgba(0,0,0,0.2)"
          });
        });

        //Fix the fixed layout sidebar scroll bug
         //Make sure the body tag has the .fixed class
        if (!$("body").hasClass("fixed")) {
            return;
        }

        //Add slimscroll
        $(".sidebar").slimscroll({
            height: ($(window).height() - $(".header").height()) + "px",
            color: "rgba(0,0,0,0.2)"
        });

        /*
         * We are gonna initialize all checkbox and radio inputs to 
         * iCheck plugin in.
         * You can find the documentation at http://fronteed.com/iCheck/
         */
        $("input[type='checkbox']:not(.simple), input[type='radio']:not(.simple)").iCheck({
            checkboxClass: 'icheckbox_minimal',
            radioClass: 'iradio_minimal'
        });
      }
    });
  });

  return RipManager.LeftNavApp.List.View;
});
