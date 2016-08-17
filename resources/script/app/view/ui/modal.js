/**
 * @package ChalkySticks
 * @client  PolymerMallard
 * @authors Matt Kenefick (matt@polymermallard.com)
 */

;(function(namespace) {
    'use strict';

    var Events = namespace.Events;

    namespace.View_UI_Modal = namespace.View_Base.extend({

        events: {
            'click .btn-next': 'onClickNext',
            'click .btn-ok'  : 'onClickSkip',
            'click .btn-skip': 'onClickSkip',
            'click .modal'   : 'onClickModal',
            'click'          : 'onClick'
        },

        tagName: "div",
        className: "modal-wrapper hide",

        // <Slick> Slideshow
        slideshow: null,

        // <View> view class that we'll render if we replace the el
        view: null,


        initialize: function(options) {
            options || (options = {});

            // bindings
            _.bindAll(this, 'onClickClose');

            // super
            namespace.View_Base.prototype.initialize.call(this, options);

            // reset
            this.slideshow = false;

            // view
            if (this.view) {
                this.view.on(Events.CLOSE, this.onClickClose);
            }
        },

        render: function() {
            var $slideshow;

            // super
            namespace.View_Base.prototype.render.call(this);

            // render external view into this modal
            if (this.view) {
                this.$el.html('<div class="modal"></div>');

                this.view
                    .render()
                    .$el
                    .appendTo( this.$el.find('.modal') );
            }
            else {
                // el provided
            }

            return this;
        },

        close: function() {
            this.animateOut();
        },


        // Animation
        // -------------------------------------------------------------------

        animateIn: function() {
            this.$el
                .removeClass('hide')
                .css('opacity', 1)
                .hide()
                .fadeIn();
        },

        animateOut: function() {
            this.$el
                .fadeOut();
        },


        // Event Handlers
        // -------------------------------------------------------------------

        onClick: function(e) {
            this.close();

            this.trigger(Events.CLOSE);
        },

        onClickClose: function(e) {
            this.close();
        },

        onClickModal: function(e) {
            e.preventDefault();
            e.stopPropagation();
        },

        onClickNext: function(e) {
            e.preventDefault();

            // trigger
            this.trigger(Events.NEXT);

            // are we using slideshow?
            if (!this.slideshow) {
                return this.close();
            }

            var current = this.$el.find('.slideshow').slickCurrentSlide(),
                total   = this.$el.find('.slideshow .slide').length;

            if (current == total - 1) {
                this.close();
            }
            else {
                this.$el.find('.slideshow').slickNext();
            }
        },

        onClickSkip: function(e) {
            e.preventDefault();

            this.close()

            this.trigger(Events.CLOSE);
        }

    });

})(window.pm || (window.pm = {}));
