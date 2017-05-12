'use strict';

describe('mobius.controllers.offers', function() {
  describe('OffersCtrl', function() {
    var _scope, _breadcrumbsService, _$state, _contentService, _chainService, _$location,
      _propertyService;

    var CHAIN_DATA = {
      images: [1,2],
      meta: {
        description: 'desc',
        pagetitle: 'title',
        keywords: 'kw',
        microdata: {
          og: 'og-microdata'
        }
      }
    };

    var OFFERS_DATA = [
      {
        code: 'TEST-CODE',
        prio: 5,
        limitToPropertyCodes: ['VAN', 'REV'],
        showOnOffersPage: true,
        includeBookingButton: true,
        meta: {
          description: 'desc',
          microdata: {
            og: 'og-microdata'
          }
        }
      },
      {
        code: 'TEST-UNAVAILABLE',
        prio: 5,
        limitToPropertyCodes: ['VAN'],
        showOnOffersPage: true,
        includeBookingButton: true,
        meta: {
          description: 'desc',
          microdata: {
            og: 'og-microdata'
          }
        }
      },
      {
        code: 'TEST-CODE-1',
        prio: 10,
        limitToPropertyCodes: ['REV', 'VAN'],
        showOnOffersPage: true,
        includeBookingButton: true,
        meta: {
          description: 'desc',
          microdata: {
            og: 'og-microdata'
          }
        }
      }
    ];

    var DATA_PROPERTIES = [
      {
        code: 'VAN'
      },
      {
        code: 'REV'
      }
    ];

    beforeEach(function() {
      module('underscore');

      module('mobius.controllers.offers', function($provide, $controllerProvider) {
        $provide.value('cookieFactory', function(a){return {}[a];});

        $provide.value('breadcrumbsService', {
          clear: sinon.stub().returns(this),
          addBreadCrumb: sinon.stub().returns(this)
        });

        $provide.value('chainService', {
          getChain: sinon.stub()
        });

        $provide.value('routerService', {
          buildStateParams: sinon.stub()
        });

        $provide.value('locationService', {
          getLocations: sinon.stub()
        });

        $provide.value('scrollService', {
          scrollToBreadcrumbs: sinon.stub(),
          scrollTo: sinon.stub()
        });

        $provide.value('stateService', {
          isMobile: sinon.stub(),
          correctStateParam: sinon.stub()
        });

        $provide.value('$state', {
          current: {
            name: ''
          },
          go: sinon.spy(),
          transitionTo: sinon.spy()
        });

        $provide.value('$stateParams', {
          code: 'TEST-CODE'
        });

        $provide.value('Settings', {
          UI: {
            generics:{
              singleProperty: true
            },
            offers:{
              discountCodeCookieExpiryDays: 5,
              scrollToBreadcrumbs: true
            },
            menu:{
              showHotDeals: true
            }
          },
          API: {
            chainCode: 'TESTCHAIN'
          }
        });

        $provide.value('scrollService', {
          scrollTo: sinon.spy(),
          scrollToBreadcrumbs: sinon.spy()
        });

        $provide.value('propertyService', {
          getPropertyDetails: sinon.stub(),
          getAll: sinon.stub()
        });

        $provide.value('metaInformationService', {
          setMetaDescription: sinon.spy(),
          setMetaKeywords: sinon.spy(),
          setPageTitle: sinon.spy(),
          setOgGraph: sinon.spy()
        });

        $provide.value('$location', {
          absUrl: sinon.stub()
        });

        $provide.value('bookingService', {
          getCodeFromSlug: function(s){return s;},
          getAPIParams: function(){
            return {};
          },
          setBookingOffer: function(){}
        });

        $provide.value('contentService', {
          getOffers: sinon.stub()
        });
        /*
        $controllerProvider.register('MainCtrl', function($scope){
          $scope._mainCtrlInherited = true;
        });
        */
        $controllerProvider.register('SSOCtrl', function(){});
      });
    });

    beforeEach(inject(function($controller, $rootScope, $q, $location, $state,
        breadcrumbsService, propertyService, contentService, chainService) {
      _scope = $rootScope.$new();
      _breadcrumbsService = breadcrumbsService;
      _$state = $state;

      _breadcrumbsService.clear.returns({
        addBreadCrumb: sinon.stub().returns(_breadcrumbsService)
      });

      _contentService = contentService;
      _contentService.getOffers.returns($q.when(OFFERS_DATA));

      _chainService = chainService;
      _chainService.getChain.returns($q.when(CHAIN_DATA));

      _propertyService = propertyService;
      _propertyService.getAll.returns($q.when(DATA_PROPERTIES));

      _$location = $location;
      _$location.absUrl.returns('http://testdomain/about');

      $controller('OffersCtrl', { $scope: _scope });
    }));

    describe('when controller initialized', function() {
      /*
      it('should inherit MainCtrl', function(){
        expect(_scope._mainCtrlInherited).equal(true);
      });
      */

      it('should add Offers breadcrumb', function(){
        //expect(_breadcrumbsService.addBreadCrumb.calledWith('Offers')).equal(true);
      });

      it('should download chain data from the server and define it on scope', function(){
        _scope.$digest();
        //expect(_chainService.getChain.calledOnce).equal(true);
        //expect(_chainService.getChain.calledWith('TESTCHAIN')).equal(true);
      });

      it('should contain offers available to all the properties and define then on scope', function(){
        _scope.$digest();
        expect(_scope.offersList.length).equal(OFFERS_DATA.length);
      });

      it('should sort offers list by priorities', function(){
        _scope.$digest();
        expect(_scope.offersList[0].code).equal(OFFERS_DATA[2].code);
        expect(_scope.offersList[1].code).equal(OFFERS_DATA[1].code);
        expect(_scope.offersList[2].code).equal(OFFERS_DATA[0].code);
      });
    });

    /*
    describe('goToDetail', function() {
      it('should navigate to offer details page', function(){
        _scope.goToDetail('TEST-CODE');
        expect(_$state.go.calledOnce).equal(true);
      });
    });
    */

    describe('goTooffersList', function() {
      it('should navigate to offers page without code and force state reload', function(){
        //_scope.goToOffersList();
        //expect(_$state.go.calledOnce).equal(true);
        //expect(_$state.go.calledWith('offers', {code: ''}, {reload: true})).equal(true);
      });
    });

    describe('getRelevant', function() {
      it('should return true if same about details are selected', function(){
        _scope.$digest();
        //expect(_scope.getRelevant(null, 0)).equal(true);
      });

      it('should return true when viewing other offers details', function(){
        _scope.$digest();
        expect(_scope.getRelevant(null, 1)).equal(true);
      });
    });

    describe('showDetail', function() {
      it('should be set to true when viewing about details and code is specifyed in a current state', function(){
        expect(_scope.showDetail).equal(true);
      });
    });
  });
});
