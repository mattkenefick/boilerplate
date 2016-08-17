
/**
 * Remote
 *
 * Various methods and helpers to extend functionality of the remote XHR
 * classes, i.e. model + collection.
 *
 * Better handling/understanding of XHR state, responses, data vars, etc.
 */
function Remote(type, object) {
    var response, State = pm.State;

    type || (type = "Model");

    var getValue = function( model, object, prop ) {
        if (!(object && object[prop])) {
            return null;
        }

        return _.isFunction(object[prop]) ? object[prop].call(model) : object[prop];
    },
    templateSettings = {
        evaluate   : /\{\#([\s\S]+?)\}/g,
        interpolate: /\{([\s\S]+?)\}/g,
        escape     : /\{\%([\s\S]+?)\}/g
    };

    response = Backbone[type].extend({

        // variables
        _data   : null,
        _options: null,
        _xhr    : null,

        disableCache: false,

        urls: {

        },

        // Public Methods
        // ------------------------------------------------------------------

        initialize: function(content, options) {
            content || (content = {});
            options || (options = {});

            this._data || (this._data = {});
            this._options || (this._options = {});

            // opts
            this.count  = options.count;
            this.limit  = options.limit;
            this.page   = options.page;
            this.total  = options.total;
            this._links = options._links;

            Backbone[type].prototype.initialize.call(this, content, options);
        },

        abort: function() {
            this.isLoading() && this._xhr.abort();

            return this;
        },

        clearFetchData: function() {
            this._data = {};
        },

        getFetchData: function(key) {
            return key ? this._data[key] : this._data;
        },

        fetch: function(data, options) {
            // mk: @TODO init isn't getting called for some reason
            this._data || (this._data = {});
            this._options || (this._options = {});

            data    || (data = {});
            options || (options = {});

            // limit / page
            if (type == 'Collection') {
                data.page  = data.page || this.page;
                data.limit = data.limit || this.limit;
            }

            // used for prev / next / etc
            this._options = options;
            this._data    = _.extend(this._data, data);

            options.data = this._data;
            // options.cache = false;

            // exit anything else
            this.abort();

            // events
            this.trigger('will:fetch', this);

            return this._xhr = Backbone[type].prototype.fetch.call(this, $.extend(options, {
                success: _.bind(this._onFetchSuccess, this),
                error  : _.bind(this._onFetchError, this)
            }));
        },

        hasLoaded: function () {
            return this._xhr && this._xhr.state() == 'resolved';
        },

        isLoading: function () {
            return this._xhr && this._xhr.state() != 'resolved';
        },

        reset: function() {
            this.abort();

            return Backbone[type].prototype.reset.apply(this, arguments);
        },

        setFetchData: function(params) {
            params || (params = {});

            this._data || (this._data = {});
            this._data = _.extend(this._data, params);

            return this;
        },

        setResponse: function(response) {
            this._response = response;
        },

        destroy: function(options) {
            options || (options = {});

            options.error   = this._error('destroy');
            options.success = this._success('destroy');

            return Backbone[type].prototype.destroy.call(this, options);
        },

        save: function(attributes, options) {
            options || (options = {});

            options.error   = this._error('save');
            options.success = this._success('save');

            // set loading state
            $('body').addClass('loading-saving');

            //
            return Backbone[type].prototype.save
                .call(this, attributes, options)
                .always(function() { $('body').removeClass('loading-saving'); });
        },

        sync: function ( method, model, options ) {
            var opts    = _.clone(options),
                url     = this.renderURL( method, opts ),
                success = options.success,
                error   = options.error,
                self    = this;

            if ( !opts['url'] ) {
                opts.url = url;
            }

            opts.beforeSend = function (xhr) {
                var token = (State['get'] ? State.get('token') : null) || pm['TOKEN'];
                xhr.setRequestHeader('Authorization-API', "Bearer " + token);
            };

            opts.url = url.replace(/\/\/$/, '/');

            // no cache busting
            if (opts.url.indexOf("?") > 0) {
                opts.url += "&amp;cb=" + (pm.State.cbKey || Math.random());
            }
            else {
                opts.url += "?cb=" + (pm.State.cbKey || Math.random());
            }

            // fix https for dev
            if (/dev./.test(location.hostname)) {
                opts.url = opts.url.replace('https:', 'http:');
            }

            loading();

            opts.success = function ( resp, status, xhr ) {
                notloading();

                try {
                    success(resp, status, xhr);
                }
                catch (err) {
                    error(err);
                }
            };

            opts.error = function ( resp, status, xhr ) {
                notloading();

                try {
                    error(resp, status, xhr);
                }
                catch (err) {
                    error(err);
                }
            };

            return Backbone[type].prototype.sync.call( model, method, model, opts );
        },

        renderURL: function ( method, options ) {
            var urlString =  !_.isEmpty(this.urls) ? getValue(this, this.urls, method) : getValue(this, this, 'url');
                urlString = options['url'] || urlString;

            return _.template( urlString, _.extend({}, this, this.attributes, options), templateSettings );
        },


        // Event Handlers
        // -------------------------------------------------------------------

        _onFetchError: function(object, response) {
            // put on root
            object.error = response.error;
            object.status = response.status;
            object.setResponse(response);

            if (response.statusText == 'abort') {
                object.trigger('abort', object);
                object.trigger('fetch:abort', object);
            }
            else {
                object.trigger('error', object);
                object.trigger('fetch:error', object);
            }
        },

        _onFetchSuccess: function(object, response) {
            // put on root
            object.status = response.status;
            object.setResponse(response);

            if (response.data) {
                this.set(response.data, { silent: true });
            }

            object.trigger('success', object);
            object.trigger('fetch:success', object);
            object.trigger('fetch:data', object);
        },

        // for reset/save/etc
        _success: function(type) {
            var self = this;

            return function(model, response) {
                self.status = response.status;
                self.setResponse(response);

                self.trigger('success', self, response);

                if (response.data) {
                    self.set(response.data, { silent: true });

                    self.trigger(type + ':success', self, response);
                    self.trigger(type + ':data', self, response);
                }
                else {
                    self._error(type)(self, response);
                }
            }
        },

        _error: function(type) {
            var self = this;

            return function(model, response) {
                // put on root
                self.error = response.error;
                self.status = response.status;
                self.setResponse(response);

                if (response.statusText == 'abort') {
                    self.trigger('abort', self, response);
                    self.trigger(type + ':abort', self, response);
                }
                else {
                    self.trigger('error', self, response);
                    self.trigger(type + ':error', self, response);
                }
            }
        }

    });

    // Push down
    return response.extend(object || {});
};
