'use strict';

describe('userMessagesService', function() {
  var _userMessagesService, _$rootScope;

  beforeEach(function() {
    module('underscore');
    module('mobiusApp.services.userMessagesService');
  });

  beforeEach(inject(function($rootScope, userMessagesService) {
    _$rootScope = $rootScope;
    _userMessagesService = userMessagesService;
  }));

  describe('messages', function() {
    it('should be defined as array', function() {
      expect(_userMessagesService.messages).to.be.an('array');
    });
  });

  describe('addMessage', function() {
    it('should be defined as function', function() {
      expect(_userMessagesService.addMessage).to.be.a('function');
    });

    it('should add the message', function() {
      _userMessagesService.addMessage('test');
      _$rootScope.$digest();
      expect(_userMessagesService.messages.length).equal(1);
    });

    it('should remove all messages with "removeOnStateChange" flag on state change', function() {
      _userMessagesService.addMessage('test', true, true);
      _$rootScope.$digest();
      _$rootScope.$broadcast('$stateChangeSuccess');
      _$rootScope.$digest();
      expect(_userMessagesService.getMessages().length).equal(0);
    });
  });
});
