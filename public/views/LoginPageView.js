define([
    "app",
    "text!templates/logged-in-page.html",
    "text!templates/login-page.html",
    "jquery",
    "jqueryEasing",
    "parsley"
], function(app, LoggedInPageTpl, LoginPageTpl, $){

    var LoginView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this);

            // Listen for session logged_in state changes and re-render
            app.session.on("change:logged_in", this.ifLoggedInRedirectToHome);
        },

        events: {
            'click #login-btn'                      : 'onLoginAttempt',
            'click #signup-btn'                     : 'onSignupAttempt',
            'keyup #login-password-input'           : 'onPasswordKeyup',
            'keyup #signup-password-confirm-input'  : 'onConfirmPasswordKeyup'
        },

        el: $("body"),

        // Allow enter press to trigger login
        onPasswordKeyup: function(evt){
            var k = evt.keyCode || evt.which;

            if (k == 13 && $('#login-password-input').val() === ''){
                evt.preventDefault();    // prevent enter-press submit when input is empty
            } else if(k == 13){
                evt.preventDefault();
                this.onLoginAttempt();
                return false;
            }
        },

        ifLoggedInRedirectToHome: function(evt) {
            if(app.session.get('logged_in')) app.router.navigate("/", true);
        },

        // Allow enter press to trigger signup
        onConfirmPasswordKeyup: function(evt) {
            var k = evt.keyCode || evt.which;

            if (k == 13 && $('#confirm-password-input').val() === ''){
                evt.preventDefault();   // prevent enter-press submit when input is empty
            } else if(k == 13){
                evt.preventDefault();
                this.onSignupAttempt();
                return false;
            }
        },

        onLoginAttempt: function(evt) {
            if(evt) evt.preventDefault();
            this.$("#login-form").parsley().validate();
            
            if(this.$("#login-form").parsley().isValid()) {
                app.session.login({
                    username: this.$("#login-username-input").val(),
                    password: this.$("#login-password-input").val()
                }, {
                    success: function(mod, res) {
                        if(DEBUG) console.log("SUCCESS", mod, res);
                    },
                    error: function(err) {
                        if(DEBUG) console.log("ERROR", err);
                        app.showAlert('Bummer dude!', err.error, 'alert-danger'); 
                    }
                });
            } else {
                // Invalid clientside validations thru parsley
                if(DEBUG) console.log("Did not pass clientside validation");

            }
        },
        

        onSignupAttempt: function(evt) {
            if(evt) evt.preventDefault();
            this.$("#signup-form").parsley().validate();

            if(this.$("#signup-form").parsley().isValid()) {
                app.session.signup({
                    username: this.$("#signup-username-input").val(),
                    password: this.$("#signup-password-input").val()
                }, {
                    success: function(mod, res){
                        if(DEBUG) console.log("SUCCESS", mod, res);

                    },
                    error: function(err){
                        if(DEBUG) console.log("ERROR", err);
                        app.showAlert('Uh oh!', err.error, 'alert-danger'); 
                    }
                });
            } else {
                // Invalid clientside validations thru parsley
                if(DEBUG) console.log("Did not pass clientside validation");

            }
        },

        render:function () {
            this.template = _.template(LoginPageTpl); 

            this.$el.append(this.template({ user: app.session.user.toJSON() }));

            
            $(".word-rotate").each(function() {

                var $this = $(this),
                    itemsWrapper = $(this).find(".word-rotate-items"),
                    items = itemsWrapper.find("> span"),
                    firstItem = items.eq(0),
                    firstItemClone = firstItem.clone(),
                    itemHeight = 0,
                    currentItem = 1,
                    currentTop = 0;

                itemHeight = firstItem.height();

                itemsWrapper.append(firstItemClone);

                $this
                    .height(itemHeight)
                    .addClass("active");

                setInterval(function() {

                    currentTop = (currentItem * itemHeight);

                    itemsWrapper.animate({
                        top: -(currentTop) + "px"
                    }, 300, "easeOutQuad", function() {

                        currentItem++;

                        if(currentItem > items.length) {

                            itemsWrapper.css("top", 0);
                            currentItem = 1;

                        }

                    });

                }, 2000);

            });

            return this;
        }

    });

    return LoginView;
});

