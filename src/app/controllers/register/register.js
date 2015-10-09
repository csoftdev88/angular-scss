'use strict';
/*
 * This module controlls register page
 */
angular.module('mobius.controllers.register', [])

  .controller('RegisterCtrl', function($scope, $controller, $state, breadcrumbsService, contentService, apiService, userObject, user){

    breadcrumbsService.addBreadCrumb('Register');

		contentService.getTitles().then(function(data) {
			$scope.registerTitles = data;
		});

		contentService.getContactMethods().then(function(data) {
			$scope.registerContacts = data;
		});

		$scope.register = function(form, registerData){
			form.$submitted = true;
		  if (form.$valid) {
		    apiService.post(apiService.getFullURL('customers.register'), registerData).then(function(response){
		      clearErrorMsg();
		      userObject.id = response.id;
		      user.loadProfile();
		      $state.go('home');
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
