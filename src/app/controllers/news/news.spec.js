'use strict';

describe('mobius.controllers.news', function() {
  describe('NewsCtrl', function() {
    var _scope, _breadcrumbsService, _$state, _contentService, _chainService, _$location;

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

    var NEWS_DATA = [
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

      module('mobius.controllers.news', function($provide, $controllerProvider) {
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
          getNews: sinon.stub()
        });

        $controllerProvider.register('MainCtrl', function($scope){
          $scope._mainCtrlInherited = true;
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, $q, $location, $state,
        breadcrumbsService, contentService, chainService) {
      _scope = $rootScope.$new();
      _breadcrumbsService = breadcrumbsService;
      _$state = $state;

      _breadcrumbsService.clear.returns({
        addBreadCrumb: sinon.stub().returns(_breadcrumbsService)
      });

      _contentService = contentService;
      _contentService.getNews.returns($q.when(NEWS_DATA));

      _chainService = chainService;
      _chainService.getChain.returns($q.when(CHAIN_DATA));

      _$location = $location;
      _$location.absUrl.returns('http://testdomain/news');

      $controller('NewsCtrl', { $scope: _scope });
    }));

    describe('when controller initialized', function() {
      it('should inherit MainCtrl', function(){
        expect(_scope._mainCtrlInherited).equal(true);
      });

      it('should add News breadcrumb', function(){
        expect(_breadcrumbsService.addBreadCrumb.calledWith('News')).equal(true);
      });

      it('should download chain data from the server and define it on scope', function(){
        _scope.$digest();
        expect(_chainService.getChain.calledOnce).equal(true);
        expect(_chainService.getChain.calledWith('TESTCHAIN')).equal(true);
      });

      it('should define news list on scope', function(){
        _scope.$digest();
        expect(_scope.newsList.length).equal(NEWS_DATA.length);
      });

      it('should sort news list by priorities', function(){
        _scope.$digest();
        expect(_scope.newsList[0].code).equal(NEWS_DATA[1].code);
        expect(_scope.newsList[1].code).equal(NEWS_DATA[0].code);
      });
    });

    describe('goToDetail', function() {
      it('should navigate to news details page', function(){
        _scope.goToDetail('TEST-CODE-5');
        expect(_$state.go.calledOnce).equal(true);
        expect(_$state.go.calledWith('news', {code: 'TEST-CODE-5'})).equal(true);
      });
    });

    describe('goToNewsList', function() {
      it('should navigate to news page without code and force state reload', function(){
        _scope.goToNewsList();
        expect(_$state.go.calledOnce).equal(true);
        expect(_$state.go.calledWith('news', {code: ''}, {reload: true})).equal(true);
      });
    });

    describe('getRelevant', function() {
      it('should return true if same news details are selected', function(){
        _scope.$digest();
        expect(_scope.getRelevant(null, 0)).equal(true);
      });

      it('should return false when viewing other news details', function(){
        _scope.$digest();
        expect(_scope.getRelevant(null, 1)).equal(false);
      });
    });

    describe('showDetail', function() {
      it('should be set to true when viewing news details and code is specifyed in a current state', function(){
        expect(_scope.showDetail).equal(true);
      });
    });
  });
});
