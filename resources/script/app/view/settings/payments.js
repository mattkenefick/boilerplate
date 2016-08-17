
;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants,
        Events    = namespace.Events,
        State     = namespace.State;

    namespace.View_Settings_Payments = namespace.View_Base.extend({

        name: "View_Settings_Payments",

        // <Model_User>
        model: null,

        // <String> Template name
        templateName: "tpl-settings-payments",


        // Public Methods
        // ----------------------------------------------------------------

        initialize: function(options) {
            options || (options = {});

            // bindings
            _.bindAll(this, 'onData');

            // super
            namespace.View_Base.prototype.initialize.call(this, options);

            // get payments
            this.collection = this.model.transactions;

            // events
            this.collection
                .fetch()
                .success(this.onData);
        },


        // Event Handlers
        // ----------------------------------------------------------------

        onData: function(e) {
            this.render();
        }

    });

})(window.pm || (window.pm = {}));
