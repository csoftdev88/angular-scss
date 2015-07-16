'use strict';

angular.module('mobiusApp.services.metaInformation', [])
  .service('metaInformationService', ['$rootScope', 'chainService', function($rootScope, chainService) {

    var defaultMetaInformation = {
      description : '',
      pagetitle: 'Welcome to The Sutton Place Hotels'
    };

    $rootScope.metaInformation = {
      description : '',
      pagetitle: 'Welcome to The Sutton Place Hotels'
    };

    chainService.getChain('SAN').then(function(data) {
      defaultMetaInformation.description = data.meta.description;
      defaultMetaInformation.pagetitle = data.meta.pagetitle;

      $rootScope.metaInformation.description = data.meta.description;
      $rootScope.metaInformation.pagetitle = data.meta.pagetitle;
    });

    return {
      reset: function() {
        $rootScope.metaInformation.description = defaultMetaInformation.description;
        $rootScope.metaInformation.pagetitle = defaultMetaInformation.pagetitle;
      },
      setMetaDescription: function(newMetaDescription) {
        $rootScope.metaInformation.description = newMetaDescription;
      },
      setPageTitle: function(newPageTitle) {
        $rootScope.metaInformation.pagetitle = newPageTitle;
      }
    };

  }]);
