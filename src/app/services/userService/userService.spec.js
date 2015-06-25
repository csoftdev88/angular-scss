'use strict';

describe('userService', function() {
  var _userService, _rootScope, _spyApiServiceGet,
  _spyApisServiceGetFullURL, _spyLoyaltiesServiceGetAll, _spySetHeaders;

  var TEST_USER = {id: 123};

  function setUp(userObject, cookies, settings){
    module('mobiusApp.services.user', function($provide) {
      // Mocking $stateParams service
      $provide.value('Settings', settings || {});

      $provide.value('$cookies', cookies || {});

      $provide.value('userObject', userObject || TEST_USER);

      $provide.value('_', {});

      $provide.value('loyaltyService', {
        getAll: function(){
          return {
            then: function(c){
              c();
            }
          };
        }
      });

      var apiService = {
        get: function(){
          return {
            then: function(c){
              c();
            }
          };
        },
        getFullURL: function(p){
          return p;
        },
        setHeaders: function(){}
      };
      $provide.value('apiService', apiService);
    });

    inject(function($rootScope, user, apiService, loyaltyService) {
      _rootScope = $rootScope;
      _userService = user;
      _spyApiServiceGet = sinon.spy(apiService, 'get');
      _spyApisServiceGetFullURL = sinon.spy(apiService, 'getFullURL');
      _spySetHeaders = sinon.spy(apiService, 'setHeaders');
      _spyLoyaltiesServiceGetAll = sinon.spy(loyaltyService, 'getAll');
    });
  }

  function tearDown(){
    _spyApiServiceGet.restore();
    _spyApisServiceGetFullURL.restore();
    _spySetHeaders.restore();
    _spyLoyaltiesServiceGetAll.restore();
  }

  describe('methods', function(){
    beforeEach(function(){
      setUp();
    });

    describe('isLoggedIn', function() {
      it('should be defined as a function', function() {
        expect(_userService.isLoggedIn).to.be.an('function');
      });
    });

    describe('getUser', function() {
      it('should be defined as a function', function() {
        expect(_userService.getUser).to.be.an('function');
      });

      it('should return user object', function() {
        expect(_userService.getUser()).equal(TEST_USER);
      });
    });

    describe('loadProfile', function() {
      it('should be defined as a function', function() {
        expect(_userService.loadProfile).to.be.an('function');
      });
    });
  });

  describe('when SSO cookies are not presented on the current domain', function(){
    beforeEach(function(){
      setUp();
    });

    describe('isLoggedIn', function() {
      it('should return false', function() {
        expect(_userService.isLoggedIn()).equal(false);
      });
    });

    describe('loadProfile', function() {
      it('should return rejected promise when user id is not available', function() {
        var _rejected;
        _userService.loadProfile().then(function(){}, function(){
          _rejected = true;
        });
        _rootScope.$apply();
        expect(_rejected).equal(true);
      });
    });
  });

  describe('when SSO cookies are presented', function(){
    describe('and mobius customer id is available', function(){
      var SSO_COOKIES = {
        'CustomerProfile': 555,
        'CustomerId-Mobius': 12345
      };

      beforeEach(function(){
        setUp({}, SSO_COOKIES);
      });

      describe('loadProfile', function() {
        it('should fire a GET request to a customer API with detected customer ID', function() {
          _userService.loadProfile();
          expect(_spyApiServiceGet.calledOnce).equal(true);
          expect(_spyApiServiceGet.calledWith('customers.customer')).equal(true);

          expect(_spyApisServiceGetFullURL.calledWith('customers.customer', {customerId: 12345})).equal(true);
          expect(_spyApisServiceGetFullURL.calledOnce).equal(true);
        });

        it('should fire a GET request to loyalties API with detected customer ID', function() {
          _userService.loadProfile();
          expect(_spyLoyaltiesServiceGetAll.calledOnce).equal(true);
          expect(_spyLoyaltiesServiceGetAll.calledWith(12345)).equal(true);
        });

        it('should set infiniti auth header', function(){
          _userService.loadProfile();
          expect(_spySetHeaders.calledOnce).equal(true);
          expect(_spySetHeaders.calledWith({'infinitiAuthN': 555}));
        });
      });
    });

    describe('but mobius customer id is missing', function(){
      var SSO_COOKIES = {
        'CustomerProfile': {}
      };

      beforeEach(function(){
        setUp({}, SSO_COOKIES, {
          UI: {
            SSO: {
              customerId: 987
            }
          }
        });
      });

      describe('loadProfile', function() {
        it('should fire a GET request to a customer API with customer ID taken from the settings', function() {
          _userService.loadProfile();
          expect(_spyApisServiceGetFullURL.calledWith('customers.customer', {customerId: 987})).equal(true);
        });

        it('should fire a GET request to loyalties API with customer ID taken from the settings', function() {
          _userService.loadProfile();
          expect(_spyLoyaltiesServiceGetAll.calledWith(987)).equal(true);
        });
      });
    });


    describe('and user profile is loaded', function(){
      var SSO_COOKIES = {
        'CustomerProfile': {},
        'CustomerId-Mobius': 12345
      };

      beforeEach(function(){
        setUp({id: 555, email: 'a@mobius.com'}, SSO_COOKIES);
      });

      describe('isLoggedIn', function() {
        it('should return true', function() {
          expect(_userService.isLoggedIn()).equal(true);
        });
      });
    });
  });

  afterEach(function() {
    tearDown();
  });
});
