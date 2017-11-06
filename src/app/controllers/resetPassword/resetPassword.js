'use strict';
/*
 * This module controlls register page
 */
angular.module('mobius.controllers.resetPassword', [])

  .controller('ResetPasswordCtrl', function($scope, $stateParams, breadcrumbsService, apiService){

    breadcrumbsService.addBreadCrumb('Reset Password');

		$scope.reset = function(form, resetData){
			$scope.error = false;
		  $scope.formError = false;
			form.$submitted = true;
		  if(form.$valid){
		  	var token = ($stateParams.resetcode) ? $stateParams.resetcode : $stateParams.key;
				var data = {
					'token': token,
					'password': resetData.password
				};
		    apiService.post(apiService.getFullURL('customers.changePassword'), data).then(function(){
		      $scope.success = true;
		    }, function(err){
					$scope.errorCode = err && err.error.reason ? err.error.reason : 0;
					$scope.error = true;
		    });
		  }
		  else{
				$scope.error = true;
				$scope.formError = true;
		  }
		};

  });
