'use strict';

describe('mobius.controllers.reservations', function() {
  describe('ReservationsCtrl', function() {
    var _scope, _clock, _spyReservationServiceGetAll,
      _spyPropertyServiceGetPropertyDetails;

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

    var TEST_PROPERTY_ABB = {id: 123};

    beforeEach(function() {
      module('underscore');
      module('mobiusApp.factories.preloader');

      module('mobius.controllers.reservations', function($provide, $controllerProvider) {
        $provide.value('modalService', {});
        $provide.value('creditCardTypeService', {});

        $provide.value('reservationService', {
          getAll: function(){
            return {
              then: function(c){c(TEST_RESERVATIONS);}
            };
          }
        });

        $provide.value('$state', {});

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
      propertyService) {
      _scope = $rootScope.$new();

      _clock = sinon.useFakeTimers(0 , 'Date');
      _clock.tick(window.moment('2015-01-01T10:53:35+0000').valueOf());

      _spyReservationServiceGetAll = sinon.spy(reservationService, 'getAll');
      _spyPropertyServiceGetPropertyDetails = sinon.spy(propertyService, 'getPropertyDetails');

      $controller('ReservationsCtrl', { $scope: _scope });
    }));

    afterEach(function(){
      _spyReservationServiceGetAll.restore();
      _spyPropertyServiceGetPropertyDetails.restore();
      _clock.restore();
    });

    describe('when controller initialized', function() {
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
