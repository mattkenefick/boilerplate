
;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants;

    namespace.Collection_Users = namespace.Collection_Base.extend({

        model: namespace.Model_Users,
        url  : Constants.API_URL + "/users/"

    });

})(window.pm || (window.pm = {}));
