'use strict';

describe('mobiusApp.services.scroll', function() {
  var _scrollService;

  beforeEach(function(){
    module('mobiusApp.services.scroll', function($provide) {
      $provide.value('$state', {
        current: {
          name: 'home'
        }
      });

      $provide.value('$window', {
        pageYOffset: 1000
      });


      $provide.value('$document', {
        clientTop: 200
      });
    });

    inject(function(scrollService) {
      _scrollService = scrollService;
    });
  });

  describe('scrollTo', function(){
    it('should be defined as a function', function() {
      expect(_scrollService.scrollTo).to.be.a('function');
    });
  });

  describe('getScrollTop', function(){
    it('should return scroll top position', function() {
      expect(_scrollService.getScrollTop()).equal(800);
    });
  });

  describe('getHeaderHeight', function(){
    it('should be defined as a function', function() {
      expect(_scrollService.getHeaderHeight).to.be.a('function');
    });
  });
});
