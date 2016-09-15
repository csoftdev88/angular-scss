'use strict';
/*
describe('mobius.controllers.common.content', function() {
  describe('ContentCtr', function() {

    var _scope;

    var HOTELS = [
      {name: 'h1', meta: {slug: 'slug1'}},
      {name: 'h2', meta: {slug: 'place-hotelcode2'}}
    ];

    beforeEach(function() {
      module('underscore');
      module('mobiusApp.factories.preloader');

      module('mobius.controllers.common.content', function($provide){
        $provide.value('$state', {
          params: {
            propertySlug: 'place-hotelcode2'
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

        $provide.value('Settings', {
          UI: {
            menu: {
              'showOffers': true,
              'offerSpecificToSelectedProperty': true,
              'showAbout': true,
              'showNews': true,
              'showContact': true
            },
            generics: {
              'singleProperty': false
            }
          }
        });
      });
    });

    beforeEach(inject(function($controller, $q, $rootScope, propertyService, contentService) {
      _scope = $rootScope.$new();

      propertyService.getAll.returns($q.when(HOTELS));
      contentService.getOffers.returns($q.when(null));

      _scope.item = 'hotels';

      $controller('ContentCtr', { $scope: _scope });
      _scope.$digest();
    }));

    describe('initialization', function() {
      it('should define settings on scope according to item object', function(){
        //expect(_scope.settings).to.be.an('object');
      });

      it('should define hotels on scope once downloaded from the server', function(){
        expect(_scope.hotels).equal(HOTELS);
      });
    });
  });
});
*/