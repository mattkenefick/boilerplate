
;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants,
        Events    = namespace.Events,
        Flags     = namespace.Flags,
        State     = namespace.State;

    namespace.Model_Users = namespace.Model_Base.extend({

        // public
        id         : null,
        name       : null,
        slug       : null,
        email      : null,
        phone      : null,
        lat        : null,
        lon        : null,
        status     : null,
        is_social  : null,
        is_facebook: null,
        is_twitter : null,
        created_at : null,
        updated_at : null,

        // models
        accomplishments: null,
        checkins       : null,
        games          : null,
        media          : null,
        meta           : null,
        transactions   : null,

        // api
        url: Constants.API_URL + "/users/{id}/",

        // maps
        model_map: {
            'accomplishments': 'Collection_Accomplishments',
            'checkins'       : 'Collection_Venues',
            'games'          : 'Collection_Meta',
            'media'          : 'Collection_Media',
            'meta'           : 'Collection_Meta'
        },


        initialize: function() {
            // bindings
            _.bindAll(this, 'onUserLogin');

            // super
            namespace.Model_Base.prototype.initialize.apply(this, arguments);

            // collections
            this.transactions = new namespace.Collection_Transactions({
                user_id: this.id
            });
        },


        // Actions
        // -------------------------------------------------------------

        socialLogin: function(attributes) {
            return $.post(
                Constants.API_URL + "/auth/social/",
                attributes,
                this.onUserLogin
            );
        },

        login: function(attributes) {
            return $.post(
                Constants.API_URL + "/auth/login/",
                {
                    email: attributes.email,
                    password: attributes.password
                },
                this.onUserLogin
            );
        },

        forgotPassword: function(attributes) {
            var self = this;

            return $.post(Constants.API_URL + "/auth/forgot-password/", {
                email: attributes.email
            }, function(response, status) {
                if (status == "success" && response.token) {
                    State.updateCacheKey();
                }
            });
        },

        resetPassword: function(attributes) {
            var self = this;

            return $.post(Constants.API_URL + "/auth/forgot-password/" + attributes.token, {
                password: attributes.password
            }, function(response, status) {
                if (status == "success" && response.token) {
                    State.updateCacheKey();
                }
            });
        },

        logout: function() {
            var self = this;

            return $.ajax({
                url    : Constants.API_URL + "/auth/logout/",
                cache  : false,
                headers: {
                    'Authorization-API': "Bearer " + State.get('token')
                },
                success: function(response, status) {
                    State.updateCacheKey();
                }
            });
        },

        me: function() {
            var self = this,
                token = State.get('token') || namespace.TOKEN;

            return $.ajax({
                url    : Constants.API_URL + "/me/",
                cache  : false,
                headers: {
                    'Authorization-API': "Bearer " + token
                },
                success: function(response, status) {
                    self.set(response);
                }
            });
        },

        fetchMessagesCount: function() {
            var self = this;

            return $.ajax({
                url    : Constants.API_URL + "/messages/count/",
                cache  : false,
                headers: {
                    'Authorization-API': "Bearer " + State.get('token')
                },
                success: function(response, status) {
                    if (status == "success") {
                        // set message count
                        State.set("messageCount", response);
                    }

                    // update
                    State.updateCacheKey();
                }
            });
        },


        // Getters
        // -------------------------------------------------------------

        getCreatedAt: function(formatted, format) {
            return formatted
                ? moment( moment.utc(this.get('created_at').date).toDate() ).format(format = format || 'MMMM Do, YYYY')
                :  this.get('created_at');
        },

        getBeaconsSent: function() {
            return this.getMetaValue("beacons_sent") || 0;
        },

        getBio: function() {
            return this.getMetaValue("brief_bio");
        },

        /**
         * @todo
         * Hook this up to actual API
         */
        getLastLocation: function() {
            return this.getMetaValue("last_location") || "";
        },

        getName: function() {
            return this.get('name');
        },

        getSlug: function() {
            return this.get('slug');
        },

        getEmail: function() {
            return this.get('email');
        },

        getPhone: function() {
            return this.get('phone');
        },

        getLatitude: function() {
            return this.get('lat');
        },

        getLongitude: function() {
            return this.get('lon');
        },

        getHometown: function() {
            return this.getMetaValue("hometown");
        },

        getStatus: function() {
            return this.get('status');
        },

        getTalentLevel: function() {
            return this.getMetaValue("talent_level");
        },

        getThumbnailURL: function() {
            if (this.media && this.media.length) {
                return this.media.at(0).getURL();
            }

            return config.BASE_URL + "image/social/avatar.default.jpg";
        },

        getURL: function() {
            return "/users/" + this.id;
        },

        isMe: function() {
            return window.user && window.user.id == this.id;
        },

        isCheckedIn: function() {
            return false;
        },

        isSocial: function() {
            return this.get('is_social');
        },

        isFacebook: function() {
            return this.get('is_facebook');
        },

        isTwitter: function() {
            return this.get('is_twitter');
        },

        canAutoCheckin: function() {
            return this.getMetaValue('autocheckin') == 1;
        },


        // Helpers
        // -----------------------------------------------------------------

        hasGameValue: function(field) {
            var field;

            if (!this.games) return false;

            if (field = this.games.findWhere({ key: field }) ) {
                return true;
            }

            return false;
        },

        getMetaValue: function(field) {
            var field;

            if (!this.meta) return false;

            if (field = this.meta.findWhere({ key: field }) ) {
                return field.get('value');
            }

            return "";
        },


        // Event Handlers
        // ------------------------------------------------------------------

        onUserLogin: function(response, status) {
            if (status == "success" && response.token) {

                // set jwt token
                State.set("token", response.token);

                // user
                State.set("user", response.user);

                // set user data
                this.set(response.user);

                // user cache
                State.updateCacheKey();

                // trigger
                namespace.trigger(Events.LOGIN, response);
            }
        }

    });

})(window.pm || (window.pm = {}));
