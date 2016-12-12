'use strict';

describe('mobius.controllers.main', function() {
  describe('MainCtrl', function() {
    var _scope, _modalService, _contentService, _propertyService, _metaInformationService, _chainService;

    var ADVERTS_DATA = [{
      images: [{a: 123}, {b: 123}]
    }];
    var TITLES_DATA = [{
      titles: [{a: 123}, {b: 123}]
    }];
    var CONTACT_DATA = [{
      contacts: [{a: 123}, {b: 123}]
    }];

    var PROPERTIES_DATA = [{
      properties: [{a: 123}, {b: 123}]
    }];

    var OFFERS_DATA = [{
      offers: [{a: 123}, {b: 123}]
    }];


    beforeEach(function() {
      module('underscore');

      module('mobius.controllers.common.preloader');
      module('mobius.controllers.common.sanitize');

      module('mobius.controllers.main', function($provide) {
        $provide.value('$state', {
          includes: function(){}
        });

        $provide.value('scrollService', {});

        $provide.value('$modal', {});
        $provide.value('modalService', {
          openDialogIfPresent: sinon.spy(),
          openCampaignDialog: sinon.spy()
        });

        $provide.value('contentService', {
          getAdverts: sinon.stub(),
          getOffers: sinon.stub(),
          getTitles: sinon.stub(),
          getContactMethods: sinon.stub()
        });

        $provide.value('propertyService', {
          getAll: sinon.stub()
        });

        $provide.value('stateService', {
          isMobile: sinon.stub()
        });

        $provide.value('metaInformationService', {
          setMetaDescription: sinon.spy(),
          setMetaKeywords: sinon.spy(),
          setPageTitle: sinon.spy(),
          setOgGraph: sinon.spy()
        });

        $provide.value('chainService', {
          getChain: sinon.stub()
        });

        $provide.value('Settings', {
          API:{
            chainCode: 'CODE'
          },
          UI: {
            contents: {
              displayContentImageInHeroSlider: true
            },
            generics: {
              loyaltyProgramEnabled: true
            },
            adverts: {
              heroAdverts: 'test-size'
            },
            footer:{
              type: 'simple'
            }
          }
        });
        $provide.value('user', {});
        $provide.value('$stateParams', {});

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
          }
        };

        $provide.value('apiService', apiService);
      });
    });

    beforeEach(inject(function($controller, $rootScope, $q, modalService,
        contentService, propertyService, metaInformationService, chainService) {

      _scope = $rootScope.$new();

      _modalService = modalService;

      _contentService = contentService;
      _contentService.getAdverts.returns($q.when(ADVERTS_DATA));
      _contentService.getOffers.returns($q.when(OFFERS_DATA));
      _contentService.getTitles.returns($q.when(TITLES_DATA));
      _contentService.getContactMethods.returns($q.when(CONTACT_DATA));

      _propertyService = propertyService;
      _metaInformationService = metaInformationService;
      _chainService = chainService;
      _propertyService.getAll.returns($q.when(PROPERTIES_DATA));

      $controller('MainCtrl', { $scope: _scope });
    }));

    describe('when controller initialized', function() {
      it('should check if modals should be opened for current state', function(){
        expect(_modalService.openDialogIfPresent.calledOnce).equal(true);
      });
      it('should get titles and contact methods content from the server', function(){
        expect(_contentService.getTitles.calledOnce).equal(true);
        expect(_contentService.getContactMethods.calledOnce).equal(true);
      });
    });

    describe('updateHeroContent', function() {
      it('should update hero content', function(){
        var data = [{a: 'test'}];
        _scope.updateHeroContent(data);
        expect(_scope.heroContent).equal(data);
      });

      it('should load hero content from the server', function(){
        /*
        _scope.updateHeroContent();
        //_scope.$digest();
        expect(_contentService.getAdverts.calledOnce).equal(true);
        expect(_contentService.getAdverts.calledWith({bannerSize: 'test-size'})).equal(true);
        */
      });
    });
  });
});
