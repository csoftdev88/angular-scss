'use strict';
/*
 * This module controlls register page
 */
angular.module('mobius.controllers.register', [])

  .controller('RegisterCtrl', function($scope, $controller, $state, breadcrumbsService, contentService, apiService, userObject, user, chainService, metaInformationService, $location, Settings){

    breadcrumbsService.addBreadCrumb('Register');

    $scope.config = Settings.UI.registerPage;

    //get meta information
    chainService.getChain(Settings.API.chainCode).then(function(chain) {
      $scope.chain = chain;

      $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      $scope.chain.meta.microdata.og['og:title'] = 'Profile: ' + $scope.chain.meta.microdata.og['og:title'];
      $scope.chain.meta.microdata.og['og:description'] = 'Profile: ' + $scope.chain.meta.microdata.og['og:description'];

      metaInformationService.setPageTitle(chain.meta.pagetitle);
      metaInformationService.setMetaDescription(chain.meta.description);
      metaInformationService.setMetaKeywords(chain.meta.keywords);
      metaInformationService.setOgGraph($scope.chain.meta.microdata.og);

    });

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
