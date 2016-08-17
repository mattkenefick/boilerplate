
/**
 * Main
 *
 * This doesn't really change from app-to-app all that much. It has Constants,
 * Flags, Keys, Colors, additional functionality, deferrable actions (until load
 * is true), etc.
 */
;(function(namespace) {
    'use strict';

    var UA               = navigator.userAgent,
        isIFrame         = window !== window.top,
        isFile           = location.protocol.indexOf('file') > -1,
        isLocal          = /dev./.test(location.hostname) || isFile,
        isStaging        = /staging/.test(location.hostname),
        isIOS            = /ip(hone|od|ad)/i.test(UA),
        isiPhone         = /ip(hone)/i.test(UA),
        isMobile         = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()),
        isAndroid        = /android/i.test(UA),
        isAndroidBrowser = /android (?!.*(chrome|kindle))/i.test(UA),
        isChrome         = /chrome/i.test(UA) && !isAndroidBrowser,
        isWindows        = /windows/i.test(UA),
        isIE             = /msie[0-9.; ]+windows/i.test(UA),
        isIE9            = /msie 9/i.test(UA),
        isFirefox        = /firefox/i.test(UA),
        isSafari         = /safari/i.test(UA) && !/chrome/i.test(UA),
        isSafari5        = /version\/5\..+ safari/i.test(UA),
        isSafariMac      = isSafari && !isWindows && !isIOS,
        isSafariWin      = isWindows && isSafari,
        isTablet         = Modernizr.touch && !isWindows,
        isDebug          = window.DEBUG_MODE,
        ieVersion        = UA.match(/msie\s?([0-9]+)/i),
        firefoxVersion   = UA.match(/firefox\/([0-9]+)/i),
        safariVersion    = UA.match(/version\/([0-9]+)/i),
        hasPushState     = !!window.history && !!window.history.pushState,

        Colors = namespace.Colors = {
            ACTION       : { background: "#c39",    color: "#fff" },
            CAST         : { background: "#64056d", color: "#d6a2f4" },
            CRITICAL     : { background: "#f00",    color: "#fff" },
            IMPORTANT    : { background: "#dcf9dd", color: "#4e8e4e" },
            DEBUG        : { background: "#0E5342", color: "#93d9c7" },
            DEFER        : { background: "#f4f5cb", color: "#b4ba09" },
            LIST         : { background: "#e2eea9", color: "#708410" },
            LOADING      : { background: "#2099cd", color: "#fff" },
            PAGE         : { background: "#206bb7", color: "#cedff0" },
            PROGRESS     : { background: "#2099cd", color: "#ddd" },
            NAV          : { background: "#9cf",    color: "#333" },
            SEMI_CRITICAL: { background: "#f66",    color: "#eee" },
            SOCIAL       : { background: "#c3f1c2", color: "#357733" },
            SOUND        : { background: "#003300", color: "#66FF66" },
            TRACKING     : { background: "#c3f1c2", color: "#357733" },
            VIEW         : { background: "#fce6bc", color: "#b5862b" },
            VIDEO        : { background: "#00587e", color: "#fff" },
            VIDEO_ACTION : { background: "#00587e", color: "#ccc" },
            WARN         : { background: "#f8ea6c", color: "#9c6d1b" },

            WHITE : 0xffffff,
            BLUE  : 0x41c4d8,
            PINK  : 0xec9698,
            GREEN : 0x8ac635,
            RED   : 0xeb267a,
            YELLOW: 0xfcce00
        },

        Constants  = namespace.Constants = {
            ANIMATION_DURATION   : 250,
            API_URL              : config.API_URL        || "//dev.api.chalkysticks.com/v1",
            SOCKET_URL           : config.SOCKET_URL     || "//localhost:5002",
            USERSOCKET_URL       : config.USERSOCKET_URL || "//localhost:5003",
            IMAGE_HOST           : "",
            REQUIRE_AUTH         : true,
            CONTENT_PER_PAGE     : 15,
            PROTOCOL             : location.protocol.toString().replace(/[^htps]/g, '') || "https",
            BEACON_DURATION      : 3 * 60,
            BEACON_DISTANCE      : 5
        },

        Events = namespace.Events = {
            ADD            : 'add',
            ADD_NEXT       : 'add:next',
            ADD_PREVIOUS   : 'add:previous',
            ANIMATION_START: 'animation:start',
            ANIMATION_END  : 'animation:end',
            BACK           : 'back',
            BLUR           : 'blur',
            CLICK          : 'click',
            COMPLETE       : 'complete',
            EMPTY          : 'empty',
            ERROR          : 'error',
            FOCUS          : 'focus',
            GEO            : 'geo',
            REVGEO         : 'geo:rev',
            GET_GEO        : 'geo:get',
            MENU_CLOSE     : 'menu:close',
            MENU_OPEN      : 'menu:open',
            MOUSE_DOWN     : 'mousedown',
            MOUSE_IDLE     : 'mouseidle',
            MOUSE_MOVE     : 'mousemove',
            MOUSE_OUT      : 'mouseout',
            MOUSE_OVER     : 'mouseover',
            MOUSE_UP       : 'mouseup',
            NAV            : 'nav',
            NEXT           : 'next',
            PROGRESS       : 'progress',
            REMOVE         : 'remove',
            RESUME         : 'resume',
            RESIZE         : 'resize',
            ROUTE          : 'route',
            SCROLL         : 'scroll',
            SUCCESS        : 'success',
            TAB_UNFOCUSED  : 'tab:unfocused',
            TAB_FOCUSED    : 'tab:focused',
            TRIGGER        : 'trigger',
            WINDOW_RESIZE  : 'window:resize',


            // Backbone
            // -----------------------

            FETCH_DATA   : 'fetch:data',
            FETCH_ERROR  : 'fetch:error',
            FETCH_SUCCESS: 'fetch:success',


            // App Specific
            // --------------------------

            DECLARE_WINNER: 'winner',
            SEND_TO_B_SIDE: 'sendtobside',
            BEACON_START : 'beacon:start',
            BEACON_STOP  : 'beacon:stop',
            LOGIN        : 'login'
        },

        Flags = namespace.Flags = {
            isFile          : isFile,
            isMobile        : location.hostname == "m.chalkysticks.com" || isMobile,
            isLocal         : isLocal,
            isStaging       : isStaging,
            isIOS           : isIOS,
            isiPhone        : isiPhone,
            isAndroid       : isAndroid,
            isAndroidBrowser: isAndroidBrowser,
            isWebkit        : isSafari || isChrome,
            isChrome        : isChrome,
            isWindows       : isWindows,
            isIE            : isIE,
            isIE9           : isIE9,
            isFirefox       : isFirefox,
            isSafari        : isSafari,
            isTablet        : isTablet,
            isDebug         : isDebug,

            isMQStandard    : window.innerWidth >= 620 && window.innerWidth <= 1700,
            isMQPhone       : window.innerWidth < 620,
            isMQLarge       : window.innerWidth > 1700,

            hasLocalStorage : false,

            autoLogin     : false,
            useGoogle     : true,
            useRouting    : true && hasPushState,
            useTransitions: false, // isWindows
            useSockets    : location.host.indexOf("dev.") < 0
        },

        Keys = namespace.Keys = {
            RETURN: 13,
            SHIFT : 16,
            SPACE : 32,
            ALT   : 18,
            CMD   : 91,
            CTRL  : 17,
            DOWN  : 40,
            ESCAPE: 27,
            LEFT  : 37,
            RIGHT : 39,
            UP    : 38,
            NUM_0 : 48,
            NUM_1 : 49,
            NUM_2 : 50,
            NUM_3 : 51,
            NUM_4 : 52,
            NUM_5 : 53,
            NUM_6 : 54,
            NUM_7 : 55,
            NUM_8 : 56,
            NUM_9 : 57,
            Z     : 90
        },

        State = namespace.State = {};


    // Evaluated Flags
    // ----------------------------------------------------------

    Flags.hasLocalStorage = (function isLocalStorageNameSupported() {
        var testKey = 'test', storage = window.sessionStorage;
        try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    })();


    // Console
    // ----------------------------------------------------------

    var consoleStartTime = Date.now();

    console.color = function() {
        var aa      = Array.prototype.slice.apply(arguments);
        var options = aa.pop() || {};
        var output;
        var diff;

        diff = Date.now() - consoleStartTime; consoleStartTime = Date.now();
        aa[0]       = "%c " + aa[0] + " ";
        output      = aa.join(' ') + " - " + diff + "ms";
        aa          = [output, "background: " + options.background + "; color: " + options.color + ";"];

        console.log.apply(console, aa);
    };

    /**
     * Automatically disables logs for remote servers
     */
    if (!Flags.isLocal && !Flags.isStaging && location.href.toString().indexOf('polymer') < 0) {
        // remove console logging
        $.extend(console, {
            color         : $.noop,
            debug         : $.noop,
            error         : $.noop,
            // info          : $.noop,
            log           : $.noop,
            // warn          : $.noop,
            dir           : $.noop,
            dirxml        : $.noop,
            table         : $.noop,
            trace         : $.noop,
            assert        : $.noop,
            count         : $.noop,
            markTimeline  : $.noop,
            profile       : $.noop,
            profileEnd    : $.noop,
            time          : $.noop,
            timeEnd       : $.noop,
            timeStamp     : $.noop,
            group         : $.noop,
            groupCollapsed: $.noop,
            groupEnd      : $.noop,
            clear         : $.noop
        })
    }

    /**
     * Allow events on all namespaced objects
     */
    _.extend(namespace, Backbone.Events, {
        Browser  : Modernizr,
        parent   : window.top,
        $html    : $('html'),
        $document: $(document),
        $window  : $(window),
        $body    : $(document.body),
        $main    : $('main'),
        app      : null,
        func     : { },

        preventDefault: function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });


    if (typeof document.hidden !== "undefined") {
        window.visibilitychange = "visibilitychange";
    }
    else if (typeof document.mozHidden !== "undefined") {
        window.visibilitychange = "mozvisibilitychange";
    }
    else if (typeof document.msHidden !== "undefined") {
        window.visibilitychange = "msvisibilitychange";
    }
    else if (typeof document.webkitHidden !== "undefined") {
        window.visibilitychange = "webkitvisibilitychange";
    }


    // Deferable Actions
    // ------------------------------------------------------

    function defer(callback, key) {
        var key = 'deferrable' + key;

        window.deferrable = window.deferrable || {};

        // immediate execute
        if (!key && namespace.app) {
            return callback();
        }

        // check key
        if (!key) key = Math.random();

        // create list, if not exists
        if (!window.deferrable[key]) window.deferrable[key] = [];

        // add to list
        window.deferrable[key].push(callback);
    };

    namespace.executeDefer = function executeDefer(key) {
        for (var i in window.deferrable) {
            // execute specific keys
            if (key) {
                window.deferrable['deferrable' + key].forEach(function(cb) { cb() });

                window.deferrable[key] = null;
                delete window.deferrable[key];
                break;
            }

            // execute all keys
            else {
                window.deferrable[i].forEach(function(cb) { cb() });
            }
        }

        // reset all
        window.deferrable = null;
    };

    _.templateSettings = {
        interpolate: /\[\[(.+?)\]\]/g
    };


    // Load
    // ----------------------------------------------------------

    if (Flags.isMobile) {
        $('html').addClass("is-mobile");
    }

    if (Flags.isIOS) {
        $('html').addClass("is-ios");

        if (/OS 7/.test(navigator.userAgent)) {
            $('html').addClass("is-ios-7");
        }
    }

})(window.pm || (window.pm = {}));
