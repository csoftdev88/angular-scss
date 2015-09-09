
'use strict';

describe('chosenOptionsClass', function() {
  var _$compile, _$rootScope, _element;

  beforeEach(function() {
    module('mobiusApp.directives.chosenOptionsClass');
  });

  beforeEach(inject(function($compile, $rootScope) {
    _$compile = $compile;
    _$rootScope = $rootScope;
    _element = _$compile('<select chosen-options-class ng-options="opt1 opt2"/>')(_$rootScope);
    $rootScope.$digest();
  }));

  describe('when initialized', function() {
    it('should append template content to a current element', function(){
      expect(_element.html()).equal('');
    });
  });

  describe('logic', function() {
    it('should set classes when chosen events are broadcasted', function(){
      _element.triggerHandler('chosen:showing_dropdown', ['opt1']);
    });
  });

  describe('when destroyed', function(){
    it('should remove all listeners', function(){
      var scope = _element.scope();
      scope.$broadcast('$destroy');
    });
  });
});
