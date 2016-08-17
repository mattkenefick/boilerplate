/**
 * @package ChalkySticks
 * @authors Matt Kenefick (matt@polymermallard.com)
 * @date    2016-01-01
 */

;(function(namespace) {
    'use strict';

    var Auth           = namespace.Auth,
        Events         = namespace.Events,
        Flags          = namespace.Flags;

    namespace.Page_Login = namespace.Page_Base.extend({

        events: {
            'submit #Login'                : 'onSubmit',
            'click .action-facebook'       : 'onClickFacebook',
            'click .action-twitter'        : 'onClickTwitter'
        },

        name: "Page_Login",

        // <Model_User>
        model: null,

        // <String> Name of script tag containing our template
        templateName: "tpl-auth-login-page",

        // <String> Redirect to URL
        redirectTo: "/",


        // Public Method
        // ---------------------------------------------------------------

        initialize: function(options) {
            options || (options = {});

            // super
            namespace.Page_Base.prototype.initialize.call(this, options);

            // modules
            this.model = new namespace.Model_Users();
        },


        // Event Handlers
        // ---------------------------------------------------------------

        onClickFacebook: function(e) {
            namespace.preventDefault(e);

            Auth.auth0.login({
                connection: 'facebook'
            });

            return false;
        },

        onClickTwitter: function(e) {
            namespace.preventDefault(e);

            Auth.auth0.login({
                connection: 'twitter'
            });

            return false;
        },

        onSubmit: function(e) {
            e.preventDefault();

            var self     = this,
                email    = this.$('[name="email"]').val(),
                password = this.$('[name="password"]').val();

            // disable form
            $('#Login').addClass('disabled');

            // login
            this.model.login({
                email   : email,
                password: password
            })
            .done(function() {
                navigate(self.redirectTo);
            })
            .error(function(resp, type) {
                $('.error-unauthorized').addClass('show-error');

                $('#Login').removeClass('disabled');
            });
        }

    });

})(window.pm || (window.pm = {}));
