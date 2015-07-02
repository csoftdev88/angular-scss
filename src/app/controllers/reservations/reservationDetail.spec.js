'use strict';
/*jshint -W030 */

describe('mobius.controllers.reservationDetail', function() {
  describe('ReservationDetailCtrl', function() {
    var _scope, _spyGetReservation, _spyGetPropertyDetails, _spyGetRoomProductAddOns;

    var TEST_RESERVATION_CODE = 95234134;
    var TEST_RESERVATION = {
      property: {
        code: 'TEST_PROP_CODE'
      },
      customer: {
        id: 'TEST_CUST_ID'
      },
      rooms: [
        {
          roomTypeCode: 'TEST_ROOM_CODE',
          productCode: 'TEST_PROD_CODE'
        }
      ]
    };
    var TEST_PROPERTY = {
      code: 'TPROP'
    };
    var TEST_ROOM = {};
    var TEST_PRODUCTS = [];
    var TEST_ADDONS = [
      {code: 'short', description: 'description'},
      {
        code: 'long',
        description: 'description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description'
      }
    ];

    beforeEach(function() {
      module('mobius.controllers.room.details');
      module('mobiusApp.factories.preloader');

      module('mobius.controllers.reservationDetail', function($provide, $controllerProvider) {
        $provide.value('$stateParams', {
          reservationCode: TEST_RESERVATION_CODE
        });

        $provide.value('modalService', {
          openPoliciesInfo: function() {
          },
          openAddonDetailDialog: function() {
          },
          openCancelReservationDialog: function() {
          }
        });

        $provide.service('reservationService', function() {
          return {
            getReservation: function() {
              return {
                then: function(c) {
                  c(TEST_RESERVATION);
                }
              };
            }
          };
        });

        $provide.service('propertyService', function($q) {
          return {
            getPropertyDetails: function() {
              return $q.when(TEST_PROPERTY);
            },
            getRoomDetails: function() {
              return {
                then: function(c) {
                  c(TEST_ROOM);
                }
              };
            },
            getRoomProducts: function() {
              return {
                then: function(c) {
                  c(TEST_PRODUCTS);
                }
              };
            },
            getRoomProductAddOns: function() {
              return {
                then: function(c) {
                  c(TEST_ADDONS);
                }
              };
            }
          };
        });

        $provide.value('userMessagesService', {
          addInfoMessage: function() {
          }
        });

        var breadcrumbs = {
          addBreadCrumb: function() {
            return breadcrumbs;
          }
        };
        $provide.value('breadcrumbsService', breadcrumbs);

        $controllerProvider.register('AuthCtrl', function($scope, config){
          config.onAuthorized();
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, reservationService, modalService, propertyService) {
      _scope = $rootScope.$new();

      _spyGetReservation = sinon.spy(reservationService, 'getReservation');
      _spyGetPropertyDetails = sinon.spy(propertyService, 'getPropertyDetails');
      _spyGetRoomProductAddOns = sinon.spy(propertyService, 'getRoomProductAddOns');

      $controller('ReservationDetailCtrl', {$scope: _scope});
      _scope.$digest();
    }));

    afterEach(function() {
      _spyGetReservation.restore();
      _spyGetPropertyDetails.restore();
      _spyGetRoomProductAddOns.restore();
    });

    describe('when controller initialized', function() {
      it('should download reservation details from the server and store them', function() {
        expect(_spyGetReservation).calledOnce;
        expect(_spyGetReservation.calledWith(TEST_RESERVATION_CODE)).equal(true);
        expect(_scope.reservation).equal(TEST_RESERVATION);
      });

      it('should download property details from the server and store them', function() {
        expect(_spyGetPropertyDetails).calledOnce;
        expect(_spyGetPropertyDetails.calledWith(TEST_RESERVATION.property.code)).equal(true);
        expect(_scope.property).equal(TEST_PROPERTY);
      });

      it('should download property details from the server and store them', function() {
        expect(_spyGetRoomProductAddOns).calledOnce;
        expect(_spyGetRoomProductAddOns.calledWith(TEST_RESERVATION.property.code, TEST_RESERVATION.rooms[0].roomTypeCode, TEST_RESERVATION.rooms[0].productCode)).equal(true);
        expect(_scope.addons).to.have.keys(TEST_ADDONS[0].code, TEST_ADDONS[1].code);
        expect(_scope.addons[TEST_ADDONS[0].code]).deep.equal({
          code: TEST_ADDONS[0].code,
          description: TEST_ADDONS[0].description,
          descriptionShort: TEST_ADDONS[0].description,
          hasViewMore: false
        });
        expect(_scope.addons[TEST_ADDONS[1].code]).deep.equal({
          code: TEST_ADDONS[1].code,
          description: TEST_ADDONS[1].description,
          descriptionShort: TEST_ADDONS[1].description.substr(0, 100) + '…',
          hasViewMore: true
        });
      });
    });
  });
});
