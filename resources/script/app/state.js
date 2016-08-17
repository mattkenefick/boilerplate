/**
 * @package Short Of The Week
 * @authors Matt Kenefick (matt@polymermallard.com)
 * @date    2014-06-23 17:54:25
 * @version $Id$
 */

;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants,
        Colors    = namespace.Colors,
        Events    = namespace.Events,
        Flags     = namespace.Flags
    ;

    namespace.State = _.extend(namespace.State || {}, {

        // <Array> Exclude objects from being saved
        exclude: ["payment"],

        // <Boolean> Whether or not we should autosave features
        autoSave: true,

        // <Number> Time of when the app started
        startTime: Date.now(),

        // <Number> Starting cache key
        cbKey: Date.now(),

        // <Bool> prevents router from using transitions
        disableTransition: false,

        // <Int> scroll position (so we can return to last position)
        scrollPositionY: 0,

        // <Int> keep track of our width
        windowWidth: 0,

        // <Int> keep track of our height
        windowHeight: 0,

        // <Object> general mouse position
        mouse: {
            x   : 0,
            y   : 0,
            down: false
        },

        // <Number> latitude
        latitude: null,

        // <Number> longitude
        longitude: null,

        // <Number> latitude (full digits)
        latitude_full: null,

        // <Number> longitude (full digits)
        longitude_full: null,

        // <Number> Duration of beacon
        beacon: 0,

        // <Number> Number of new messages
        messageCount: 0,

        // <View> current active page
        page: null,

        // <Model_Payment>
        payment: new namespace.Model_Payments,

        // <Model\User> Active or anonymous user of the site
        user: null,

        // <String> JWT token requested by user
        token: null,


        // Actions
        // --------------------------------------------------------------------



        set: function(key, value) {
            // only allow keys that we have default values for
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }

            // save
            this.autoSave && this.save();
        },

        append: function(key, value) {
            var array = this.get(key) || [];
            array.push(value);

            // only allow keys that we have default values for
            if (this.hasOwnProperty(key)) {
                this[key] = array;
            }

            // save
            this.autoSave && this.save();
        },

        unset: function(key) {
            this[key] = null;

            // save
            this.autoSave && this.save();
        },

        get: function(key) {
            return this[key];
        },

        has: function(key) {
            return typeof this[key] != 'undefined';
        },

        save: function() {
            if (!Flags.hasLocalStorage) {
                return console.color("[State] LocalStorage unavailable, perhaps you're in private mode.", Colors.DEBUG);
            }

            var objects = {},
                x       = this;

            // only get variables
            for (var i in x) {
                if (
                    // properties it already has
                    this.hasOwnProperty(i)

                    // that are not excluded
                 && !_(this.exclude).contains(i)

                    // that are not functions
                 && typeof(x[i]) != 'function'
                 ) {
                    // and aren't views
                    if (x[i] != null && typeof(x[i]) == 'object' && x[i].cid) {

                        // convert
                        if (x[i].attributes) {
                            console.color("[State] Converting Backbone " + i + ", " + x, Colors.DEBUG);

                            x[i] = x[i].attributes;
                        }
                        else {
                            continue;
                        }
                    }

                    objects[i] = x[i];
                }
            }

            // save
            localStorage.setItem('state', JSON.stringify(objects));
        },

        load: function() {
            if (!Flags.hasLocalStorage) {
                return console.color("[State] LocalStorage unavailable, perhaps you're in private mode.", Colors.DEBUG);
            }

            var stored  = localStorage.getItem('state') || "{}",
                objects = JSON.parse(stored);

            // log
            console.color("[State] Loading settings and users.", Colors.DEBUG);

            // load
            _.extend(this, objects);
        },

        debug: function() {
            var objects = {},
                x       = this;

            // only get variables
            for (var i in x) {
                if (this.hasOwnProperty(i) && typeof(x[i]) != 'function') {
                    objects[i] = {
                        value: x[i]
                    }
                }
            }

            console.table(objects);

            return null;
        },


        // Specifics
        // -----------------------------------------------------------------

        logout: function() {
            window.user && window.user.logout();

            this.unset('token');
            this.unset('user');

            window.user = null;
        },

        hasToken: function() {
            return !this.get('token') || this.get('token').length > 0;
        },

        isLoggedIn: function() {
            return this.get('token') && window.user && window.user.id > 0;
        },

        updateCacheKey: function() {
            console.log( "CBK" + Date.now() );

            return this.cbKey = Date.now();
        }

    });

    // immediate load of settings
    namespace.State.load();


})(window.pm || (window.pm = {}));
