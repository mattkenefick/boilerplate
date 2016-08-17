
;(function(namespace) {

    var Colors    = namespace.Colors,
        Keys      = namespace.Keys,
        Events    = namespace.Events,
        Flags     = namespace.Flags,
        State     = namespace.State,
        Constants = namespace.Constants,
        Tracking  = namespace.Tracking
    ;

    namespace.Utility_Geo = {

        // Geo Options
        geoOptions: {
            enableHighAccuracy: true,
            maximumAge        : 30 * 1000,
            timeout           : 25 * 1000
        },

        // <Number> Attempt to get every 30 seconds unless conflicting with our
        // geo settings
        geoFrequency: 30 * 1000,

        // <Interval> Geo Watch
        geoWatch: null,


        // Methods
        // -------------------------------------------------------------

        enable: function() {
            _.bindAll(this, 'getGeolocation', 'onGeoPosition', 'onGeoError', 'onRequestPosition');

            this.getGeolocation();
            this.geoWatch = setInterval(this.getGeolocation, this.geoFrequency);

            namespace.on(Events.GET_GEO, this.onRequestPosition);
        },

        disable: function() {
            clearInterval(this.geoWatch);
            this.geoWatch = null;

            namespace.off(Events.GET_GEO, this.onRequestPosition);
        },

        getGeolocation: function() {
            navigator.geolocation.getCurrentPosition(
                this.onGeoPosition,
                this.onGeoError,
                this.geoOptions
            );
        },


        // Event Handlers
        // -------------------------------------------------------------

        onGeoPosition: function(pos) {
            var lat = pos.coords.latitude.toFixed(3),
                lon = pos.coords.longitude.toFixed(3),
                d   = this.distance,
                t   = this.timeAgo;

            State.set('latitude', lat);
            State.set('longitude', lon);

            State.set('latitude_full', pos.coords.latitude);
            State.set('longitude_full', pos.coords.longitude);

            console.info("Geo event " + lat + " // " + lon, Colors.TRACKING);

            // add timestamp to geo events
            pos.timestamp = Date.now();

            // send to everyone
            namespace.trigger(Events.GEO, pos);
        },

        onGeoError: function(e) {
            // e.code;
            // e.message;
            console.warn( "Geo error // " + e.code + " - " + e.message );

            switch (e.code) {
                case 1:
                case 2:
                case e.PERMISSION_DENIED:

                    if (e.message.toString().indexOf("secure origins") > 0) {
                        // this is an HTTPS error
                    }
                    else {
                        // alert("We require location services to be enabled. This is how we find other players and locations near you.\n\n Please enable them in your settings and restart the app.");
                        modal = new namespace.View_UI_Modal({
                            el: $('#LocationError')
                        });

                        modal.attachEvents();
                        modal.render();
                        modal.animateIn();
                    }

                    // clear watch
                    clearInterval(this.geoWatch);

                    break;

                case e.POSITION_UNAVAILABLE:
                case e.UNKNOWN_ERROR:
                    break;
            }
        },

        onRequestPosition: function(e) {
            navigator.geolocation.getCurrentPosition(this.onGeoPosition);
        }

    };

})(window.pm || (window.pm = {}));
