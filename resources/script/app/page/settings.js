/**
 * @package ChalkySticks
 * @authors Matt Kenefick (matt@polymermallard.com)
 * @date    2016-01-01
 */

;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants,
        Events    = namespace.Events,
        Flags     = namespace.Flags,
        State     = namespace.State;

    namespace.Page_Settings = namespace.Page_Base.extend({

        events: {
            "click .action-tab": "onClickTab"
        },

        name: "Page_Settings",

        // <Model_User>
        model: null,

        // <String> Name of script tag containing our template
        templateName: "tpl-auth-settings-page",

        // <Boolean> Enable tabs that are built into View_Base
        enableTabs: false,


        // Public Method
        // ---------------------------------------------------------------

        initialize: function(options) {
            options || (options = {});

            // super
            namespace.Page_Base.prototype.initialize.call(this, options);

            // modules
            this.model = window.user || new namespace.Model_Users();

            // get user data
            if (this.model.id) {
                this.model
                    .fetch()
                    .done(this.onData);
            }

            // add views
            this.views.add(new namespace.View_Settings_Details({
                model: this.model
            }), 'details');

            this.views.add(new namespace.View_Settings_Payments({
                model: this.model
            }), 'payments');

            this.views.add(new namespace.View_Settings_Notifications({
                model: this.model
            }), 'notifications');

            // set view
            this.view = this.$v('details');
        },

        render: function() {
            // super
            namespace.Page_Base.prototype.render.call(this);

            // render
            this.view
                .setElement( this.$('.page-auth-settings') )
                .render();

            return this;
        },


        // Event Handlers
        // -------------------------------------------------------------------

        onClickTab: function(e) {
            e.preventDefault();

            var target = $(e.currentTarget).attr('data-target');

            // set view
            this.view = this.$v(target);

            // render
            this.render();
        }

    });

})(window.pm || (window.pm = {}));
