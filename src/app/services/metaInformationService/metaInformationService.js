'use strict';

angular.module('mobiusApp.services.metaInformation', [])
  .service('metaInformationService', ['$rootScope', function($rootScope) {

    var defaultMetaInformation = {
      description : '',
      keywords : '',
      pagetitle: '',
      ogTitle : '',
      ogDescription : '',
      ogType : '',
      ogUrl : '',
      ogImage : '',
      ogLocale : ''
    };

    $rootScope.metaInformation = {
      description : '',
      pagetitle: ''
    };

    //Removing this for now as doesn't seem necessary
    /*
    chainService.getChain(Settings.API.chainCode).then(function(data) {
      defaultMetaInformation.description = data.meta.description;
      defaultMetaInformation.keywords = data.meta.keywords;
      defaultMetaInformation.pagetitle = data.meta.pagetitle;

      $rootScope.metaInformation.description = data.meta.description;
      $rootScope.metaInformation.keywords = data.meta.keywords;
      $rootScope.metaInformation.pagetitle = data.meta.pagetitle;
    });
    */

    return {
      reset: function() {
        $rootScope.metaInformation.description = defaultMetaInformation.description;
        $rootScope.metaInformation.keywords = defaultMetaInformation.keywords;
        $rootScope.metaInformation.pagetitle = defaultMetaInformation.pagetitle;
        $rootScope.metaInformation.ogTitle = defaultMetaInformation.ogTitle;
        $rootScope.metaInformation.ogDescription = defaultMetaInformation.ogDescription;
        $rootScope.metaInformation.ogType = defaultMetaInformation.ogType;
        $rootScope.metaInformation.ogUrl = defaultMetaInformation.ogUrl;
        $rootScope.metaInformation.ogImage = defaultMetaInformation.ogImage;
        $rootScope.metaInformation.ogLocale = defaultMetaInformation.ogLocale;
      },
      setMetaDescription: function(newMetaDescription) {
        $rootScope.metaInformation.description = newMetaDescription;
      },
      setMetaKeywords: function(newMetaKeywords) {
        $rootScope.metaInformation.keywords = newMetaKeywords;
      },
      setPageTitle: function(newPageTitle) {
        $rootScope.metaInformation.pagetitle = newPageTitle;
      },
      setOgGraph: function(data) {
        $rootScope.metaInformation.ogTitle = data['og:title'];
        $rootScope.metaInformation.ogDescription = data['og:description'];
        $rootScope.metaInformation.ogType = data['og:type'];
        $rootScope.metaInformation.ogUrl = data['og:url'];
        $rootScope.metaInformation.ogImage = data['og:image'];
        $rootScope.metaInformation.ogLocale = data['og:locale'];
      }
    };
  }]);
