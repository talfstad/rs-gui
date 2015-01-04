define([
    "app",
    "text!templates/login-page.html",
    "text!templates/home-page.html",
    "parsley",
    "sparkline",
    "vectormap",
    "vectormapworld",
    "knobchart",
    "daterangepicker",
    "datepicker",
    "wysihtml5",
    "slimscroll",
    "icheck",
    "jqueryui"
], function(app, LoginPageTpl, HomePageTpl) {

    var HomePageView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);

            // Listen for session logged_in state changes and re-render
            app.session.on("change:logged_in", this.render);
        },

        el: $("body"),

        events: {

        },

        render:function () {
            if(app.session.get('logged_in')) {
                this.template = _.template(HomePageTpl);
            } else {
                this.template = _.template(LoginPageTpl);
            }
            this.$el.append(this.template({ user: app.session.user.toJSON() }));
            return this;
        }

    });

    return HomePageView;
});

