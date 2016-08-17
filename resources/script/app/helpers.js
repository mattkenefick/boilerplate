
// Namespace structure example
// -----------------------------------------------------------------------

;(function(namespace) {
    'use strict';


})(window.pm || (window.pm = {}));


// Super shorthand
// ------------------------------------------------------------------------

Object.defineProperty(window, 'a', {
    get: function(){
        return pm.app;
    }
});

Object.defineProperty(window, 'p', {
    get: function(){
        return pm.State.page;
    }
});

Object.defineProperty(window, 's', {
    get: function(){
        return pm.State;
    }
});

Object.defineProperty(window, 'u', {
    get: function(){
        return pm.State.currentUser();
    }
});


// Extend Backbone
//
// These methods extend Backbone beyond standard behavior
// ------------------------------------------------------------------------

Backbone.View.prototype.log = function() {
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);

    args.unshift("[" + this.name + "]");

    console.log.apply(console, args);
};

Backbone.View.prototype.warn = function() {
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);

    args.unshift("[" + this.name + "]");

    console.warn.apply(console, args);
};

Backbone.View.prototype.color = function() {
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);

    args.push(pm.Colors.VIEW);
    args.unshift("[" + this.name + "] ");

    console.color.apply(console, args);
};


// Global Methods
// ------------------------------------------------------------------------

/**
 * asset
 *
 * @param url <String>   URL of asset to load
 *
 * This will determine the type of protocol required based on the server
 * to eliminate insecure asset warnings.
 */
function asset(url)
{
    var protocol = pm.Constants.PROTOCOL;

    if (protocol.length > 0) {
        url = url.replace('http://', protocol + '://');
    }

    return url;
}

/**
 * navigate
 *
 * @param url <String>   URL to navigate to
 *
 * Determines whether or not to use hard loading or soft loading of
 * urls based on their structure and the app.
 */
function navigate(url)
{
    if (pm.Flags.useRouting) {
        // update current states
        history.replaceState(
            _.extend(history.state || {}, {
                scrollTop: document.body.scrollTop || $(document).scrollTop()
            }),
            document.title,
            window.location
        );

        if (location.hostname) {
            url = url.replace(config.BASE_URL + '/', '');
            url = url.replace(location.hostname + '/', '');
        }
        url = url.replace('http:', '');
        url = url.replace('https:', '');
        url = url.replace(/\/$/, '');

        // navigate to new url
        Backbone.history.navigate( url, {
            trigger: true
        });
    }
    // else if (ignoreRoutes) {
    else if (typeof url == 'string') {
        $('html').addClass('loading-page');

        window.location = url;
    }
}

/**
 * refresh
 *
 * Determines the most appropriate way to refresh a page.
 */
function refresh()
{
    var url = window.location.href;
        url = url.replace('http:', '');
        url = url.replace('https:', '');

    Backbone.history.fragment = null;
    Backbone.history.navigate( url.replace(config.BASE_URL + '/', ''), { trigger: true } );
}

if (!console['color']) {
    console.color = console.log;
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


// Windows Fixes
// -----------------------------------------------------------------------

if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(
        document.createTextNode(
            "@-ms-viewport{width:auto!important}"
        )
    );
    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}
