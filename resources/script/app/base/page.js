
;(function(namespace) {
    'use strict';

    var Events = namespace.Events,
        Colors = namespace.Colors,
        Flags  = namespace.Flags;

    namespace.Page_Base = namespace.View_Base.extend({

        // <Array> Matches objects in URL
        urlObjects: null,

        // <String> Override pattern to match for URL Objects
        urlPattern: "",


        initialize: function(options) {
            options || (options = {});

            // bind
            _.bindAll(this, 'onClickMenuToggle', 'onData');

            // get url objects
            this.urlObjects = location.pathname.match(this.urlPattern);

            // super
            namespace.View_Base.prototype.initialize.call(this, options);
        },

        attachEvents: function() {
            // super
            namespace.View_Base.prototype.attachEvents.call(this);

            $('.action-menu').on('click', this.onClickMenuToggle);
            $('.action-back-page a').on('click', this.onClickBack);
        },

        detachEvents: function() {
            // super
            namespace.View_Base.prototype.detachEvents.call(this);

            $('.action-menu').off('click', this.onClickMenuToggle);
            $('.action-back-page a').off('click', this.onClickBack);
        },


        // Animation
        // -------------------------------------------------------------------

        animateIn: function() {
            // state
            this.$el.addClass('state-animated-in');

            return Flags.useTransitions ? this.$el.fadeIn() : this.$el.show();
        },

        animateOut: function() {
            // state
            this.$el.removeClass('state-animated-in');

            return Flags.useTransitions ? this.$el.fadeOut() : this.$el.hide();
        },

        render: function() {
            // super
            namespace.View_Base.prototype.render.apply(this, arguments);

            // remove old page classes
            namespace.$body[0].className = namespace.$body[0].className.replace(/\bpg-\-.*?\b/g, '');

            // body
            namespace.$body.addClass("rendered");
            namespace.$body.addClass("pg-" + this.name);
        },


        // Event Handlers
        // -------------------------------------------------------------------

        onClickBack: function(e) {
            e.preventDefault();

            window.history.back();
        },

        onClickMenuToggle: function(e) {
            e.preventDefault();

            $('body').toggleClass("menu-open");
        },

        onData: function(response, status, xhr) {
            this.render();
        },

        onAnimatedIn: function() {
            // called from router
            if (history.state && history.state.scrollTop) {
                this.color("Setting scroll position to " + history.state.scrollTop);
            }
        },

        onAnimatedOut: function() {
            // called from router
        }

    });

})(window.pm || (window.pm = {}));