
;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants,
        Flags     = namespace.Flags;

    namespace.Model_Feed = namespace.Model_Base.extend({

        // public
        id           : null,
        html_message : null,
        plain_message: null,
        type         : null,
        lat          : null,
        lon          : null,
        distaince    : null,
        created_at   : null,
        updated_at   : null,

        // api
        url: Constants.API_URL + "/feed/{id}/",


        // Getters
        // -------------------------------------------------------------

        getDistance: function(round) {
            var distance = round ? parseFloat(this.get('distance')).toFixed(round) : this.get('distance');

            return isNaN(distance) ? "Unknown" : distance;
        },

        getDistanceFormatted: function(round) {
            var distance = round ? parseFloat(this.get('distance')).toFixed(round) : this.get('distance');

            return isNaN(distance) ? this.getCity() + ", " + this.getState() : distance + " mi";
        },

        getLatitude: function() {
            return this.get('lat');
        },

        getLongitude: function() {
            return this.get('lon');
        },

        getMessage: function() {
            return this.get('html_message');
        },

        getType: function() {
            return this.get('type');
        },

        getCreatedAt: function(formatted, format) {
            return formatted
                ? moment( moment.utc(this.get('created_at')).toDate() ).format(format = format || 'MMMM Do, YYYY')
                :  this.get('created_at');
        },

        getCreatedAtFromNow: function() {
            return moment( moment.utc(this.get('created_at')).toDate() ).fromNow();
        }

    });

})(window.pm || (window.pm = {}));
