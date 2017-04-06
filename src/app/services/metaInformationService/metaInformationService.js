'use strict';

angular.module('mobiusApp.services.metaInformation', [])
  .service('metaInformationService', ['$rootScope', '$location', 'chainService', 'Settings', function ($rootScope, $location, chainService, Settings) {

    var defaultMetaInformation = {
      description: '',
      keywords: '',
      pagetitle: '',
      ogTitle: '',
      ogDescription: '',
      ogType: '',
      ogUrl: '',
      ogImage: '',
      ogLocale: ''
    };

    $rootScope.metaInformation = {
      description: '',
      pagetitle: ''
    };

    function reset() {
      $rootScope.metaInformation.description = defaultMetaInformation.description;
      $rootScope.metaInformation.keywords = defaultMetaInformation.keywords;
      $rootScope.metaInformation.pagetitle = defaultMetaInformation.pagetitle;
      $rootScope.metaInformation.ogTitle = defaultMetaInformation.ogTitle;
      $rootScope.metaInformation.ogDescription = defaultMetaInformation.ogDescription;
      $rootScope.metaInformation.ogType = defaultMetaInformation.ogType;
      $rootScope.metaInformation.ogUrl = defaultMetaInformation.ogUrl;
      $rootScope.metaInformation.ogImage = defaultMetaInformation.ogImage;
      $rootScope.metaInformation.ogLocale = defaultMetaInformation.ogLocale;
    }

    function setMetaDescription(newMetaDescription) {
      $rootScope.metaInformation.description = newMetaDescription;
    }
    
    function setMetaKeywords(newMetaKeywords) {
      $rootScope.metaInformation.keywords = newMetaKeywords;
    }

    function setPageTitle(newPageTitle) {
      $rootScope.metaInformation.pagetitle = newPageTitle;
    }

    function setOgGraph(data) {
      $rootScope.metaInformation.ogTitle = data['og:title'];
      $rootScope.metaInformation.ogDescription = data['og:description'];
      $rootScope.metaInformation.ogType = data['og:type'];
      $rootScope.metaInformation.ogUrl = data['og:url'];
      $rootScope.metaInformation.ogImage = data['og:image'];
      $rootScope.metaInformation.ogLocale = data['og:locale'];
    }

    function updateMetaData(titleSegment) {
      chainService.getChain(Settings.API.chainCode).then(function (chain) {
        var chainData = chain;
        setMetaDescription(chainData.meta.description);
        setMetaKeywords(chainData.meta.keywords);
        setPageTitle(titleSegment + chainData.meta.pagetitle);
        chainData.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
        setOgGraph(chainData.meta.microdata.og);
      });
    }

    return {
      reset: reset,
      setMetaDescription: setMetaDescription,
      setMetaKeywords: setMetaKeywords,
      setPageTitle: setPageTitle,
      setOgGraph: setOgGraph,
      updateMetaData: updateMetaData
    };

  }]);
