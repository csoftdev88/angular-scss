'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.altProducts', [
  'mobius.controllers.modals.generic',
  'mobius.controllers.common.sanitize'
])

.controller('AltProductsCtrl', function($scope, $modalInstance, $controller, $state, $stateParams, $window, $filter, bookingService, data) {
  $controller('PriceCtr', {$scope: $scope});
  $controller('SanitizeCtrl', {$scope: $scope});
  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  function generateCriteriaContent(partialAvailability){
    console.log(partialAvailability.type);
    switch(partialAvailability.code){
      //Minimum Length of Stay, extend stay length to adhere to rules
      case 'mi':
        if(bookingDates && lengthOfStay){
          //Check if length of stay is less than min length of stay
          if(lengthOfStay < partialAvailability.variable){
            $scope.stayExtension = partialAvailability.variable - lengthOfStay;     
            bookingParams.dates = $window.moment(bookingDates.from).format('YYYY-MM-DD') + '_' + $window.moment(bookingDates.to).add($scope.stayExtension, 'days').format('YYYY-MM-DD');
          }
        }     
        break;
      //Maximum Length of Stay, reduce stay length to adhere to rules
      case 'ma':
        if(bookingDates && lengthOfStay){
          //Check if length of stay is more than max length of stay
          if(lengthOfStay > partialAvailability.variable){
            $scope.stayReduction = lengthOfStay - partialAvailability.variable;     
            bookingParams.dates = $window.moment(bookingDates.from).format('YYYY-MM-DD') + '_' + $window.moment(bookingDates.to).subtract($scope.stayReduction, 'days').format('YYYY-MM-DD');
          }
        }     
        break;
      default:
        console.log('partial availability type not recognised, closing modal');
        $scope.cancel();
    }
  }

  $scope.data = data;
  var bookingParams = angular.copy($stateParams);
  var bookingDates = bookingParams.dates ? bookingService.datesFromString(bookingParams.dates) : null;
  var lengthOfStay = bookingDates ? $window.moment(bookingDates.to).diff($window.moment(bookingDates.from), 'days') : null;
  var orderedProducts = $filter('orderBy')(data.products, 'price.totalAfterTaxAfterPricingRules');
  var lowestProductPrice = orderedProducts[0].price.totalAfterTaxAfterPricingRules;
  $scope.priceDifference = lowestProductPrice - data.product.price.totalAfterTaxAfterPricingRules;
  $scope.stayExtension = null;
  $scope.stayReduction = null;

  if(data.product.partialAvailability){
    //Generate the modal title, price ribbon and button link based on the partial availability of the alternative product
    generateCriteriaContent(data.product.partialAvailability);
  }

  
  $scope.reloadPageProducts = function(){
    $stateParams.dates = bookingParams.dates;
    $state.reload();
    $scope.ok();
  };
});
