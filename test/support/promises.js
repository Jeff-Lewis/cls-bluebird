/*
 * cls-bluebird tests
 * Utilities
 * Functions to create promises.
 * Mixin to Utils prototype.
 */

module.exports = {
    /*
     * Functions to create default literal value and error.
     */
    makeValue: function() {
        return 123;
    },

    makeError: function() {
        return new Error('<rejection value>');
    },

    /*
     * Set of functions to create promises which resolve or reject either synchronously or asynchronously.
     * Promises are created from specified Promise constructor.
     */
    resolveSyncAlt: function(Promise, value) {
        if (value === undefined) value = this.makeValue();
        return new Promise(function(resolve) {
            resolve(value);
        });
    },

    resolveAsyncAlt: function(Promise, value) {
        if (value === undefined) value = this.makeValue();
        return new Promise(function(resolve) {
            setImmediate(function() {
                resolve(value);
            });
        });
    },

    rejectSyncAlt: function(Promise, err) {
        if (err === undefined) err = this.makeError();
        return new Promise(function(resolve, reject) { // jshint ignore:line
            reject(err);
        });
    },

    rejectAsyncAlt: function(Promise, err) {
        if (err === undefined) err = this.makeError();
        return new Promise(function(resolve, reject) { // jshint ignore:line
            setImmediate(function() {
                reject(err);
            });
        });
    },

    /*
     * Set of functions to create promises which resolve or reject either synchronously or asynchronously.
     * Promises are created from main Promise constructor.
     */
    resolveSync: function(value) {
        return this.resolveSyncAlt(this.Promise, value);
    },

    resolveAsync: function(value) {
        return this.resolveAsyncAlt(this.Promise, value);
    },

    rejectSync: function(err) {
        return this.rejectSyncAlt(this.Promise, err);
    },

    rejectAsync: function(err) {
        return this.rejectAsyncAlt(this.Promise, err);
    },

    /*
     * Set of functions to create functions which return promises.
     * Promises resolve or reject either synchronously or asynchronously.
     * Promises are created from specified Promise constructor.
     */
    resolveSyncMethodAlt: function(Promise, value) {
        var u = this;
        return function() {
    		return u.resolveSyncAlt(Promise, value);
    	};
    },

    resolveAsyncMethodAlt: function(Promise, value) {
        var u = this;
        return function() {
    		return u.resolveAsyncAlt(Promise, value);
    	};
    },

    rejectSyncMethodAlt: function(Promise, err) {
        var u = this;
        return function() {
    		return u.rejectSyncAlt(Promise, err);
    	};
    },

    rejectAsyncMethodAlt: function(Promise, err) {
        var u = this;
        return function() {
    		return u.rejectAsyncAlt(Promise, err);
    	};
    },

    rejectSyncMethodErrorAlt: function(Promise) {
        var u = this;
        return function(err) {
    		return u.rejectSyncAlt(Promise, err);
    	};
    },

    rejectAsyncMethodErrorAlt: function(Promise) {
        var u = this;
        return function(err) {
    		return u.rejectAsyncAlt(Promise, err);
    	};
    },

    /*
     * Set of functions to create functions which return promises.
     * Promises resolve or reject either synchronously or asynchronously.
     * Promises are created from main Promise constructor.
     */
    resolveSyncMethod: function(value) {
        return this.resolveSyncMethodAlt(this.Promise, value);
    },

    resolveAsyncMethod: function(value) {
        return this.resolveAsyncMethodAlt(this.Promise, value);
    },

    rejectSyncMethod: function(err) {
        return this.rejectSyncMethodAlt(this.Promise, err);
    },

    rejectAsyncMethod: function(err) {
        return this.rejectAsyncMethodAlt(this.Promise, err);
    },

    rejectSyncMethodError: function() {
        return this.rejectSyncMethodErrorAlt(this.Promise);
    },

    rejectAsyncMethodError: function() {
        return this.rejectAsyncMethodErrorAlt(this.Promise);
    },

    /*
     * Functions to create functions that return a literal value, or throw an error.
     */
    literalMethod: function(value) {
        if (value === undefined) value = this.makeValue();
        return function() {
    		return value;
    	};
    },

    throwMethod: function(err) {
        if (err === undefined) err = this.makeError();
        return function() {
    		throw err;
    	};
    }
};