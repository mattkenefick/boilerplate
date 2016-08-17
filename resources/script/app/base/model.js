
;(function(namespace) {
    'use strict';

    // add scope for relationals
    namespace.Model_Base = Remote('Model', {

        model_map: { },

        initialize: function(options) {
            options || (options = {});

            // custom
            this.set('id', options.ID || this.id);

            // super
            Backbone.Model.prototype.initialize.call(this, options);
        },

        set: function(force) {
            var resp = Backbone.Model.prototype.set.apply(this, arguments),
                options = this.attributes;

            // model mapping
            _.each(this.model_map, function(modelName, key) {
                if (options[key]) {
                    var data = modelName.indexOf("Collection") > -1 ? options[key].data : options[key];

                    if (this[key] instanceof namespace[modelName]) {

                        // this is important for updating model_map data items
                        // like when sending a message
                        this[key].set(data);

                        // console.warn("ModelMap already exists for ", modelName, data);
                    }
                    else {
                        var model = new namespace[modelName](data);
                        this[key] = model;
                    }

                    // console.log( "Setting model mapping", modelName, data );
                    // this[key].parent = this;
                }
            }, this);

            return resp;
        }

    });

})(window.pm || (window.pm = {}));
