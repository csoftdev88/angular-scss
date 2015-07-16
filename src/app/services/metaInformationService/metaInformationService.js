'use strict';

angular.module('mobiusApp.services.metaInformation', [])
  .service('metaInformationService', ['$rootScope', 'chainService', function($rootScope, chainService) {

    return {
      reset: function() {
        $rootScope.metaInformation = {
          description : ''
        };
        chainService.getChain('SAN').then(function(data) {
          $rootScope.metaInformation.description = data.meta.description;
        });
      },
      setMetaDescription: function(newMetaDescription) {
        $rootScope.metaInformation.description = newMetaDescription;
      }
    };

  }]);
