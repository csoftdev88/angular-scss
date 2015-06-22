'use strict';

describe('mobius.controllers.reservation', function() {
  describe('ReservationCtrl', function() {
    var _scope, _spyOpenPoliciesInfo, _spyStateGo, _spyCreateReservation,
    _clock;

    var TEST_USER_ID = 123456789;
    var TEST_RESERVATION_CODE = 95234134;

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
        $provide.value('propertyService', {});
        $provide.value('$stateParams', {});

        $provide.value('$state', {
          current: {
            name: ''
          },

          go: function(){}
        });

        $provide.value('modalService', {
          openPoliciesInfo: function(){}
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

        $provide.value('filtersService', {});

        $provide.value('userMessagesService', {
          addInfoMessage: function(){}
        });

        $provide.value('user', {
          getUser: function(){
            return {id: TEST_USER_ID};
          }
        });

        $provide.value('Settings', {
          UI: {
            'booking': {
              cardTypes: {
                'visa': {
                  regex: /^4[0-9]{12}(?:[0-9]{3})?$/,
                  icon: 'visa',
                  code: 'VI'
                }
              }
            }
          }
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, $state,
      reservationService, modalService) {
      _scope = $rootScope.$new();

      _clock = sinon.useFakeTimers(0 , 'Date');
      _clock.tick(window.moment('2015-01-25T10:53:35+0000').valueOf());

      $controller('ReservationCtrl', { $scope: _scope });

      _spyOpenPoliciesInfo = sinon.spy(modalService, 'openPoliciesInfo');
      _spyStateGo = sinon.spy($state, 'go');
      _spyCreateReservation  = sinon.spy(reservationService, 'createReservation');
    }));

    afterEach(function() {
      _spyOpenPoliciesInfo.restore();
      _spyStateGo.restore();
      _spyCreateReservation.restore();
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

    describe('getCreditCardDetails', function() {
      it('should return null when number is not defined', function() {
        expect(_scope.getCreditCardDetails()).equal(null);
        expect(_scope.getCreditCardDetails(undefined)).equal(null);
        expect(_scope.getCreditCardDetails(null)).equal(null);
      });

      it('should return card type when found in the config', function() {
        var cardDetails = _scope.getCreditCardDetails('4222222222222');

        expect(cardDetails.icon).equal('visa');
        expect(cardDetails.code).equal('VI');
      });

      it('should return null when credit card number doesnt match expressions in the config', function() {
        expect(_scope.getCreditCardDetails('2222222222224')).equal(null);
      });

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
        expect(_spyCreateReservation.calledOnce).equal(true);
      });

      it('should redirect to a after state when reservation complete', function(){
        _scope.makeReservation();
        expect(_spyStateGo.calledOnce).equal(true);
        expect(_spyStateGo.calledWith('reservation.after')).equal(true);
      });

      describe('reservation params check', function() {
        var bookingParams;
        beforeEach(function(){
          _scope.makeReservation();
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
          expect(bookingParams.paymentInfo.paymentMethod).equal('cc');
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
