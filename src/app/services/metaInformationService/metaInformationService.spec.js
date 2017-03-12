'use strict';

describe('metaInformationService', function() {
  var _rootScope, _metaInformationService;

  var TEST_CHAIN_DATA = {
    meta: {
      description: 'test description',
      keywords: 'keywords',
      pagetitle: 'pagetitle'
    }
  };

  beforeEach(function() {
    module('mobiusApp.services.metaInformation', function($provide){    
      $provide.value('Settings', {
        API: {
          chainCode: 'TESTCHAIN'
        }
      });
      $provide.value('chainService', {
        getChain: function(){
          return {
            then: function(c){
              return c(TEST_CHAIN_DATA);
            }
          };
        }
      });
    });
  });

  beforeEach(inject(function($rootScope, metaInformationService) {
    _rootScope = $rootScope;
    _metaInformationService = metaInformationService;
  }));

  /*
  describe('initialization', function() {
    it('should download chain data from the server and define received meta on rootScope', function(){
      expect(_rootScope.metaInformation.description).equal(TEST_CHAIN_DATA.meta.description);
      expect(_rootScope.metaInformation.pagetitle).equal(TEST_CHAIN_DATA.meta.pagetitle);
      expect(_rootScope.metaInformation.keywords).equal(TEST_CHAIN_DATA.meta.keywords);
    });
  });
  */

  describe('reset', function() {
    it('should reset meta data to original chain data', function(){
      _metaInformationService.setMetaDescription('new description');
      _metaInformationService.reset();
      expect(_rootScope.metaInformation.description).equal('');
    });
  });

  describe('setMetaDescription', function() {
    it('should set meta description', function(){
      _metaInformationService.setMetaDescription('updated description');
      expect(_rootScope.metaInformation.description).equal('updated description');
    });
  });

  describe('setMetaKeywords', function() {
    it('should set meta description', function(){
      _metaInformationService.setMetaKeywords('updated keywords');
      expect(_rootScope.metaInformation.keywords).equal('updated keywords');
    });
  });

  describe('setPageTitle', function() {
    it('should set meta description', function(){
      _metaInformationService.setPageTitle('updated title');
      expect(_rootScope.metaInformation.pagetitle).equal('updated title');
    });
  });

  describe('setOgGraph', function() {
    it('should update og tags', function(){
      var testData = {
        'og:title': 'new title',
        'og:description': 'new description',
        'og:type': 'new type',
        'og:url': 'new url',
        'og:image': 'new image',
        'og:locale': 'new locale'
      };

      _metaInformationService.setOgGraph(testData);

      expect(_rootScope.metaInformation.ogTitle).equal('new title');
      expect(_rootScope.metaInformation.ogDescription).equal('new description');
      expect(_rootScope.metaInformation.ogType).equal('new type');
      expect(_rootScope.metaInformation.ogUrl).equal('new url');
      expect(_rootScope.metaInformation.ogImage).equal('new image');
      expect(_rootScope.metaInformation.ogLocale).equal('new locale');
    });
  });
});
