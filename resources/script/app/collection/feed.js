
;(function(namespace) {
    'use strict';

    var Constants = namespace.Constants;

    namespace.Collection_Feed = namespace.Collection_Base.extend({

        model   : namespace.Model_Feed,
        url     : Constants.API_URL + '/feed/'

        // <String> Key to sort by
        sort_key: 'created_at'

    });

})(window.pm || (window.pm = {}));
