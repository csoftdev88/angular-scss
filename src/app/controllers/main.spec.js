'use strict';

describe('mobius.controllers.main', function() {
  describe('MainCtrl', function() {
    var _scope, _modalService, _contentService;

    var ADVERTS_DATA = [{
      images: [{a: 123}, {b: 123}]
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
          getAdverts: sinon.stub()
        });

        $provide.value('Settings', {
          UI: {
            adverts: {
              heroAdverts: 'test-size'
            }
          }
        });
        $provide.value('user', {});
      });
    });

    beforeEach(inject(function($controller, $rootScope, $q, modalService,
        contentService) {

      _scope = $rootScope.$new();

      _modalService = modalService;

      _contentService = contentService;
      _contentService.getAdverts.returns($q.when(ADVERTS_DATA));

      $controller('MainCtrl', { $scope: _scope });
    }));

    describe('when controller initialized', function() {
      it('should check if modals should be opened for current state', function(){
        expect(_modalService.openDialogIfPresent.calledOnce).equal(true);
      });
    });

    describe('updateHeroContent', function() {
      it('should update hero content', function(){
        var data = [{a: 'test'}];
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
