'use strict';

describe('mobius.controllers.main', function() {
  describe('MainCtrl', function() {
    var _scope, _modalService, _contentService, _propertyService;

    var ADVERTS_DATA = [{
      images: [{a: 123, link: {code: 'CODE'}}, {b: 123, link: {code: 'CODE'}}]
    }];

    var PROPERTIES_DATA = [{
      properties: [{a: 123}, {b: 123}]
    }];

    var OFFERS_DATA = [{
      offers: [{a: 123}, {b: 123}]
    }];

  
    beforeEach(function() {
      module('underscore');

      module('mobius.controllers.common.preloader');
      module('mobius.controllers.common.sanitize');

      module('mobius.controllers.main', function($provide) {
        $provide.value('$state', {});

        $provide.value('$modal', {});
        $provide.value('modalService', {
          openDialogIfPresent: sinon.spy()
        });

        $provide.value('contentService', {
          getAdverts: sinon.stub(),
          getOffers: sinon.stub()
        });

        $provide.value('propertyService', {
          getAll: sinon.stub()
        });

        $provide.value('Settings', {
          UI: {
            generics: {
              loyaltyProgramEnabled: true
            },
            adverts: {
              heroAdverts: 'test-size'
            }
          }
        });
        $provide.value('user', {});
        $provide.value('$stateParams', {});
      });
    });

    beforeEach(inject(function($controller, $rootScope, $q, modalService,
        contentService, propertyService) {

      _scope = $rootScope.$new();

      _modalService = modalService;

      _contentService = contentService;
      _contentService.getAdverts.returns($q.when(ADVERTS_DATA));
      _contentService.getOffers.returns($q.when(OFFERS_DATA));

      _propertyService = propertyService;
      _propertyService.getAll.returns($q.when(PROPERTIES_DATA));

      $controller('MainCtrl', { $scope: _scope });
    }));

    describe('when controller initialized', function() {
      it('should check if modals should be opened for current state', function(){
        expect(_modalService.openDialogIfPresent.calledOnce).equal(true);
      });
    });

    describe('updateHeroContent', function() {
      it('should update hero content', function(){
        var data = [{a: 'test', link: {code: 'CODE'}}];
        _scope.updateHeroContent(data);
        expect(_scope.heroContent).equal(data);
      });

      it('should load hero content from the server', function(){
        _scope.updateHeroContent();
        _scope.$digest();
        expect(_contentService.getAdverts.calledOnce).equal(true);
        expect(_contentService.getAdverts.calledWith({bannerSize: 'test-size'})).equal(true);
      });
    });
  });
});
