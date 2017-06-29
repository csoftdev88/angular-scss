/*
 * This a generic controller for modal dialogs
 */
(function () {
  'use strict';

  angular
    .module('mobius.controllers.modals.previousSearches', [
      'mobius.controllers.modals.generic',
      'mobius.controllers.common.sanitize'
    ])
    .controller('PreviousSearchesCtrl', PreviousSearches);

  function PreviousSearches($scope, $modalInstance, $controller, previousSearchesService, data, $state, $window,
                            _, removeSearch) {

    $controller('SanitizeCtrl', {$scope: $scope});
    $controller('ModalCtrl', {$scope: $scope, $modalInstance: $modalInstance});

    function generateSearchViewData() {
      _.each(data.searches, function(search){
        search.name = search.n;
        //Generate the date string
        if(search.params && search.params.dates){
          var datesArray = search.params.dates.split('_');
          if(datesArray.length){
            var fromMoment = $window.moment(datesArray[0]);
            var toMoment = $window.moment(datesArray[1]);
            var fromDate = '';
            var toDate = '';

            //If the month and year are the same for both dates, only display the month and year once
            if(fromMoment.month() === toMoment.month() && fromMoment.year() === toMoment.year()) {
              fromDate = fromMoment.format('Do');
              toDate = toMoment.format('Do MMM YYYY');
              search.dates = fromDate + ' - ' + toDate;
            }
            //If both are different display the entire dates
            else {
              fromDate = fromMoment.format('Do MMM YYYY');
              toDate = toMoment.format('Do MMM YYYY');
              search.dates = fromDate + ' - ' + toDate;
            }
          }
        }

        ///Generate the search url
        search.url = $state.href(search.s, search.params, {reload: true});
        search.display = true;
      });
    }

    //Generate the view data for each search
    generateSearchViewData();

    $scope.data = data;

    $scope.viewSearch = function(search) {
      previousSearchesService.getSearchUrlParams(search)
        .then(function(params) {
          search.params = params;
          $scope.cancel();
          //Go to this search URL
          $state.go(search.s, search.params, {reload: true});
        })
        .catch(function(err) {
          $log.error(err);
        });
    };

    $scope.removeSearch = function(searchToRemove) {
      //Hide search from modal
      searchToRemove.display = false;

      //Remove this search from the cookie
      removeSearch(searchToRemove);

      //Collect all visible searches
      var visibleSearches = _.reject($scope.data.searches, function(search) {
        return search.display === false;
      });

      //If no searches left, hide the modal
      if(!visibleSearches.length) {
        $scope.cancel();
      }
    };
  }

}());
