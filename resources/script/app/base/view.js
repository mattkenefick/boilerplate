;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants,
        Events    = namespace.Events,
        Flags     = namespace.Flags,
        State     = namespace.State;

    namespace.View_Base = Backbone.View.extend({

        // <Const>
        _animate_state: Events.ANIMATION_END,

        // <Boolean> enable tabs
        enableTabs: false,

        // <Object> View manager
        views: null,

        // <Boolean> For whether or not the render has happened
        rendered: false,

        // <Object> View UI of tabs manager
        tabs: null,

        // <Object> Template data to combine
        templateData: null,


        initialize: function(options) {
            options || (options = {});

            // bind
            _.bindAll(this, '_onAnimateIn', '_onAnimateOut');

            // merge options
            _.extend(this, options);

            // template data
            this.templateData = {};

            // views
            this.views = new namespace.View_Views(this);
            this.$v    = _.bind(function(x) {
                return this.views.get(x);
            }, this);

            // parent
            this.parent = options.parent || window;

            // template
            if (this.templateName) {
                this.template = $('#' + this.templateName).html();
                this.twig     = twig({ data: this.template });
            }

            if (this.template && (this.isPage || this.autoRender)) {
                this.$el.html( this.twig.render() );
            }

            if (this.enableTabs) {
                this.tabs = new namespace.View_UI_Tabs({
                    el: this.$el
                });
            }

            // events
            // if (Flags.isTablet || Flags.isMobile) {
            //     this.convertToTouch();
            // }
        },

        attachEvents: function() {
            this.detachEvents();
            this.delegateEvents(this.events);

            this.views.execAll('attachEvents');
        },

        detachEvents: function() {
            this.views.execAll('detachEvents');
            this.undelegateEvents();
        },

        convertToTouch: function() {
            _.each(this.events, function(value, key) {
                if (key.indexOf("click") > -1) {
                    delete this.events[key];
                    key = key.replace("click", "tap");
                    this.events[key] = value;
                }
            }, this);
        },

        animateIn: function(options) {
            options || (options = {});

            options.duration = !isNaN(options.duration) ? options.duration : Constants.ANIMATION_DURATION;

            if (this.isHidden()) {
                this.animateOut({ duration: 0 });
            }

            this._onAnimateStart();

            this.$el
                .stop()
                .delay(options.delay || 0)
                .slideDown(options.duration, _.bind(this._onAnimateIn, this));

            return this;
        },

        animateOut: function(options) {
            options || (options = {});

            options.duration = !isNaN(options.duration) ? options.duration : Constants.ANIMATION_DURATION;

            this._onAnimateStart();

            this.$el
                .stop()
                .delay(options.delay || 0)
                .slideUp(options.duration, _.bind(this._onAnimateOut, this));

            return this;
        },

        animateToggle: function(options) {
            if (this._animate_state === Constants.ANIMATE_IN) {
                this.animateOut(options);
            }
            else if (this._animate_state === Constants.ANIMATE_OUT) {
                this.animateIn(options);
            }

            return this;
        },

        hide: function() {
            // this.$el.css('display', '').addClass('hide');
            this.$el.hide();

            return this;
        },

        show: function() {
            // this.$el.css('display', '').removeClass('hide');
            this.$el.show();

            return this;
        },

        fadeIn: function() {
            this.$el
                .removeClass('hide')
                .hide()
                .fadeIn();

            return this;
        },

        template: function(params) {
            return namespace.func.template(this.templateName, params || {});
        },

        decode: function(object, attr_key, val_key) {
            attr_key = attr_key || 'name';
            val_key  = val_key || 'val';

            _.each(object, function(value, key) {
                this.$el.find("[" + attr_key + "=" + key + "]")[val_key](value);
            }, this);
        },

        encode: function(attr_key, val_key) {
            var hash = {};

            attr_key = attr_key || 'name';
            val_key  = val_key || 'val';

            this.$el.find('*[' + attr_key + ']').each(function(e) {
                hash[$(this).prop(attr_key)] = $(this)[val_key]();
            });

            return hash;
        },

        reattachEvents: function() {
            this.detachEvents();
            this.attachEvents();
        },

        reset: function() {
            return this;
        },

        lock: function() {
            this.locked = true;
        },

        unlock: function() {
            this.locked = false;
        },

        setState: function(type) {
            this.$el.addClass('state-' + type);
        },

        unsetState: function(type) {
            this.$el.removeClass('state-' + type);
        },

        unsetAllStates: function(type) {
            this.$el[0].className = this.$el[0].className.replace(/\bstate\-.*?\b/g, '');
        },

        render: function(data) {
            Backbone.View.prototype.render.call(this);

            // state
            this.rendered = true;

            // data
            data   || (data = {});
            config || (config = {});

            // special
            if (this.model) data.model = this.model;
            if (this.collection) data.collection = this.collection;

            data.isLoggedIn   = State['isLoggedIn'] ? State.isLoggedIn() : null;
            data.user         = window['user'] || config['USER'] || { };
            data.userId       = data.user.id || 0;
            data.version      = config.VERSION;
            data.timezoneAbbr = (new Date()).getTimezone();

            data = _.extend(data, this.templateData);

            // render template
            this.twig && this.$el.html( this.twig.render(data) );

            return this;
        },


        // Getters
        // ----------------------------------------------------------

        hasRendered: function() {
            return !!this.rendered;
        },

        isBottomVisible: function() {
            var position = this.$el.position();

            if (position && position.top) {
                return this.$el.outerHeight() + this.$el.position().top < window.innerHeight + $(window).scrollTop();
            }
            else {
                console.log(this.$el, " cannot get position");
            }
        },

        isHidden: function() {
            return !!this.$el.hasClass('hide');
        },

        isLocked: function() {
            return this.locked === true;
        },


        // Internal
        // -------------------------------------------------------------

        _setAnimateStart: function() {
            this._animate_state = Constants.ANIMATE_TRANSITION;
        },

        _setAnimateIn: function() {
            this._animate_state = Constants.ANIMATE_IN;
        },

        _setAnimateOut: function() {
            this._animate_state = Constants.ANIMATE_OUT;
        },


        // Event Handlers
        // -------------------------------------------------------------

        _onAnimateStart: function() {
            this._setAnimateStart();

            this.trigger(Events.ANIMATING);

            // unhide this block
            this.show();
        },

        _onAnimateIn: function() {
            this._setAnimateIn();

            // state
            this.$el.addClass('state-animated-in');

            this.trigger(Events.ANIMATE_IN);
        },

        _onAnimateOut: function() {
            this._setAnimateOut();

            // state
            this.$el.removeClass('state-animated-in');

            this.trigger(Events.ANIMATE_OUT);
        }

    });

})(window.pm || (window.pm = {}));
