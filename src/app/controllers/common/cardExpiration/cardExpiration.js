'use strict';
/*
* This a controller generates credit card expiration date options
*/
angular.module('mobius.controllers.common.cardExpiration', [])

.controller( 'CardExpirationCtrl', function($scope, $window, _) {
  $scope.cardExpiration = {
    selectedMonth: null,
    selectedYear: null
  };

  function generateExpirationOptions(startFromMonth){
    $scope.cardExpiration.months = [];

    // Generating new month list
    while (startFromMonth < 12) {
      $scope.cardExpiration.months.push({
        name: $window.moment().month(startFromMonth++).format('MMMM'),
        id: startFromMonth
      });
    }
    if($scope.cardExpiration.selectedMonth){
      // Finding same month
      $scope.cardExpiration.selectedMonth = _.findWhere($scope.cardExpiration.months,
        {id: $scope.cardExpiration.selectedMonth.id}
      );
    }

    if(!$scope.cardExpiration.years){
      $scope.cardExpiration.years = [];
      var currentYear = $window.moment().year();
      var extraYears = 0;
      while(extraYears < 10){
        $scope.cardExpiration.years.push(currentYear+extraYears);
        extraYears++;
      }
    }
  }

  $scope.onExpirationYearChange = function(){
    if(!$scope.cardExpiration.selectedYear || $scope.cardExpiration.selectedYear === $window.moment().year()){
      generateExpirationOptions($window.moment().month());
    }else{
      generateExpirationOptions(0);
    }
  };

  $scope.getCardExpirationDate = function(){
    if(!$scope.cardExpiration ||
      !$scope.cardExpiration.selectedYear ||
      !$scope.cardExpiration.selectedMonth){

      return null;
    }

    // Card expires in last day of the month
    return $window.moment().year($scope.cardExpiration.selectedYear)
      .month($scope.cardExpiration.selectedMonth.id)
      .endOf('month')
      .format('YYYY-MM-DD');
  };

  // Generating options starting from the current month
  generateExpirationOptions($window.moment().month());
});
