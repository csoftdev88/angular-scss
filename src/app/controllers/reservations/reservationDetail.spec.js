'use strict';
/*jshint -W030 */

describe('mobius.controllers.reservationDetail', function() {
  describe('ReservationDetailCtrl', function() {
    var _scope, _spyGetReservation, _spyGetPropertyDetails, _spyGetReservationAddOns,
      _spySendToPassBook, _spyAddMessage;

    var TEST_RESERVATION_CODE = 95234134;
    var TEST_RESERVATION = {
      property: {
        code: 'TEST_PROP_CODE',
        meta: {
          slug: 'test_slug',
          description: 'meta description',
          pagetitle: 'Hotel',
          keywords: 'hotel, rooms',
          microdata: {
            schemaOrg: [],
            og: []
          }
        }
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
      code: 'TPROP',
      meta: {
        slug: 'test_slug',
        description: 'meta description',
        pagetitle: 'Hotel',
        keywords: 'hotel, rooms',
        microdata: {
          schemaOrg: [],
          og: []
        }
      }
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
          reservationCode: TEST_RESERVATION_CODE,
          view: 'summary'
        });

        $provide.value('modalService', {
          openPoliciesInfo: function() {
          },
          openPriceBreakdownInfo: function() {

          },
          openAddonDetailDialog: function() {
          },
          openCancelReservationDialog: function() {
          }
        });

        $provide.value('metaInformationService', {
          setOgGraph: function() {}
        });

        $provide.service('reservationService', function() {
          return {
            getReservation: function() {
              return {
                then: function(c) {
                  c(TEST_RESERVATION);
                }
              };
            },
            getReservationAddOns: function() {
              return {
                then: function(c) {
                  c(TEST_ADDONS);
                }
              };
            },

            getAvailableAddons: function(){
              return {
                then: function(c){
                  c();
                }
              };
            },

            sendToPassbook: function(){
              return {
                then: function(c){
                  c();
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
            }
          };
        });

        $provide.value('userMessagesService', {
          addMessage: function() {
          }
        });

        var breadcrumbs = {
          addBreadCrumb: function() {
            return breadcrumbs;
          }
        };

        $provide.value('breadcrumbsService', breadcrumbs);

        $provide.value('$state', {
          go: function(){}
        });

        $provide.value('user', {
          isLoggedIn: function(){}
        });

        $controllerProvider.register('AuthCtrl', function($scope, config){
          config.onAuthorized(true);
        });

        $controllerProvider.register('ConfirmationNumberCtrl', function(){});
      });
    });

    beforeEach(inject(function($controller, $rootScope, reservationService, modalService, propertyService,
        userMessagesService) {
      _scope = $rootScope.$new();

      _spyGetReservation = sinon.spy(reservationService, 'getReservation');
      _spyGetPropertyDetails = sinon.spy(propertyService, 'getPropertyDetails');
      _spyGetReservationAddOns = sinon.spy(reservationService, 'getReservationAddOns');
      _spySendToPassBook = sinon.spy(reservationService, 'sendToPassbook');
      _spyAddMessage = sinon.spy(userMessagesService, 'addMessage');

      $controller('ReservationDetailCtrl', {$scope: _scope});
      _scope.$digest();
    }));

    afterEach(function() {
      _spyGetReservation.restore();
      _spyGetPropertyDetails.restore();
      _spyGetReservationAddOns.restore();
      _spySendToPassBook.restore();
      _spyAddMessage.restore();
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

      it('should set isEditable flag to false when view state param is equal to "summary"', function() {
        expect(_scope.isEditable).equal(false);
      });

      // TODO: Fix
      /*
      it('should download property details from the server and store them', function() {
        expect(_spyGetReservationAddOns).calledOnce;
        expect(_spyGetReservationAddOns.calledWith(TEST_RESERVATION_CODE)).equal(true);
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
      */
    });

    describe('getAddonsTotalPrice', function() {
      it('should return a total price of addons added to current reservation', function() {
        _scope.reservationAddons = [
          {price: 5},
          {price: 11}
        ];

        expect(_scope.getAddonsTotalPrice()).equal(16);

        _scope.reservationAddons = [];
        expect(_scope.getAddonsTotalPrice()).equal(0);

        _scope.reservationAddons = null;
        expect(_scope.getAddonsTotalPrice()).equal(0);
      });
    });

    describe('getAddonsTotalPoints', function() {
      it('should return a total price of addons added to current reservation', function() {
        _scope.reservationAddons = [
          {points: 5},
          {points: 11}
        ];

        expect(_scope.getAddonsTotalPoints()).equal(16);

        _scope.reservationAddons = [];
        expect(_scope.getAddonsTotalPoints()).equal(0);

        _scope.reservationAddons = null;
        expect(_scope.getAddonsTotalPoints()).equal(0);
      });
    });

    describe('sendToPassbook', function(){
      it('should send current reservation to passbook endpoint', function() {
        _scope.sendToPassbook();
        expect(_spySendToPassBook.calledOnce).equal(true);
        expect(_spySendToPassBook.calledWith(TEST_RESERVATION_CODE)).equal(true);
      });

      it('should show notification when reservation is successfully addded to passbook', function(){
        _scope.sendToPassbook();
        expect(_spyAddMessage.calledOnce).equal(true);
        expect(_spyAddMessage.calledWith('<div>You have successfully added your reservation <strong>95234134</strong> to passbook.</div>')).equal(true);
      });
    });
  });
});
