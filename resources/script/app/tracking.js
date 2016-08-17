
/**
 * Tracking
 *
 * Globalized tracking class that will handle Google Analytics,
 * PIWIK, and anything else required. Logging and history available.
 */
;(function(namespace) {
    'use strict';

    var Events    = namespace.Events,
        Colors    = namespace.Colors,
        Constants = namespace.Constants;

    namespace.Tracking = {

        // vars
        index   : 0,
        category: null,
        queue   : [],

        add: function(category, action, value) {
            if (window['_gaq']) {
                // log
                console.color("[Tracking] " + category + " | " + action + " = " + value, Colors.TRACKING);

                // track
                _gaq.push(['_trackEvent', category, action, '' + value]);
            }
            else {
                console.warn("[Tracking] Tracking for _gaq could not be found.");
            }

            if (window['_paq']) {
                _paq.push(['trackEvent', category, action, '' + value]);
            }
            else {
                console.warn("[Tracking] Tracking for _paq could not be found.");
            }
        }

    };

    _.extend(namespace.Tracking, Backbone.Events);

})(window.pm || (window.pm = {}));
