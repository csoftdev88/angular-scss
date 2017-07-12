'use strict';

describe('mobius.controllers.reservations', function() {
  describe('ReservationsCtrl', function() {
    var _scope, _clock, _spyReservationServiceGetAll,
      _spyPropertyServiceGetPropertyDetails, _chainService;

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

    var TEST_RESERVATIONS = [
      {
        arrivalDate: '2015-01-02',
        'property': {
          'code': 'ABB'
        }
      },
      {
        arrivalDate: '2014-01-01',
        'property': {
          'code': 'ABB'
        }
      },
      {
        arrivalDate: '2016-01-01',
        'property': {
          'code': 'ABB'
        }
      }
    ];

    var TEST_USER = {id: 123};

    var TEST_PROPERTY_ABB = {id: 123};

    beforeEach(function() {
      module('underscore');
      module('mobiusApp.factories.preloader');

      module('mobius.controllers.reservations', function($provide, $controllerProvider) {
        $provide.value('modalService', {});
        $provide.value('creditCardTypeService', {});
        $provide.value('userObject', TEST_USER);

        $provide.value('reservationService', {
          getAll: function(){
            return {
              then: function(c){c(TEST_RESERVATIONS);}
            };
          },
          getCancelledReservations: function(){
            return {
              then: function(c){c([]);}
            };
          }
        });

        $provide.value('$state', {});

        $provide.value('chainService', {
          getChain: sinon.stub()
        });
        $provide.value('metaInformationService', {
          setMetaDescription: sinon.spy(),
          setMetaKeywords: sinon.spy(),
          setPageTitle: sinon.spy(),
          setOgGraph: sinon.spy()
        });
        $provide.value('Settings', {
          API: {
            chainCode: 'TESTCHAIN'
          },
          UI: {
            currencies: {
              default:'CAD'
            },
            viewsSettings: {
              reservationsOverview: {
                fullWidthSections:false
              }
            }
          }
        });

        $provide.value('scrollService', {scrollTo: function(){}});

        $provide.value('propertyService', {
          getPropertyDetails: function(){
            return {
              then: function(c){c(TEST_PROPERTY_ABB);}
            };
          }
        });

        var breadcrumbs = {
          clear: function(){ return breadcrumbs; },
          addBreadCrumb: function(){ return breadcrumbs; }
        };
        $provide.value('breadcrumbsService', breadcrumbs);

        $controllerProvider.register('MainCtrl', function(){});

        $controllerProvider.register('AuthCtrl', function($scope, config){
          config.onAuthorized(true);
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, reservationService,
      propertyService, chainService, $q) {
      _scope = $rootScope.$new();
      _scope.auth = {
        isLoggedIn: function () { return true; }
      };

      _scope.auth = {
        isLoggedIn: function () { return true; }
      };

      _clock = sinon.useFakeTimers(0 , 'Date');
      _clock.tick(window.moment('2015-01-01T10:53:35+0000').valueOf());

      _spyReservationServiceGetAll = sinon.spy(reservationService, 'getAll');
      _spyPropertyServiceGetPropertyDetails = sinon.spy(propertyService, 'getPropertyDetails');

      _chainService = chainService;
      _chainService.getChain.returns($q.when(CHAIN_DATA));

      $controller('ReservationsCtrl', { $scope: _scope });
      _scope.$digest();
    }));

    afterEach(function(){
      _spyReservationServiceGetAll.restore();
      _spyPropertyServiceGetPropertyDetails.restore();
      _clock.restore();
    });

    describe('when controller initialized', function() {
      it('should download chain data from the server and define it on scope', function(){
        _scope.$digest();
        expect(_chainService.getChain.calledOnce).equal(true);
        expect(_chainService.getChain.calledWith('TESTCHAIN')).equal(true);
      });

      it('should download all reservations from the server', function(){
        expect(_spyReservationServiceGetAll.calledOnce).equal(true);
      });

      it('should download property details from the server and store the data in cache', function(){
        expect(_spyPropertyServiceGetPropertyDetails.calledOnce).equal(true);
        expect(_spyPropertyServiceGetPropertyDetails.calledWith('ABB')).equal(true);
      });

      it('should past, future and next stays objects and sort them by arrivalDate', function(){
        expect(_scope.reservations.nextStay.arrivalDate).equal('2015-01-02');
        expect(_scope.reservations.pastStays[0].arrivalDate).equal('2014-01-01');
        expect(_scope.reservations.futureStays[0].arrivalDate).equal('2016-01-01');
      });
    });

    describe('getPropertyDetails', function() {
      it('should be defined as a function', function() {
        expect(_scope.getPropertyDetails).to.be.a('function');
      });

      it('should return cached property data', function() {
        expect(_scope.getPropertyDetails('ABB')).equal(TEST_PROPERTY_ABB);
      });
    });
  });
});
