define(["app","tpl!apps/main/leftnav/list/templates/list.tpl", "adminLTEapp"],
        function(RipManager, listTpl){

  RipManager.module("LeftNavApp.List.View", function(View, RipManager, Backbone, Marionette, $, _){

    View.LeftNav = Marionette.ItemView.extend({
      template: listTpl,

      onShow: function() {
        /*
         * INITIALIZE BUTTON TOGGLE
         * ------------------------
         */
        $('.btn-group[data-toggle="btn-toggle"]').each(function() {
            var group = $(this);
            $(this).find(".btn").click(function(e) {
                group.find(".btn.active").removeClass("active");
                $(this).addClass("active");
                e.preventDefault();
            });

        });

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
