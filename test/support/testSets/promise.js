/*
 * cls-bluebird tests
 * Utilities
 * Functions to run a set of tests relating to testing that methods return a promise of correct type.
 * Mixin to Utils prototype.
 */

/* global describe */

// Exports

module.exports = {
    /**
     * Run set of tests on a prototype method to ensure always returns a promise
     * inherited from correct Promise constructor.
     *
     * Function `fn` should take provided `promise` and call the method being tested on it.
     * `fn` is called with a `promise` and a `handler` function which should be attached as the callback to the method under test.
     * e.g. `return promise.then(handler)`
     *
     * A different `handler` is provided in each test.
     * Handlers returns a literal value, throw, or return or a promise that resolves/rejects.
     * Promises returned from handlers are instances of various different Promise constructors.
     *
     * @param {Function} fn - Test function
     * @param {Object} options - Options object
     * @param {boolean} options.continues - true if handler fires on resolved promise
     * @param {boolean} options.catches - true if handler fires rejected promise
     * @param {boolean} options.passThrough - true if method passes through errors even if handler fires
     * @returns {undefined}
     */
    testSetProtoMethodReturnsPromise: function(fn, options) {
        var u = this;

        describe('attached synchronously to promise', function() {
            testSet(false);
        });

        describe('attached asynchronously to promise', function() {
            testSet(true);
        });

        function testSet(attachAsync) {
            describe('resolved sync', function() {
                var makePromise = u.resolveSyncMethod();
                tests(makePromise, options.continues, false, attachAsync);
            });

            describe('resolved async', function() {
                var makePromise = u.resolveAsyncMethod();
                tests(makePromise, options.continues, false, attachAsync);
            });

            describe('rejected sync', function() {
                var makePromise = u.rejectSyncMethodError();
                tests(makePromise, options.catches, true, attachAsync);
            });

            describe('rejected async', function() {
                var makePromise = u.rejectAsyncMethodError();
                tests(makePromise, options.catches, true, attachAsync);
            });
        }

        function tests(makePromise, handlerShouldBeCalled, isRejecting, attachAsync) {
            if (!options.noUndefined) {
                u.it('is undefined', function(done, error) {
                    var rejectErr = isRejecting ? u.makeError() : undefined;
                    var p = makePromise(rejectErr);

                    u.execAsyncIf(function() {
                        p = fn(p, undefined);
                        error(u.returnErrIfNotPromise(p));
                        done(p, rejectErr);
                    }, attachAsync, p, isRejecting);
                });
            }

            if (handlerShouldBeCalled) {
                // Handler should be called
                describe('returns', function() {
                    u.testSetMethodReturnsPromise(function(handler, cb) {
                        var rejectErr = isRejecting ? u.makeError() : undefined;
                        var p = makePromise(rejectErr);
                        if (!options.passThrough) rejectErr = undefined;

                        u.execAsyncIf(function() {
                            p = fn(p, handler);
                            cb(p, rejectErr);
                        }, attachAsync, p, isRejecting);
                    });
                });

                return;
            }

            // Handler should not be called
            u.it('is ignored', function(done, error) {
                var rejectErr = isRejecting ? u.makeError() : undefined;
                var p = makePromise(rejectErr);

                u.execAsyncIf(function() {
                    p = fn(p, function() {
                        error(new Error('Handler should not be called'));
                    });

                    error(u.returnErrIfNotPromise(p));
                    done(p, rejectErr);
                }, attachAsync, p, isRejecting);
            });
        }
    },

    /**
     * Run set of tests on a static method to ensure always returns a promise
     * inherited from correct Promise constructor.
     *
     * Test function `fn` is called with a `handler` function.
     * `fn` should call the method being tested with `handler` as the callback, and return resulting promise.
     * e.g. `return Promise.try(handler)`
     *
     * A different `handler` is provided in each test.
     * Handlers return a literal value, throw, or return or a promise that resolves/rejects.
     * Promises returned from handlers are instances of various different Promise constructors.
     *
     * @param {Function} fn - Test function
     * @returns {undefined}
     */
    testSetStaticMethodReturnsPromise: function(fn) {
        var u = this;
    	describe('returns instance of patched Promise constructor when handler returns', function() {
            u.testSetMethodReturnsPromise(function(handler, cb) {
                var p = fn(handler);
                cb(p);
            });
        });
    },

    /**
     * Run set of tests on a value-taking method to ensure always returns a promise
     * inherited from correct Promise constructor.
     *
     * Function `fn` should call the static promise method being tested.
     * `fn` is called with a value `value` which should be the parameter of the method under test.
     * `fn` returns the resulting promise.
     * e.g. `return Promise.resolve(value)`
     *
     * A different `value` is provided in each test.
     * Values are a literal, or a promise that resolves/rejects.
     * Promises provided as values are instances of various different Promise constructors.
     *
     * @param {Function} fn - Test function
     * @returns {undefined}
     */
    testSetValueReturnsPromise: function(fn) {
        var u = this;
        u.testSetMethodValueReturnsPromise(function(handler, cb) {
    		var value = handler();
    		var p = fn(value);
            cb(p);
    	});
    },

    /**
     * Run set of tests on a method to ensure always returns a promise
     * inherited from correct Promise constructor.
     *
     * Test function `fn` is called with `handler` and `callback` functions.
     * `fn` should call the method being tested with `handler` as the callback,
     * and call `callback` with resulting promise.
     * e.g. `callback(Promise.try(handler))`
     *
     * A different `handler` is provided in each test.
     * Handlers return a literal value, or a promise that resolves/rejects, or throw an error.
     * Promises returned from handlers are instances of various different Promise constructors.
     *
     * @param {Function} fn - Test function
     * @returns {undefined}
     */
    testSetMethodReturnsPromise: function(fn) {
        var u = this;

        u.testSetMethodValueReturnsPromise(fn);

        u.it('thrown error', function(done, error) {
            var rejectErr = u.makeError();
			fn(u.throwMethod(rejectErr), function(p) {
                error(u.returnErrIfNotPromise(p));
                done(p, rejectErr);
            });
		});
    },

    /**
     * Run set of tests on a method to ensure always returns a promise
     * inherited from correct Promise constructor.
     *
     * Test function `fn` is called with `handler` and `callback` functions.
     * `fn` should call the method being tested with `handler` as the callback,
     * and call `callback` with resulting promise.
     * e.g. `callback(Promise.try(handler))`
     *
     * A different `handler` is provided in each test.
     * Handlers return a literal value, or a promise that resolves/rejects.
     * Promises returned from handlers are instances of various different Promise constructors.
     *
     * @param {Function} fn - Test function
     * @returns {undefined}
     */
    testSetMethodValueReturnsPromise: function(fn) {
        var u = this;

        u.it('literal value', function(done, error) {
            fn(u.literalMethod(), function(p, rejectErr) {
                error(u.returnErrIfNotPromise(p));
                done(p, rejectErr);
            });
        });

        u.altPromises.forEach(function(altPromiseParams) {
            var AltPromise = altPromiseParams.Promise;

            var _describe = (AltPromise ? describe : describe.skip);
            _describe('promise (' + altPromiseParams.name + ')', function() {
                u.it('resolved sync', function(done, error) {
                    fn(u.resolveSyncMethodAlt(AltPromise), function(p, rejectErr) {
                        error(u.returnErrIfNotPromise(p));
                        done(p, rejectErr);
                    });
                });

                u.it('resolved async', function(done, error) {
                    fn(u.resolveAsyncMethodAlt(AltPromise), function(p, rejectErr) {
                        error(u.returnErrIfNotPromise(p));
                        done(p, rejectErr);
                    });
                });

                u.it('rejected sync', function(done, error) {
                    var rejectErr = u.makeError();
                    fn(u.rejectSyncMethodAlt(AltPromise, rejectErr), function(p) {
                        error(u.returnErrIfNotPromise(p));
                        done(p, rejectErr);
                    });
                });

                u.it('rejected async', function(done, error) {
                    var rejectErr = u.makeError();
                    fn(u.rejectSyncMethodAlt(AltPromise, rejectErr), function(p) {
                        error(u.returnErrIfNotPromise(p));
                        done(p, rejectErr);
                    });
                });
            });
        });
    }
};
