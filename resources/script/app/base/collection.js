
;(function(namespace) {
    'use strict';

    var Colors = namespace.Colors,
        Events = namespace.Events
    ;

    namespace.Collection_Base = Remote('Collection', {

        // pagination
        limit   : 10,
        page    : 1,
        total   : 0,
        page_max: 0,
        _links  : null,


        // Public Methods
        // -------------------------------------------------------------------

        next: function(data, options) {
            var fetch, self = this;

            data == undefined    && (data = this._data);
            options == undefined && (options = this._options);

            // no more
            if (this.lastPage) {
                console.color("[Collection] We cannot go any further.", Colors.CRITICAL);

                return false;
            }

            if (!data.limit) {
                data.limit = this.limit || 15;
            }

            data.page  = ++this.page || ++data.page || 1;

            fetch = this.fetch(data, options);

            if (fetch && fetch.then) {
                fetch.then(function(data, status, xhr) {
                    if (
                        (!data) ||
                        (data && !data.data) ||
                        (data && data.data && data.data.length < 1) ||
                        (data && data.data && data.data.length < self._data.limit)
                        ) {
                        self.lastPage = true;

                        // warn
                        console.color("[Collection] We just fetched the last page.", Colors.CRITICAL);

                        // broadcast
                        self.trigger(Events.LAST_PAGE);
                    }

                });
            }

            return fetch;
        },

        comparator: function(item) {
            return item.get(this.sort_key);
        },

        sortByField: function(fieldName) {
            this.sort_key = fieldName;
            this.sort();
            this.sort_key = 'id';

            return this;
        },

        isEmpty: function() {
            return !this.hasLoaded() || (this.hasLoaded() && this.length == 0);
        }

    });

})(window.pm || (window.pm = {}));
