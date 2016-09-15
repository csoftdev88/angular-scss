'use strict';

describe('cookieFactory', function() {
  var _cookieFactory;

  beforeEach(function() {
    module('underscore');

    module('mobiusApp.factories.cookie', function($provide){
      $provide.value('$window', {
        document: {
          cookie: 'test=123; test2=555'
        }
      });
      $provide.value('$cookies', {});
    });

    inject(function(cookieFactory){
      _cookieFactory = cookieFactory;
    });
  });

  it('should return cookie value when available', function() {
    expect(_cookieFactory('test')).equal('123');
    expect(_cookieFactory('test2')).equal('555');
  });

  it('should return null when value is not found', function() {
    expect(_cookieFactory('test5')).equal(null);
  });
});

