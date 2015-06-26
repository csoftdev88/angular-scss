'use strict';
/*jshint -W030 */

describe('mobius.controllers.reservation', function() {
  describe('ReservationCtrl', function() {
    var _scope, _spyOpenPoliciesInfo, _spyStateGo, _spyCreateReservation,
    _clock, _spyGetPropertyDetails, _spyGetRoomProductAddOns, _spyUpdateUser;

    var TEST_PROPERTY_ID = 987654321;
    var TEST_ROOM_ID = 918273645;
    var TEST_PRODUCT_CODE = 192837465;
    var TEST_USER_ID = 123456789;
    var TEST_RESERVATION_CODE = 95234134;
    var TEST_PROPERTY = {
      code: 'TPROP'
    };
    var TEST_ROOM = {
    };
    var TEST_PRODUCTS = [
    ];
    var TEST_ADDONS = [
      {code: 'short', description: 'description'},
      {code: 'long', description: 'description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description'}
    ];
    var TEST_VISA = {
      regex: /^4[0-9]{12}(?:[0-9]{3})?$/,
      icon: 'visa',
      code: 'VI'
    };

    beforeEach(function() {
      module('mobius.controllers.room.details');
      module('mobiusApp.factories.preloader');

      module('mobius.controllers.reservation', function($provide) {
        $provide.value('bookingService', {
          getAPIParams: function(){
            return {
              productGroupId: '123'
            };
          }
        });
        $provide.value('$stateParams', {
          property: TEST_PROPERTY_ID,
          roomID: TEST_ROOM_ID,
          productCode: TEST_PRODUCT_CODE
        });

        $provide.value('$state', {
          current: {
            name: ''
          },

          go: function(){}
        });

        $provide.value('modalService', {
          openPoliciesInfo: function(){},
          openAddonDetailDialog: function(){}
        });
        $provide.value('reservationService', {
          createReservation: function(){
            return {
              then: function(c){
                c({
                  reservationCode: TEST_RESERVATION_CODE
                });
              }
            };
          }
        });

        $provide.service('propertyService', function($q) {
          return {
            getPropertyDetails: function(){
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

        $provide.value('filtersService', {});

        $provide.value('userMessagesService', {
          addInfoMessage: function(){}
        });

        $provide.value('user', {
          getUser: function(){
            return {id: TEST_USER_ID};
          },
          updateUser: function() {
            return {
              then: function(c) {
                c({});
              }
            };
          }
        });

        $provide.value('Settings', {
          UI: {
            'booking': {
              cardTypes: {
                'visa': TEST_VISA
              }
            }
          }
        });

        $provide.value('creditCardTypeService', {
          getCreditCardDetails: function() {
            return {
              code: TEST_VISA.code,
              icon: TEST_VISA.icon
            };
          }
        });

        var breadcrumbs = {
          clear: function(){ return breadcrumbs; },
          addBreadCrumb: function(){ return breadcrumbs; },
          addHref: function(){ return breadcrumbs; },
          setActiveHref: function(){ return breadcrumbs; }
        };
        $provide.value('breadcrumbsService', breadcrumbs);
      });
    });

    beforeEach(inject(function($controller, $rootScope, $state,
      reservationService, modalService, propertyService, user) {
      _scope = $rootScope.$new();

      _scope.updateHeroContent = function(){};

      _clock = sinon.useFakeTimers(0 , 'Date');
      _clock.tick(window.moment('2015-01-25T10:53:35+0000').valueOf());

      _spyOpenPoliciesInfo = sinon.spy(modalService, 'openPoliciesInfo');
      _spyStateGo = sinon.spy($state, 'go');
      _spyCreateReservation  = sinon.spy(reservationService, 'createReservation');
      _spyGetPropertyDetails  = sinon.spy(propertyService, 'getPropertyDetails');
      _spyGetRoomProductAddOns  = sinon.spy(propertyService, 'getRoomProductAddOns');
      _spyUpdateUser  = sinon.spy(user, 'updateUser');

      $controller('ReservationCtrl', { $scope: _scope });
      _scope.$digest();
    }));

    afterEach(function() {
      _spyOpenPoliciesInfo.restore();
      _spyStateGo.restore();
      _spyCreateReservation.restore();
      _spyGetPropertyDetails.restore();
      _spyGetRoomProductAddOns.restore();
      _spyUpdateUser.restore();
      _clock.restore();
    });

    describe('when controller initialized', function() {
      it('should download property details from the server and store them', function(){
        expect(_spyGetPropertyDetails).calledOnce;
        expect(_spyGetPropertyDetails.calledWith(TEST_PROPERTY_ID)).equal(true);
        expect(_scope.property).equal(TEST_PROPERTY);
      });

      it('should download property details from the server and store them', function(){
        expect(_spyGetRoomProductAddOns).calledOnce;
        expect(_spyGetRoomProductAddOns.calledWith(TEST_PROPERTY_ID, TEST_ROOM_ID, TEST_PRODUCT_CODE)).equal(true);
        expect(_scope.addons).to.have.keys(TEST_ADDONS[0].code, TEST_ADDONS[1].code);
        expect(_scope.addons[TEST_ADDONS[0].code]).deep.equal({code: TEST_ADDONS[0].code, description: TEST_ADDONS[0].description, descriptionShort: TEST_ADDONS[0].description, hasViewMore: false});
        expect(_scope.addons[TEST_ADDONS[1].code]).deep.equal({code: TEST_ADDONS[1].code, description: TEST_ADDONS[1].description, descriptionShort: TEST_ADDONS[1].description.substr(0, 100) + '…', hasViewMore: true});
      });
    });

    describe('readPolicies', function() {
      beforeEach(function(){
        _scope.selectedProduct = {test: 123};
      });

      it('should set hasReadRatePolicies property on scope to true', function() {
        expect(_scope.hasReadRatePolicies).equal(undefined);
        _scope.readPolicies();
        expect(_scope.hasReadRatePolicies).equal(true);
      });

      //it('should open policies dialogue with currently selected product', function() {
      //  _scope.readPolicies();
      //  expect(_spyOpenPoliciesInfo.calledOnce).equal(true);
      //  expect(_spyOpenPoliciesInfo.calledWith({test: 123})).equal(true);
      //});
    });

    describe('expiration date', function() {
      it('should set credit card expiration min date on scope', function() {
        expect(_scope.expirationMinDate).equal('2015-01');
      });
    });

    describe('makeReservation', function() {
      var TEST_ROOM_ID = 555;
      var TEST_CARD_NUMBER = 4222222222222;

      beforeEach(function(){
        // Reservation data
        _scope.selectedProduct = {
          productPropertyRoomTypeId: TEST_ROOM_ID
        };

        _scope.billingDetails = {
          paymentMethod: 'cc',
          card: {
            number: TEST_CARD_NUMBER,
            expirationDate: '2015-01-05'
          }
        };

        _scope.bookingDetails = {
          from: '2015-01-01',
          to: '2015-02-02'
        };
      });

      it('should be defined as a function', function() {
        expect(_scope.makeReservation).to.be.a('function');
      });

      it('should fire a POST request to reservation API', function(){
        _scope.makeReservation();
        _scope.$digest();
        expect(_spyCreateReservation.calledOnce).equal(true);
      });

      it('should fire a PUT request to customer API', function(){
        _scope.makeReservation();
        _scope.$digest();
        expect(_spyUpdateUser.calledOnce).equal(true);
      });

      it('should redirect to a after state when reservation complete', function(){
        _scope.makeReservation();
        _scope.$digest();
        expect(_spyStateGo.calledOnce).equal(true);
        expect(_spyStateGo.calledWith('reservation.after')).equal(true);
      });

      describe('reservation params check', function() {
        var bookingParams;
        beforeEach(function(){
          _scope.makeReservation();
          _scope.$digest();
          bookingParams = _spyCreateReservation.args[0][0];
        });

        it('should get userId from user service and use it as customer', function(){
          expect(_spyCreateReservation.calledWith(sinon.match.has(
            'customer', TEST_USER_ID))).equal(true);
        });

        it('should have one room presented with a proper roomId', function(){
          expect(bookingParams.rooms.length).equal(1);
          expect(bookingParams.rooms[0].roomId).equal(TEST_ROOM_ID);
        });

        it('should contain payment details', function(){
          //expect(bookingParams.paymentInfo.paymentMethod).equal('cc');
          expect(bookingParams.paymentInfo.ccPayment.number).equal(TEST_CARD_NUMBER);
        });

        it('should correctly detect payment card type', function(){
          expect(bookingParams.paymentInfo.ccPayment.typeCode).equal('VI');
        });

        it('should use correct arrival and departure dates', function(){
          expect(bookingParams.arrivalDate).equal('2015-01-01');
          expect(bookingParams.departureDate).equal('2015-02-02');
        });

        it('should set credit expiration date to end of the currently selected month', function(){
          expect(bookingParams.paymentInfo.ccPayment.expirationDate).equal('2015-01-31');
        });
      });
    });
  });
});
