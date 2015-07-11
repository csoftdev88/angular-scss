'use strict';

describe('mobius.controllers.room.details', function() {
  describe('RoomDetailsCtrl', function() {
    var _scope;

    beforeEach(function() {
      module('mobius.controllers.room.details', function($provide){
        $provide.value('modalService', {
          openPoliciesInfo: function(){},
          openPriceBreakdownInfo: function(){},
          openGallery: function(){}
        });

        $provide.value('propertyService', {});
        $provide.value('filtersService', {});
        $provide.value('bookingService', {});
      });
    });

    beforeEach(inject(function($controller, $rootScope) {
      _scope = $rootScope.$new();
      $controller('RoomDetailsCtrl', { $scope: _scope });
    }));

    describe('setRoomDetails', function() {
      it('should be defined as a function on scope', function() {
        expect(_scope.setRoomDetails).to.be.a('function');
      });

      it('should change the value of roomDetails property', function() {
        expect(_scope.roomDetails).equal(undefined);
        var room = {test: 123, images: []};
        _scope.setRoomDetails(room);
        expect(_scope.roomDetails).equal(room);
      });
    });

    describe('methods for modals', function(){
      describe('openPoliciesInfo', function() {
        it('should be defined as a function on scope', function() {
          expect(_scope.openPoliciesInfo).to.be.a('function');
        });
      });

      describe('openPriceBreakdownInfo', function() {
        it('should be defined as a function on scope', function() {
          expect(_scope.openPriceBreakdownInfo).to.be.a('function');
        });
      });
    });

    describe('getRoomData', function() {
      it('should be defined as a function on scope', function() {
        expect(_scope.getRoomData).to.be.a('function');
      });
    });
  });
});
