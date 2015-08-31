'use strict';

describe('mobius.controllers.about', function() {
  describe('AboutUsCtrl', function() {
    var _scope, _breadcrumbsService, _contentService, _chainService, _$location;

    var CHAIN_DATA = {
      meta: {
        description: 'desc',
        pagetitle: 'title',
        keywords: 'kw',
        microdata: {
          og: 'og-microdata'
        }
      }
    };

    var ABOUT_DATA = {};

    beforeEach(function() {
      module('underscore');

      module('mobius.controllers.about', function($provide, $controllerProvider) {
        $provide.value('breadcrumbsService', {
          clear: sinon.stub()
        });

        $provide.value('chainService', {
          getChain: sinon.stub()
        });

        $provide.value('$state', {

        });

        $provide.value('$stateParams', {

        });

        $provide.value('Settings', {
          API: {
            chainCode: 'TESTCHAIN'
          }
        });

        $provide.value('modalService', {

        });

        $provide.value('metaInformationService', {
          setMetaDescription: sinon.spy(),
          setMetaKeywords: sinon.spy(),
          setPageTitle: sinon.spy(),
          setOgGraph: sinon.spy()
        });

        $provide.value('$location', {
          absUrl: sinon.stub()
        });

        $provide.value('bookingService', {

        });

        $provide.value('contentService', {
          getLightBoxContent: sinon.spy(),
          getAbout: sinon.stub()
        });

        $controllerProvider.register('MainCtrl', function($scope){
          $scope._mainCtrlInherited = true;
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, $q, $location, breadcrumbsService, contentService,
      chainService) {
      _scope = $rootScope.$new();
      _breadcrumbsService = breadcrumbsService;

      _breadcrumbsService.clear.returns({
        addBreadCrumb: sinon.spy()
      });

      _contentService = contentService;
      _contentService.getAbout.returns($q.when(ABOUT_DATA));

      _chainService = chainService;
      _chainService.getChain.returns($q.when(CHAIN_DATA));

      _$location = $location;
      _$location.absUrl.returns('http://testdomain/about');

      $controller('AboutUsCtrl', { $scope: _scope });
    }));

    describe('when controller initialized', function() {
      it('should inherit MainCtrl', function(){
        expect(_scope._mainCtrlInherited).equal(true);
      });

      it('should clear all breadcumbs', function(){
        expect(_breadcrumbsService.clear.calledOnce).equal(true);
      });

      it('should add about us breadcrumb', function(){
        expect(_breadcrumbsService.clear().addBreadCrumb.calledOnce).equal(true);
        expect(_breadcrumbsService.clear().addBreadCrumb.calledWith('About Us')).equal(true);
      });

      it('should download chain data from the server and define it on scope', function(){
        _scope.$digest();
        expect(_scope.chain).equal(CHAIN_DATA);
      });
    });
  });
});
