'use strict';
/*
 * This module controlls register page
 */
angular.module('mobius.controllers.resetPassword', [])

  .controller('ResetPasswordCtrl', function($scope, $location, breadcrumbsService, apiService){

    breadcrumbsService.addBreadCrumb('Reset Password');

		$scope.reset = function(form, resetData){
			$scope.error = false;
		  $scope.formError = false;
			form.$submitted = true;
		  if(form.$valid){
				var data = {
					'token': $location.search().code,
					'password': resetData.password
				};
		    apiService.post(apiService.getFullURL('customers.changePassword'), data).then(function(){
		      $scope.success = true;
		    }, function(err){
					$scope.errorCode = err.error.reason;
					$scope.error = true;
		    });
		  }
		  else{
				$scope.error = true;
				$scope.formError = true;
		  }
		};
		 
  });
