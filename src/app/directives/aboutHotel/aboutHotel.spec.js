'use strict';

describe('aboutHotels', function() {
  var _$compile, _$rootScope, _element,
    _spyTemplateCacheGet;

  var TEMPLATE = '<about-hotel></about-hotel>';
  var TEMPLATE_URL = 'directives/aboutHotel/aboutHotel.html';
  var TEMPLATE_CONTENT = '<p>test</p>';

  var TEST_CHAIN_DATA = {
    meta: {
      microdata: {
        og: {
          'og:title': 'title',
          'og:desciption': 'description'
        }
      }
    }
  };

  var TEST_OFFERS = [
    {offer: 'testOffer'}
  ];
  var TEST_RANDOM = {
    code: 'testCode'
  };

  beforeEach(function() {
    module('underscore');

    module('mobiusApp.directives.aboutHotel', function($provide){
      $provide.value('Settings', {
        API: {
          chainCode: 'testCode'
        },
        UI: {
          aboutHotel: {
            benefits: 'testBenefits'
          },
          offers: {
            width: 200
          },
          adverts: {
            randomMainPageAdvertSize: 300
          }
        }
      });

      $provide.value('contentService', {
        getRandomAdvert: function(){
          return {
            then: function(c){
              c(TEST_RANDOM);
            }
          };
        },
        getOffers: function(){
          return {
            then: function(c){
              c(TEST_OFFERS);
            }
          };
        }
      });

      $provide.value('advertsService', {});
      $provide.value('chainService', {
        getChain: function(){
          return {
            then: function(c){
              c(TEST_CHAIN_DATA);
            }
          };
        }
      });
      $provide.value('metaInformationService', {
        setOgGraph: function(){}
      });

      $provide.value('$state', {});
    });
  });

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    _$compile = $compile;
    _$rootScope = $rootScope;

    $templateCache.put(TEMPLATE_URL, TEMPLATE_CONTENT);
    _spyTemplateCacheGet = sinon.spy($templateCache, 'get');

    _element = _$compile(TEMPLATE)(_$rootScope);
    $rootScope.$digest();
  }));

  afterEach(function(){
    _spyTemplateCacheGet.restore();
  });

  describe('when initialized', function() {
    it('should download a template from template-cache', function(){
      expect(_spyTemplateCacheGet.calledOnce).equal(true);
      expect(_spyTemplateCacheGet.calledWith(TEMPLATE_URL)).equal(true);
    });

    it('should append template content to a current element', function(){
      expect(_element.html()).equal(TEMPLATE_CONTENT);
    });
  });
});
