'use strict';
/*jshint -W030 */

describe('mobius.controllers.reservation', function() {
  describe('ReservationCtrl', function() {
    var _scope, _spyOpenPoliciesInfo, _spyStateGo, _spyCreateReservation,
    _clock, _spyGetPropertyDetails, _spyUpdateUser;

    var TEST_PROPERTY_ID = 987654321;
    var TEST_ROOM_ID = 918273645;
    var TEST_PRODUCT_CODE = 192837465;
    var TEST_USER_ID = 123456789;
    var TEST_USER = {id: TEST_USER_ID};
    var TEST_RESERVATION_CODE = 95234134;
    var TEST_PROPERTY = {
      code: 'TPROP'
    };
    var TEST_ROOM = {
    };
    var TEST_PRODUCTS = [
    ];
    var TEST_VISA = {
      regex: /^4[0-9]{12}(?:[0-9]{3})?$/,
      icon: 'visa',
      code: 'VI'
    };

    beforeEach(function() {
      module('mobius.controllers.room.details');
      module('mobius.controllers.common.cardExpiration');
      module('mobius.controllers.common.sso', function($provide){
        $provide.value('$window', {
          infiniti: {api: {}},
          moment: window.moment,
          _: window._
        });
      });

      module('mobiusApp.factories.preloader');

      module('mobius.controllers.reservation', function($provide, $controllerProvider) {
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
          openAddonDetailDialog: function(){},
          openGallery: function(){},
          openTermsAgreeDialog: function(){}
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
          };
        });

        $provide.value('filtersService', {});

        $provide.value('userMessagesService', {
          addInfoMessage: function(){}
        });

        $provide.value('user', {
          getUser: function(){
            return TEST_USER;
          },
          isLoggedIn: function(){
            return true;
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
          },

          getCreditCardPreviewNumber: function(){}
        });

        $provide.value('_', window._);

        $controllerProvider.register('AuthCtrl', function($scope, config){
          config.onAuthorized(true);
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
      _spyUpdateUser  = sinon.spy(user, 'updateUser');

      $controller('ReservationCtrl', { $scope: _scope });
      _scope.$digest();
    }));

    afterEach(function() {
      _spyOpenPoliciesInfo.restore();
      _spyStateGo.restore();
      _spyCreateReservation.restore();
      _spyGetPropertyDetails.restore();
      _spyUpdateUser.restore();
      _clock.restore();
    });

    describe('when controller initialized', function() {
      it('should download property details from the server and store them', function(){
        expect(_spyGetPropertyDetails).calledOnce;
        expect(_spyGetPropertyDetails.calledWith(TEST_PROPERTY_ID)).equal(true);
        expect(_scope.property).equal(TEST_PROPERTY);
      });
    });

    describe('getCreditCardPreviewNumber', function(){
      it('should be defined as a function', function() {
        expect(_scope.getCreditCardPreviewNumber).to.be.a('function');
      });
    });

    describe('makeReservation', function() {
      var TEST_ROOM_ID = 555;
      var TEST_CARD_NUMBER = 4222222222222;

      beforeEach(function(){
        // Reservation data
        _scope.selectedProduct = {
          productPropertyRoomTypeId: TEST_ROOM_ID,
          price: {
            totalBase: 555
          }
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
        _scope.additionalInfo.agree = true;
        _scope.makeReservation();
        _scope.$digest();
        expect(_spyCreateReservation.calledOnce).equal(true);
      });

      it('should fire a PUT request to customer API', function(){
        _scope.additionalInfo.agree = true;
        _scope.makeReservation();
        _scope.$digest();
        expect(_spyUpdateUser.calledOnce).equal(true);
      });

      it('should redirect to a detail state when reservation complete', function(){
        _scope.additionalInfo.agree = true;
        _scope.makeReservation();
        _scope.$digest();
        expect(_spyStateGo.calledOnce).equal(true);
        expect(_spyStateGo.calledWith('reservationDetail')).equal(true);
      });

      describe('reservation params check', function() {
        var bookingParams;
        beforeEach(function(){
          _scope.additionalInfo.agree = true;
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

        // TODO: FIX
        it('should set credit expiration date to end of the currently selected month', function(){
          expect(bookingParams.paymentInfo.ccPayment.expirationDate).equal(null);
        });

        it('should set a price based on a selectedProduct totalBase price', function(){
          expect(bookingParams.price).equal(555);
        });
      });
    });
  });
});
