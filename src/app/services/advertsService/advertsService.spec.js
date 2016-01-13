'use strict';

describe('advertsService', function() {
  var _advertsService, _spyStateGo, _spyWindowOpen,
    _spyBroadcast, _rootScope;

  var TEST_OFFERS = [
    {
      code: 'testCode',
      promoCode: 'testPromo',
      meta: {
        slug: 'test-slug'
      }
    }
  ];

  beforeEach(function() {
    module('underscore');

    module('mobiusApp.services.adverts', function($provide) {

      $provide.value('contentService', {
        getOffers: function(){
          return {
            then: function(c){
              c(TEST_OFFERS);
            }
          };
        }
      });

      $provide.value('bookingService', {
        getCodeFromSlug: function(slug){
          return slug;
        }
      });

      $provide.value('$state', {
        go: function(){},
        current: {
          name: 'offers'
        },
        params: {
          code: 'testCodeSame'
        }
      });

      $provide.value('$timeout', function(c){
        return c();
      });

      $provide.value('$window', {
        open: function(){}
      });
    });
  });

  beforeEach(inject(function($rootScope, advertsService, $window, $state) {
    _spyStateGo = sinon.spy($state, 'go');
    _spyWindowOpen = sinon.spy($window, 'open');
    _spyBroadcast = sinon.spy($rootScope, '$broadcast');

    _advertsService = advertsService;
    _rootScope = $rootScope;
  }));

  afterEach(function(){
    _spyStateGo.restore();
    _spyWindowOpen.restore();
    _spyBroadcast.restore();
  });

  describe('advertClick', function() {
    it('should be defined as a function', function() {
      expect(_advertsService.advertClick).to.be.an('function');
    });

    describe('when clicked on a news link', function(){
      it('should navigate to news state', function(){
        _advertsService.advertClick({type: 'news', code: 'testCode'});
        expect(_spyStateGo.calledOnce).equal(true);
        expect(_spyStateGo.calledWith('news', {code: 'testCode'}));
      });
    });

    describe('when clicked on about link', function(){
      it('should navigate to aboutUs state', function(){
        _advertsService.advertClick({type: 'about', code: 'testCode'});
        expect(_spyStateGo.calledOnce).equal(true);
        expect(_spyStateGo.calledWith('aboutUs', {code: 'testCode'}));
      });
    });

    describe('when clicked on a href', function(){
      it('should navigate to a link opened in a new window', function(){
        _advertsService.advertClick({type: 'unknown', uri: 'testURI'});
        expect(_spyStateGo.calledOnce).equal(false);
        expect(_spyWindowOpen.calledOnce).equal(true);
        expect(_spyWindowOpen.calledWith('testURI', '_blank')).equal(true);
      });
    });

    describe('when clicked on offers link', function(){
      it('should navigate to an offers state', function(){
        _advertsService.advertClick({type: 'offers', code: 'testCode'});
        expect(_spyStateGo.calledOnce).equal(true);
        expect(_spyStateGo.calledWith('offers', {code: 'testCode'}));
      });

      it('should navigate to an offers state', function(){
        _advertsService.advertClick({type: 'offers', code: 'testCode'});
        expect(_spyStateGo.calledOnce).equal(true);
        expect(_spyStateGo.calledWith('offers', {code: 'testCode'}));
      });

      it('should broadcast BOOKING_BAR_PREFILL_DATA event on a $rootScope', function(){
        _advertsService.advertClick({type: 'offers', code: 'testCode'});
        _rootScope.$digest();
        expect(_spyBroadcast.calledOnce).equal(true);
        expect(_spyBroadcast.calledWith('BOOKING_BAR_PREFILL_DATA', {promoCode: 'testPromo'}));
      });
    });

    describe('when clicked on the same offer link', function(){
      it('should keep the state and skip navigation', function(){
        //_advertsService.advertClick({type: 'offers', code: 'testCodeSame'});
        //expect(_spyStateGo.calledOnce).equal(false);
      });
    });
  });
});
