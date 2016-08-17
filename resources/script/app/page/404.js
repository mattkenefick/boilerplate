/**
 * @package ChalkySticks
 * @authors Matt Kenefick (matt@polymermallard.com)
 * @date    2016-01-01
 */

;(function(namespace) {
    'use strict';

    var Events         = namespace.Events,
        Flags          = namespace.Flags;

    namespace.Page_404 = namespace.Page_Base.extend({

        name: "Page_404",

        // <Collection_Model>
        model: null,

        // <String> Name of script tag containing our template
        templateName: "tpl-basic-404-page"

    });

})(window.pm || (window.pm = {}));
