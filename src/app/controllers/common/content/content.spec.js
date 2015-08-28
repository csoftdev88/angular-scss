'use strict';

describe('mobius.controllers.common.content', function() {
  describe('ContentCtr', function() {

    var _scope;

    beforeEach(function() {
      module('underscore');
      module('mobiusApp.factories.preloader');

      module('mobius.controllers.common.content', function($provide){
        $provide.value('$state', {
          params: {
            propertySlug: 'place-hotelcode'
          }
        });

        $provide.value('propertyService', {
          getAll: sinon.stub()
        });

        $provide.value('contentService', {
          getOffers: sinon.stub()
        });

        $provide.value('locationService', {});

        $provide.value('bookingService', {
          getAPIParams: sinon.stub()
        });

        $provide.value('Settings', {});
      });
    });

    beforeEach(inject(function($controller, $q, $rootScope, propertyService, contentService) {
      _scope = $rootScope.$new();

      propertyService.getAll.returns($q.when(null));
      contentService.getOffers.returns($q.when(null));

      _scope.item = 'hotels';

      $controller('ContentCtr', { $scope: _scope });
    }));

    describe('initialization', function() {
      it('should define settings on scope according to item object', function(){
        expect(_scope.settings).to.be.an('object');
      });
    });
  });
});
