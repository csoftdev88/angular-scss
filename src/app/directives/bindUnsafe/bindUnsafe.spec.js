'use strict';

describe('bindUnsafe', function() {
  var _$compile, _$rootScope, _scope, _elem;

  var TEMPLATE = '<section bind-unsafe="test"></section>';

  beforeEach(module('mobiusApp.directives.bindUnsafe'));

  beforeEach(function() {
    module('mobiusApp.directives.bindUnsafe', function() {});
  });

  beforeEach(inject(function($compile, $rootScope) {
    _$compile = $compile;
    _$rootScope = $rootScope;
  }));

  describe('when initialized', function() {
    beforeEach(function() {
      _elem = _$compile(TEMPLATE)(_$rootScope);
      _scope = _elem.isolateScope();
    });

    describe('with no data on scope', function() {
      it('should not insert any tags when data is not provided', function() {
        expect(_elem.html()).equal('');
      });
    });

    describe('with data on scope', function() {
      it('should insert the corresponding HTML content', function() {
        _scope.bindUnsafe = '<span>123</span>';
        _scope.$digest();
        expect(_elem.html()).equal('<span class="ng-scope">123</span>');
      });
    });
  });
});
