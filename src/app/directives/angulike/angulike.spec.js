'use strict';
/*
describe('angulike', function() {
  var _$compile, _$rootScope, _element, _spyXFBMLParse;

  var TEMPLATE = '<div fb-like="fbLikeButton"></div>';

  beforeEach(function() {
    module('angulike', function($provide){
      $provide.value('$window', {
        FB: {
          XFBML: {
            parse: function(){}
          }
        }
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $window) {
    _$compile = $compile;
    _$rootScope = $rootScope;
    _$rootScope.fbLikeButton = false;
    _spyXFBMLParse = sinon.spy($window.FB.XFBML, 'parse');

    _element = _$compile(TEMPLATE)(_$rootScope);
    $rootScope.$digest();
  }));

  afterEach(function(){
    _spyXFBMLParse.restore();
  });

  describe('when initialized', function() {
    it('should append template content to a current element', function(){
      expect(_element.html()).equal('');
    });

    it('should render like button when fb-like data have changed', function(){
      _$rootScope.fbLikeButton = 'new value';
      _$rootScope.$digest();
      //expect(_spyXFBMLParse.calledOnce).equal(true);
    });
  });
});
*/
