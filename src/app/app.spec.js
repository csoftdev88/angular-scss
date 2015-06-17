'use strict';

describe('mobiusApp module', function() {
  var _mobiusApp;

  describe('dependency injection test', function() {
    beforeEach(function() {
      _mobiusApp = angular.module('mobiusApp', function($provide){
        // NOTE: Template cache is added during a build step
        // Mocking the dependency via provider
        $provide.value('templates-main', {});
      });
    });

    it('should be defined', function() {
      expect(_mobiusApp).to.be.an('object');
    });

    it('should use only existing dependencies', function() {
      for(var i = 0; i < _mobiusApp.requires.length; i++) {
        var dependency = _mobiusApp.requires[i];
        if(dependency){
          expect(angular.module(dependency)).to.be.an('object');
        }
      }
    });
  });
});
