'use strict';

angular.module('mobiusApp.directives.reservation.details', [])

.directive('reservationDetails', function($controller, stateService, Settings, $window, $location){
  return {
    restrict: 'E',
    scope: {
      reservation: '=',
      property: '=',
      currencyCode: '='
    },
    templateUrl: 'directives/reservationData/details/reservationDetails.html',

    // Widget logic goes here
    link: function(scope){
      $controller('ReservationDirectiveCtrl', {$scope: scope});
      scope.config = Settings.UI.reservations;
      scope.shareConfig = Settings.UI.shareLinks;
      scope.viewSettings = Settings.UI.viewsSettings.reservationsOverview;
      scope.isMobile = stateService.isMobile();
      scope.printPage = function() {
        $window.print();
      };
      scope.$watch('property', function(property){
        if(property){
          $controller('ConfirmationNumberCtrl', {$scope: scope, propertyCode: scope.property.code});

           // just for beacon hotel -- start
           scope.shareURL = $location.protocol() + '://' + $location.host() + '/hotels/' + property.meta.slug;
           scope.facebookShare = {
             url: scope.shareURL,
             name: property.meta.microdata.og['og:description'],
             image: property.meta.microdata.og['og:image']
           };
           // just for beacon hotel -- end
        }
      }, false);
    }
  };
});
