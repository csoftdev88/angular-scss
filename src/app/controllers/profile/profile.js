'use strict';
/*
 * This module controlls profile page
 */
angular.module('mobius.controllers.profile', [])

  .controller('ProfileCtrl', function($scope, $controller, $state, breadcrumbsService, contentService, apiService, userObject, user){

    breadcrumbsService.addBreadCrumb('Profile');

		contentService.getTitles().then(function(data) {
			$scope.profileTitles = data;
		});

		contentService.getContactMethods().then(function(data) {
			$scope.profileContacts = data;
		});

		$controller('ISOCountriesCtrl', {$scope: $scope});

		$scope.profileData = userObject;

		$scope.update = function(form, profileData){
			form.$submitted = true;
		  if (form.$valid) {
		    apiService.put(apiService.getFullURL('customers.customer', {customerId: userObject.id}), profileData).then(function(response){
		      clearErrorMsg();
		      user.updateUser(response);
		      setErrorMsg('Thanks you, your profile has been updated', 'success');
		    }, function(){
		      //TODO: Move into locale
		      setErrorMsg('Sorry, there was an error, please try again', 'error');
		    });
		  }
		  else{
		    setErrorMsg('Please fill out all the fields indicated', 'error');
		  }
		};

		function setErrorMsg(msg, type){
			if(type === 'error'){
				$scope.errorMsg = msg;
			}
			else{
				$scope.successMsg = msg;
			}
	  }

	  function clearErrorMsg(){
	    $scope.errorMsg = null;
	    $scope.successMsg = null;
	  }

  });
