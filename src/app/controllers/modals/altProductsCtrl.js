'use strict';
/*
* This a generic controller for modal dialogs
*/
angular.module('mobius.controllers.modals.altProducts', [
  'mobius.controllers.modals.generic',
  'mobius.controllers.common.sanitize'
])

.controller('AltProductsCtrl', function($scope, $modalInstance, $controller, $state, $stateParams, $window, $filter, bookingService, Settings, data, dataLayerService) {
  $controller('PriceCtr', {$scope: $scope});
  $controller('SanitizeCtrl', {$scope: $scope});
  $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

  function generateCriteriaContent(partialAvailability){
    console.log(partialAvailability.type);
    $scope.partialAvailabilityCode = partialAvailability.code;
    switch(partialAvailability.code){
      //Minimum Length of Stay, extend stay length to adhere to rules
      case 'mi':
        if(bookingDates && lengthOfStay){
          //Check if length of stay is less than min length of stay
          if(lengthOfStay < partialAvailability.variable){
            $scope.stayExtension = partialAvailability.variable - lengthOfStay;     
            bookingParams.dates = $window.moment.tz(bookingDates.from, Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD') + '_' + $window.moment.tz(bookingDates.to, Settings.UI.bookingWidget.timezone).add($scope.stayExtension, 'days').format('YYYY-MM-DD');
          }
        }     
        break;
      //Maximum Length of Stay, reduce stay length to adhere to rules
      case 'ma':
        if(bookingDates && lengthOfStay){
          //Check if length of stay is more than max length of stay
          if(lengthOfStay > partialAvailability.variable){
            $scope.stayReduction = lengthOfStay - partialAvailability.variable;     
            bookingParams.dates = $window.moment.tz(bookingDates.from, Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD') + '_' + $window.moment.tz(bookingDates.to, Settings.UI.bookingWidget.timezone).subtract($scope.stayReduction, 'days').format('YYYY-MM-DD');
          }
        }     
        break;
      //Stay allowed after (date)
      case 'dp':
        if(bookingDates && partialAvailability.date){
          allowedFromDate = $window.moment.tz(partialAvailability.date, Settings.UI.bookingWidget.timezone).add(1,'day');
          $scope.stayReduction = allowedFromDate.diff($window.moment.tz(bookingDates.from, Settings.UI.bookingWidget.timezone), 'days');
          //Set the 'from' date to the date passed to us in the partialAvailability 
          bookingParams.dates = allowedFromDate.format('YYYY-MM-DD') + '_' + $window.moment.tz(bookingDates.to, Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD');
          $scope.fromDate = allowedFromDate.format('YYYY-MM-DD');
          $scope.toDate = $window.moment.tz(bookingDates.to, Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD');
        }     
        break;
      //Stay allowed before (date)
      case 'dl':
        if(bookingDates && partialAvailability.date){
          allowedToDate = $window.moment.tz(partialAvailability.date, Settings.UI.bookingWidget.timezone).subtract(1,'day');
          $scope.stayReduction = allowedToDate.diff($window.moment.tz(bookingDates.to, Settings.UI.bookingWidget.timezone), 'days');
          //Set the 'to' date to the date passed to us in the partialAvailability 
          bookingParams.dates = $window.moment.tz(bookingDates.from, Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD') + '_' + allowedToDate.format('YYYY-MM-DD');
          $scope.fromDate = $window.moment.tz(bookingDates.from, Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD');
          $scope.toDate = allowedToDate.format('YYYY-MM-DD');
        }    
        break;
      //No Arrival on (day)
      case 'na':
        if(bookingDates && partialAvailability.day){
          var fromDate = $window.moment.tz(bookingDates.from, Settings.UI.bookingWidget.timezone);
          //mobius partialAvailability classes Sunday as 1, whereas moment.js classes Sunday as 0. So we need to add 1 to the fromDay to bring them inline.
          var fromDay = fromDate.add(1, 'days').day();
          if(partialAvailability.day.toString() === fromDay.toString()){
            //If the booking day of the week matches the no arrival day, bump the fromDate forward 1 day
            allowedFromDate = fromDate;
            bookingParams.dates = allowedFromDate.format('YYYY-MM-DD') + '_' + $window.moment.tz(bookingDates.to, Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD');
            $scope.fromDate = allowedFromDate.format('YYYY-MM-DD');
            $scope.toDate = $window.moment.tz(bookingDates.to, Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD');
          }
        }    
        break;
      //No Departure on (day)
      case 'nl':
        if(bookingDates && partialAvailability.day){
          var toDate = $window.moment.tz(bookingDates.to, Settings.UI.bookingWidget.timezone);
          //mobius partialAvailability classes Sunday as 1, whereas moment.js classes Sunday as 0. So we need to add 1 to the toDay to bring them inline.
          var toDay = toDate.add(1, 'days').day();
          if(partialAvailability.day.toString() === toDay.toString()){
            //If the booking day of the week matches the no arrival day, bump the fromDate forward 1 day
            allowedToDate = toDate;
            bookingParams.dates = $window.moment.tz(bookingDates.from, Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD') + '_' + allowedToDate.format('YYYY-MM-DD');
            $scope.fromDate = $window.moment.tz(bookingDates.from, Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD');
            $scope.toDate = allowedToDate.format('YYYY-MM-DD');
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
  var dateFrom = $window.moment.tz(bookingDates.from, Settings.UI.bookingWidget.timezone);
  var dateTo = $window.moment.tz(bookingDates.to, Settings.UI.bookingWidget.timezone);
  var lengthOfStay = bookingDates ? dateTo.diff(dateFrom, 'days') : null;
  var orderedProducts = $filter('orderBy')(data.products, 'price.totalAfterTaxAfterPricingRules');
  var lowestProductPrice = orderedProducts[0].price.totalAfterTaxAfterPricingRules;
  $scope.priceDifference = lowestProductPrice - data.product.price.totalAfterTaxAfterPricingRules;
  var allowedFromDate = null;
  var allowedToDate = null;
  var propertyCode = bookingParams && bookingParams.propertySlug ? bookingService.getCodeFromSlug(bookingParams.propertySlug) : null;
  $scope.stayExtension = null;
  $scope.stayReduction = null;

  if(data.product.partialAvailability){
    //Generate the modal title, price ribbon and button link based on the partial availability of the alternative product
    generateCriteriaContent(data.product.partialAvailability);
  }

  
  $scope.reloadPageProducts = function(){
    //Track the alternate rates interaction in the dataLayer
    dataLayerService.trackAltDisplaySelect('Rates', null, propertyCode, data.product.code, lowestProductPrice, $scope.priceDifference, lengthOfStay, dateFrom, dateTo);

    $stateParams.dates = bookingParams.dates;
    $state.reload();
    $scope.ok();
  };
});
