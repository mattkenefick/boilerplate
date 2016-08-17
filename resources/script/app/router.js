/**
 * @package ChalkySticks
 * @authors Matt Kenefick (matt@polymermallard.com)
 */

;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants,
        Events    = namespace.Events,
        State     = namespace.State
    ;

    namespace.Router = Backbone.Router.extend({

        // <Array> List of fragments that we have visited
        history: null,

        routes: {
            ":any": {
                "action": "route_404",
                "auth": false
            },

            "": {
                "page": "Page_Home"
            },

            "beacons": {
                "page": "Page_Beacons"
            },

            "feed": {
                "page": "Page_Feed"
            },

            "help": {
                "page": "Page_Help"
            },

            "forgot-password/:token": {
                "action": "route_forgotPassword",
                "page": "Page_ForgotPassword_Reset"
            },

            "forgot-password": {
                "page": "Page_ForgotPassword"
            },

            "leagues": {
                "page": "Page_Leagues"
            },

            "leagues/games/:id": {
                "action": "route_generalID",
                "page": "Page_Leagues_Games_Single"
            },

            "leagues/matches/:id": {
                "action": "route_generalID",
                "page": "Page_Leagues_Matches_Single"
            },

            "leagues/matches/:id/games": {
                "action": "route_generalID",
                "page": "Page_Leagues_Matches_Games"
            },

            "leagues/nights/:id": {
                "action": "route_generalID",
                "page": "Page_Leagues_Nights_Single"
            },

            "leagues/nights/:id/matches": {
                "action": "route_generalID",
                "page": "Page_Leagues_Nights_Matches"
            },

            "leagues/players/:id": {
                "action": "route_generalID",
                "page": "Page_Leagues_Players_Single"
            },

            "leagues/teams/:id/nights": {
                "action": "route_generalID",
                "page": "Page_Leagues_Teams_Nights"
            },

            "leagues/teams/:id/roster": {
                "action": "route_generalID",
                "page": "Page_Leagues_Teams_Roster"
            },

            "leagues/teams/:id/nights/new": {
                "action": "route_generalID",
                "page": "Page_Leagues_Teams_Nights_Create"
            },

            "leagues/teams/:id": {
                "action": "route_generalID",
                "page": "Page_Leagues_Teams_Single"
            },

            "leagues/teams/new": {
                "page": "Page_Leagues_Teams_Create"
            },

            "login": {
                "page": "Page_Login"
            },

            "logout": {
                "page": "Page_Logout"
            },

            "map": {
                "page": "Page_Map"
            },

            "messages": {
                "page": "Page_Messages",
                "auth": true
            },

            "messages/:id": {
                "action": "route_message",
                "page": "Page_Messages_Single",
                "auth": true
            },

            "news": {
                "page": "Page_News"
            },

            "news/:id": {
                "action": "route_news",
                "page": "Page_News_Single"
            },

            "places": {
                "page": "Page_Places"
            },

            "places/:id": {
                "action": "route_place",
                "page": "Page_Places_Single"
            },

            "places/new": {
                "page": "Page_Places_Create"
            },

            "places/:id/revise": {
                "action": "route_place",
                "page": "Page_Places_Revise"
            },

            "poolpad": {
                "page": "Page_Poolpad"
            },

            "poolpad/:id": {
                "action": "route_poolpad",
                "page": "Page_Poolpad_Single"
            },

            "register": {
                "page": "Page_Register"
            },

            "scorekeeper": {
                "page": "Page_Scorekeeper"
            },

            "settings": {
                "page": "Page_Settings"
            },

            "tournaments": {
                "page": "Page_Tournaments"
            },

            "tournaments/:id": {
                "action": "route_tournaments",
                "page": "Page_Tournaments_Single"
            },

            "tournaments/:id/bracket": {
                "action": "route_tournaments",
                "page": "Page_Tournaments_Bracket"
            },

            "tv": {
                "page": "Page_TV"
            },

            "users/:id": {
                "action": "route_user",
                "page": "Page_Users_Single"
            },

            "videos": {
                "page": "Page_Videos"
            },

            "videos/:id": {
                "action": "route_video",
                "page": "Page_Videos_Single"
            }
        },


        // Filters
        // -------------------------------------------------------------------

        filter: function(options) {
            // check authorization
            if (options.auth && Constants.REQUIRE_AUTH && !this.filter_auth()) {
                return this.route_unauthorized;
            }

            return true;
        },

        filter_auth: function() {
            return State.isLoggedIn();
        },


        // Routes
        // -------------------------------------------------------------------

        route_404: function(options, params) {
            return this.route_page({
                page: "Page_404"
            });
        },

        route_fallback: function(options) {
            return this.route_page(options);
        },

        route_unauthorized: function(options) {
            console.log("You aren't authorized to see this page.");

            if (Constants.REQUIRE_AUTH) {
                return navigate("login");
            }
            else {
                return navigate("");
            }
        },

        route_page: function(options, params) {
            var instance,
                page;

            // create new class
            page     = namespace[options.page];
            instance = new page(params);

            // instance
            this.transition(instance);
        },

        route_generalID: function(options, token) {
            return this.route_page(options, {
                token: token
            });
        },

        route_forgotPassword: function(options, token) {
            return this.route_page(options, {
                token: token
            });
        },

        route_message: function(options, id) {
            return this.route_page(options, {
                id: id
            });
        },

        route_news: function(options, id) {
            return this.route_page(options, {
                id: id
            });
        },

        route_place: function(options, id) {
            return this.route_page(options, {
                id: id
            });
        },

        route_poolpad: function(options, id) {
            return this.route_page(options, {
                id: id
            });
        },

        route_tournaments: function(options, id) {
            return this.route_page(options, {
                id: id
            });
        },

        route_user: function(options, id) {
            return this.route_page(options, {
                id: id
            });
        },

        route_video: function(options, id) {
            return this.route_page(options, {
                id: id
            });
        },


        // Getters / Setters
        // -------------------------------------------------------------------

        getPagesLoaded: function() {
            return this.history.length;
        },

        getPreviousFragment: function() {
            return this.history[this.history.length - 1];
        },

        getPageObject: function(fragment) {
            return namespace[namespace.URLs[fragment]];
        },


        // Transition
        // ------------------------------------------------------

        transition: function(instance, force) {
            // current page
            if (instance === State.page && !force) {
                return Log.router("We're already on this page.");
            }

            if (State.isLoggedIn()) {
                $('body').removeClass('logged-out');
                $('body').addClass('logged-in');
            }
            else {
                $('body').addClass('logged-out');
                $('body').removeClass('logged-in');
            }

            // disable the menu
            $('body').removeClass('menu-open');

            // animate out
            if (State.page) {
                State.page.detachEvents();
                State.page.animateOut();

                // setTimeout(function(scope, page) {
                    namespace.$body.removeClass("pg-" + State.page.name);
                    State.page.$el.remove();
                // }, 500, this, State.page);
            }

            // set history
            this.history.push(Backbone.history.fragment);

            // render
            instance.render();
            instance.attachEvents();
            setTimeout(function() {
                instance.animateIn();
            }, 2);

            // history
            if (this.history.length > 1 && location.hash != "") {
                $('body').addClass('has-back-page');
            }
            else {
                $('body').removeClass('has-back-page');
            }

            // add to body
            namespace.$main.prepend(instance.$el);

            // history
            if ($('footer.requires-login').length >= 1) {
                $('body').addClass('has-footer-via-login');
            }
            else if ( $('footer').length >= 1) {
                $('body').addClass('has-footer');
            }
            else {
                $('body').removeClass('has-footer-via-login has-footer');
            }

            // tracking
            if (config.IS_APP && window['ga']) {
                window.ga.trackView(instance.name);
                window.ga.trackEvent('Router', location.hash, 'Hash', location.hash);
            }
            else if (!config.IS_APP && window['ga']) {
                ga('send', 'pageview', instance.name);
                ga('send', 'event', 'Router', location.hash, 'Hash', location.hash);
            }

            // change page
            State.page = instance;
        },

        reload: function() {
            var fragment = Backbone.history.fragment,
                newpage;

            // rebuild page
            newpage = new State.page.constructor.prototype.constructor(State.page.options);

            // remove old history
            this.history.pop();

            // go to page
            this.transition(newpage, true);
        },

        back: function() {
            var url;

            if (this.history.length < 2) {
                Log.router("No where to go");

                return false;
            }

            // remove
            this.history.pop();
            url = this.history.pop();

            // move
            // Utility_URL.go(url);
        },

        start: function() {
            Backbone.history.start({
                pushState: false,
                root     : "/"
            });
        },

        /**
         * Bust up the route object we have above
         * and apply methods
         */
        checkRoute: function(route) {
            var self = this;

            return function() {
                var handler = _.findWhere(Backbone.history.handlers, { route_key: route });
                var regex   = new RegExp(handler.route);
                var matches = Backbone.history.fragment.match(regex);
                var method  = 'route_fallback';

                // remove basic route
                matches.shift();

                // set target method
                if (self.routes[route]['action']) {
                    if (self[self.routes[route]['action']]) {
                        method = self.routes[route]['action'] || method;
                    }
                    else {
                        // console.warn("[Router] Target action doesn't exist", self.routes[route]['action']);
                    }
                }

                // filter the routes
                var filter_method = self.filter(self.routes[route]),
                    params = _.union([self.routes[route]], matches);

                if (filter_method === true) {
                    self[method].apply(self, params);
                }
                else {
                    filter_method.apply(self, params);
                }

                // tell everyone
                namespace.trigger(Events.ROUTE, {
                    route: route,
                    params: params,
                    method: method
                });
            };
        },

        initialize: function(options) {
            options || (options = {});

            // bindings
            _.bindAll(this, 'filter');

            // super
            Backbone.Router.prototype.initialize.call(this, options);

            // default
            this.history = [];

            // create routes
            for (var key in this.routes) {
                // set routes
                this.route(key, this.checkRoute(key));

                // update
                Backbone.history.handlers[0].route_key = key;
            }

            // bind
            $('body').on('click', '.action-back', function(e) {
                e.preventDefault();

                window.router.back();
            });
        }

    });

})(window.pm || (window.pm = {}));

