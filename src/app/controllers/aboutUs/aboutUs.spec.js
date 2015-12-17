'use strict';

describe('mobius.controllers.about', function() {
  describe('AboutUsCtrl', function() {
    var _scope, _breadcrumbsService, _$state, _contentService, _chainService, _$location,
      _modalService;

    var CHAIN_DATA = {
      images: [1,2],
      meta: {
        description: 'desc',
        pagetitle: 'title',
        keywords: 'kw',
        microdata: {
          og: 'og-microdata'
        }
      }
    };

    var ABOUT_DATA = [
      {
        code: 'TEST-CODE',
        prio: 5,
        meta: {
          description: 'desc',
          microdata: {
            og: 'og-microdata'
          }
        }
      },
      {
        code: 'TEST-CODE-1',
        prio: 10,
        meta: {
          description: 'desc',
          microdata: {
            og: 'og-microdata'
          }
        }
      }
    ];

    beforeEach(function() {
      module('underscore');

      module('mobius.controllers.about', function($provide, $controllerProvider) {
        $provide.value('breadcrumbsService', {
          clear: sinon.stub().returns(this),
          addBreadCrumb: sinon.stub().returns(this)
        });

        $provide.value('scrollService', {
          scrollTo: sinon.spy()
        });

        $provide.value('chainService', {
          getChain: sinon.stub()
        });

        $provide.value('$state', {
          go: sinon.spy()
        });

        $provide.value('$stateParams', {
          code: 'TEST-CODE'
        });

        $provide.value('Settings', {
          API: {
            chainCode: 'TESTCHAIN'
          }
        });

        $provide.value('modalService', {
          openGallery: sinon.spy()
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
          getCodeFromSlug: function(s){return s;}
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

    beforeEach(inject(function($controller, $rootScope, $q, $location, $state,
        breadcrumbsService, contentService, chainService, modalService) {
      _scope = $rootScope.$new();
      _breadcrumbsService = breadcrumbsService;
      _$state = $state;

      _breadcrumbsService.clear.returns({
        addBreadCrumb: sinon.stub().returns(_breadcrumbsService)
      });

      _contentService = contentService;
      _contentService.getAbout.returns($q.when(ABOUT_DATA));

      _chainService = chainService;
      _chainService.getChain.returns($q.when(CHAIN_DATA));

      _$location = $location;
      _modalService = modalService;
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

      it('should define about list on scope', function(){
        _scope.$digest();
        expect(_scope.aboutList.length).equal(ABOUT_DATA.length);
      });

      it('should sort about list by priorities', function(){
        _scope.$digest();
        expect(_scope.aboutList[0].code).equal(ABOUT_DATA[1].code);
        expect(_scope.aboutList[1].code).equal(ABOUT_DATA[0].code);
      });
    });

    describe('goToDetail', function() {
      it('should navigate to about details page', function(){
        _scope.goToDetail('TEST-CODE-5');
        expect(_$state.go.calledOnce).equal(true);
        expect(_$state.go.calledWith('aboutUs', {code: 'TEST-CODE-5'})).equal(true);
      });
    });

    describe('goToAboutList', function() {
      it('should navigate to about us page without code and force state reload', function(){
        _scope.goToAboutList();
        expect(_$state.go.calledOnce).equal(true);
        expect(_$state.go.calledWith('aboutUs', {code: ''}, {reload: true})).equal(true);
      });
    });

    describe('getRelevant', function() {
      it('should return true if same about details are selected', function(){
        _scope.$digest();
        expect(_scope.getRelevant(null, 0)).equal(true);
      });

      it('should return false when viewing other about details', function(){
        _scope.$digest();
        expect(_scope.getRelevant(null, 1)).equal(false);
      });
    });

    describe('showDetail', function() {
      it('should be set to true when viewing about details and code is specifyed in a current state', function(){
        expect(_scope.showDetail).equal(true);
      });
    });

    describe('openGallery', function() {
      it('should define openGallery on scope when chain data is downloaded from the server', function(){
        expect(_scope.openGallery).equal(undefined);
        _scope.$digest();
        expect(_scope.openGallery).to.be.a('function');
      });

      it('should convert chain images into lightbox format and invoke openGallery method on modalService', function(){
        _scope.$digest();
        _scope.openGallery();
        expect(_modalService.openGallery.calledOnce).equal(true);
      });
    });
  });
});
