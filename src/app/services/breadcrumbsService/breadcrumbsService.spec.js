'use strict';

describe('breadcrumbsService', function() {
  var _$rootScope, _breadcrumbsService;

  beforeEach(function() {
    module('underscore');
    module('mobiusApp.services.breadcrumbs', function($provide) {
      $provide.value('scrollService', {});
    });
  });

  beforeEach(inject(function($rootScope, breadcrumbsService) {
    _$rootScope = $rootScope;
    _breadcrumbsService = breadcrumbsService;

  }));

  describe('clear', function() {
    it('should set showHomeBreadCrumb on rootScope to true', function() {
      _breadcrumbsService.clear();
      expect(_$rootScope.showHomeBreadCrumb).equal(true);
    });

    it('should support cascade pattern', function(){
      expect(_breadcrumbsService.clear()).equal(_breadcrumbsService);
    });
  });

  describe('getBreadCrumbs', function() {
    it('should return an empty list by default', function() {
      expect(_breadcrumbsService.getBreadCrumbs().length).equal(0);
    });

    it('should return a list of breadcumbs', function() {
      _breadcrumbsService.setBreadCrumbs([{test:123}]);
      var breadcumbs = _breadcrumbsService.getBreadCrumbs();
      expect(breadcumbs.length).equal(1);
      expect(breadcumbs[0].test).equal(123);
    });
  });

  describe('setBreadCrumbs', function() {
    it('should set breadcumbs', function() {
      _breadcrumbsService.setBreadCrumbs([{test: 123}]);
      expect(_breadcrumbsService.getBreadCrumbs()[0].test).equal(123);
    });

    it('should support cascade pattern', function(){
      expect(_breadcrumbsService.setBreadCrumbs()).equal(_breadcrumbsService);
    });
  });

  describe('addBreadCrumb', function(){
    it('should add a new breadcumb object to a list of breadcrumbs', function() {
      _breadcrumbsService.addBreadCrumb('name', 'stateName', 'stateParams', 'hash');
      var newBreadcrumb = _breadcrumbsService.getBreadCrumbs()[0];

      expect(newBreadcrumb.name).equal('name');
      expect(newBreadcrumb.state).equal('stateName');
      expect(newBreadcrumb.params).equal('stateParams');
      expect(newBreadcrumb.hash).equal('hash');
    });

    it('should support cascade pattern', function(){
      expect(_breadcrumbsService.addBreadCrumb({})).equal(_breadcrumbsService);
    });
  });

  describe('getHrefs', function(){
    it('should return a list of hrefs', function() {
      expect(_breadcrumbsService.getHrefs().length).equal(0);
      _breadcrumbsService.addHref('name', 'id');
      var newHref = _breadcrumbsService.getHrefs()[0];
      expect(newHref.id).equal('id');
      expect(newHref.name).equal('name');
    });
  });

  describe('setHrefs', function(){
    it('should set a list of hrefs', function() {
      expect(_breadcrumbsService.getHrefs().length).equal(0);
      var hrefs = [{test: 123}];

      _breadcrumbsService.setHrefs(hrefs);
      expect(_breadcrumbsService.getHrefs(hrefs));
    });

    it('should support cascade pattern', function(){
      expect(_breadcrumbsService.setHrefs({})).equal(_breadcrumbsService);
    });
  });

  describe('addHref', function(){
    it('should set add a new href', function() {
      expect(_breadcrumbsService.getHrefs().length).equal(0);
      _breadcrumbsService.addHref('name', 'id');
      var newHref = _breadcrumbsService.getHrefs()[0];
      expect(newHref.id).equal('id');
      expect(newHref.name).equal('name');
    });

    it('should support cascade pattern', function(){
      expect(_breadcrumbsService.setHrefs({})).equal(_breadcrumbsService);
    });
  });

  describe('removeHref', function(){
    it('should remove href by name', function() {
      expect(_breadcrumbsService.getHrefs().length).equal(0);
      _breadcrumbsService.addHref('name', 'id');
      expect(_breadcrumbsService.getHrefs().length).equal(1);
      _breadcrumbsService.removeHref('name');
      expect(_breadcrumbsService.getHrefs().length).equal(0);
    });
  });

  describe('addAbsHref', function(){
    it('should add absolute href', function() {
      expect(_breadcrumbsService.getAbsHrefs().length).equal(0);
      _breadcrumbsService.addAbsHref('name', 'stateName', 'stateParams');
      var newAbsHref = _breadcrumbsService.getAbsHrefs()[0];
      expect(newAbsHref.state).equal('stateName');
      expect(newAbsHref.name).equal('name');
      expect(newAbsHref.params).equal('stateParams');
    });

    it('should support cascade pattern', function(){
      expect(_breadcrumbsService.addAbsHref({})).equal(_breadcrumbsService);
    });
  });

  describe('setActiveHref', function(){
    it('should set active href', function() {
      expect(_breadcrumbsService.getActiveHref()).equal(undefined);
      _breadcrumbsService.setActiveHref({test: 123});
      expect(_breadcrumbsService.getActiveHref().test).equal(123);
    });

    it('should support cascade pattern', function(){
      expect(_breadcrumbsService.setActiveHref({})).equal(_breadcrumbsService);
    });
  });

  describe('getActiveHref', function(){
    it('should return an active href', function() {
      _breadcrumbsService.setActiveHref({test: 123});
      expect(_breadcrumbsService.getActiveHref().test).equal(123);
    });
  });

  describe('getVisibleHref', function(){
    it('should be defined as a function', function() {
      expect(_breadcrumbsService.getVisibleHref).to.be.a('function');
    });
  });
});
