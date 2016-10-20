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

  function generateExpirationOptions(startFromMonth,startFromYear){

    $scope.cardExpiration.months = [];
    $scope.cardExpiration.years = [];

    // Generating new month list
    while (startFromMonth < 12) {
      $scope.cardExpiration.months.push({
        name: $window.moment().month(startFromMonth).format('MMMM'),
        id: startFromMonth
      });

      startFromMonth++;
    }

    //Select month is it was selected before
    if($scope.cardExpiration.selectedMonth){
      // Finding same month
      $scope.cardExpiration.selectedMonth = _.findWhere($scope.cardExpiration.months,
        {id: $scope.cardExpiration.selectedMonth.id}
      );
    }

    //create years
    var currentYear = $window.moment().year()+startFromYear;
    var extraYears = 0;
    var maxYears = 10-startFromYear;
    while(extraYears < maxYears){
      $scope.cardExpiration.years.push(currentYear+extraYears);
      extraYears++;
    }

  }

  $scope.onExpirationYearChange = function(){
    if(!$scope.cardExpiration.selectedYear || $scope.cardExpiration.selectedYear === $window.moment().year()){
      generateExpirationOptions($window.moment().month(),0);
    }else{
      generateExpirationOptions(0,0);
    }
  };

  $scope.onExpirationMonthChange = function(){
    if(!$scope.cardExpiration.selectedMonth || $scope.cardExpiration.selectedMonth.id < $window.moment().month()){
      generateExpirationOptions(0,0);
    }else{
      generateExpirationOptions(0,0);
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

  // Generating options
  generateExpirationOptions(0,0);
});
