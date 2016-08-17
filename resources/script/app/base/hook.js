
;(function(namespace) {

    var Events    = namespace.Events,
        Flags     = namespace.Flags,
        State     = namespace.State,
        Constants = namespace.Constants
    ;

    namespace.Hook_Base = _.extend({}, Backbone.Events, {

        // Methods
        // -------------------------------------------------------------

        fire: function() {

        }

    });

    namespace.Hook_Base.extend      = _.extend;
    namespace.Hook_Base.singleton   = null;
    namespace.Hook_Base.getInstance = function() {
        return namespace.Hook_Base.singleton || new namespace.Hook_Base;
    };

})(window.pm || (window.pm = {}));
