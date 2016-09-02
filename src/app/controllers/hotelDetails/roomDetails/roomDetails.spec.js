/*'use strict';

describe('mobius.controllers.room.details', function() {
  describe('RoomDetailsCtrl', function() {
    var _scope, _modalService;

    beforeEach(function() {
      module('underscore');
      module('mobius.controllers.room.details', function($provide){
        $provide.value('modalService', {
          openPoliciesInfo: sinon.spy(),
          openPriceBreakdownInfo: sinon.spy(),
          openGallery: function(){}
        });

        $provide.value('contentService', {});
        $provide.value('propertyService', {});
        $provide.value('filtersService', {});
        $provide.value('bookingService', {});
        $provide.value('Settings', {
          UI: {
            viewsSettings: {
              breadcrumbsBar: {
                displayRoomTitle: false
              }
            }
          }
        });
        $provide.value('chainService', {});
        $provide.value('$stateParams', {});
        $provide.value('breadcrumbsService', {});

        $provide.value('mobiusTrackingService', {
          trackSearch: sinon.spy()
        });

        $provide.value('dataLayerService', {
          trackProductsDetailsView: sinon.spy(),
          trackProductsImpressions: sinon.spy()
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, modalService) {
      _scope = $rootScope.$new();
      _modalService = modalService;

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
});*/
