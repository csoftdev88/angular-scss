'use strict';

describe('preloaderFactory', function() {
  var _preloaderFactory, _$rootScope, _spyBroadcast, _$q;

  beforeEach(function() {
    module('mobiusApp.factories.preloader');

    inject(function(preloaderFactory, $rootScope, $q) {
      _preloaderFactory = preloaderFactory;
      _$rootScope = $rootScope;
      _$q = $q;

      _spyBroadcast = sinon.spy(_$rootScope, '$broadcast');
    });
  });

  afterEach(function(){
    _spyBroadcast.restore();
  });

  describe('invocation', function(){
    it('should take only promise object', function() {
      _preloaderFactory();
      _preloaderFactory({});
      expect(_spyBroadcast.callCount).equal(0);
    });

    it('should broadcast preloader event with visibility:true when promise is received', function() {
      _preloaderFactory(_$q.defer().promise);
      expect(_spyBroadcast.calledOnce).equal(true);
      expect(_spyBroadcast.calledWith('EVENT_PRELOADER', {visibility: true})).equal(true);
    });

    it('should broadcast preloader event with visibility:false when promise is resolved', function() {
      var q = _$q.defer();
      q.resolve(123);
      _preloaderFactory(q.promise);
      expect(_spyBroadcast.callCount).equal(1);
      expect(_spyBroadcast.calledWith('EVENT_PRELOADER', {visibility: false})).equal(true);
    });

    it('should broadcast preloader event with visibility:false when promise is rejected', function() {
      var q = _$q.defer();
      q.reject(123);
      _preloaderFactory(q.promise);
      expect(_spyBroadcast.callCount).equal(1);
      expect(_spyBroadcast.calledWith('EVENT_PRELOADER', {visibility: false})).equal(true);
    });
  });

});
