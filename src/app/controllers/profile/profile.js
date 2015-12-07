'use strict';
/*
 * This module controlls profile page
 */
angular.module('mobius.controllers.profile', [])

  .controller('ProfileCtrl', function($scope, $controller, $state, breadcrumbsService, contentService, apiService, userObject, user, $timeout, _, chainService, metaInformationService, $location, Settings){

    breadcrumbsService.addBreadCrumb('Profile');

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
			$scope.profileTitles = data;
		});

		contentService.getContactMethods().then(function(data) {
			$scope.profileContacts = data;
		});

		$controller('ISOCountriesCtrl', {$scope: $scope});

		$timeout(function(){
      $scope.profileData = user.getUser();
    }, 2000);

		$scope.update = function(form, profileData){
			form.$submitted = true;
		  if(form.$valid){
				var data = _.omit(profileData, _.isNull);
				data = _.omit(data, ['id','token','email']);
				
		    apiService.put(apiService.getFullURL('customers.customer', {customerId: userObject.id}), data).then(function(){
		      clearErrorMsg();
		      userObject = _.extend(userObject, data);
		      setErrorMsg('Thank you, your profile has been updated', 'success');
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
