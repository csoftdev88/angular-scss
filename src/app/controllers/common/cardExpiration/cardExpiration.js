'use strict';
/*
* This a controller generates credit card expiration date options
*/
angular.module('mobius.controllers.common.cardExpiration', [])

.controller( 'CardExpirationCtrl', function($scope, $window) {
  function generateExpirationOptions(startFromMonth){
    if(!$scope.cardExpiration){
      $scope.cardExpiration = {
        selectedMonth: null,
        selectedYear: null
      };
    }

    $scope.cardExpiration.months = [];

    while (startFromMonth < 12) {
      $scope.cardExpiration.months.push({
        name: $window.moment().month(startFromMonth++).format('MMMM'),
        id: startFromMonth
      });
    }

    if(!$scope.cardExpiration.years){
      $scope.cardExpiration.years = [];
      var currentYear = $window.moment().year();
      var extraYears = 0;
      while(extraYears<10){
        $scope.cardExpiration.years.push(currentYear+extraYears);
        extraYears++;
      }
    }
  }

  $scope.onExpirationChange = function(){
    if(!$scope.cardExpiration.selectedYear || $scope.cardExpiration.selectedYear === $window.moment().year()){
      generateExpirationOptions($window.moment().month());
    }else{
      generateExpirationOptions(0);
    }
  };

  // Generating options starting from the current month
  generateExpirationOptions($window.moment().month());
});
