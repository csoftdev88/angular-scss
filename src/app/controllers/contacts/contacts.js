'use strict';
/*
 * This module controlls contacts page
 */
angular.module('mobius.controllers.contacts', [])

  .controller('ContactsCtrl', function($scope, $controller, chainService, Settings,
   breadcrumbsService, formsService, metaInformationService, $location, $timeout, $rootScope, scrollService, propertyService, _) {

    $timeout(function(){
      $rootScope.$broadcast('floatingBarEvent', {
        isCollapsed: true
      });
      scrollService.scrollTo('jsForm', 20);
    }, 500);

    $controller('MainCtrl', {$scope: $scope});
    breadcrumbsService.addBreadCrumb('Contact');

    $scope.subjectOptions = Settings.UI.forms.contactSubjects;
    $scope.viewSettings = Settings.UI.viewsSettings.contacts;
    $scope.hotelDetails = Settings.UI.hotelDetails;
    var formDataCopy = {
      'code': 'contact',
      'fields': {}
    };
    $scope.formData = angular.copy(formDataCopy);

    var chainCode = Settings.API.chainCode;


    // Get Map data
    if($scope.viewSettings.hasMap){
      propertyService.getAll().then(function(properties){
        propertyService.getPropertyDetails(properties[0].code).then(function(details){
          $scope.details = details;
        });
      });
    }

    //get contact information
    chainService.getChain(chainCode).then(function(chain) {
      $scope.chain = chain;

      $scope.chain.meta.microdata.og = {};
      $scope.chain.meta.microdata.og['og:url'] = $location.absUrl().split('?')[0];
      $scope.chain.meta.microdata.og['og:title'] = 'Contact: ' + $scope.chain.meta.microdata.og['og:title'];
      $scope.chain.meta.microdata.og['og:description'] = 'Contact: ' + $scope.chain.meta.microdata.og['og:description'];

      metaInformationService.setPageTitle('Contact | ' + chain.meta.pagetitle);
      metaInformationService.setMetaDescription(chain.meta.description);
      metaInformationService.setMetaKeywords(chain.meta.keywords);
      metaInformationService.setOgGraph($scope.chain.meta.microdata.og);

    });
    //get form structure and default field values
    formsService.getContactForm().then(function(response) {
      if(response) {
        $scope.formData.fields.subject = response.schema.subject.default;
      }
    });

    $scope.sendForm = function(){
      $scope.form.$submitted = true;
      if ($scope.form.$valid) {
        if (!_.isEmpty($scope.formData.fields) && _.isObject($scope.formData.fields.subject)) {
           $scope.formData.fields.subject = $scope.formData.fields.subject.value;
        }

        formsService.sendContactForm($scope.formData).then(function () {
          $scope.formData = angular.copy(formDataCopy);
          $scope.form.$setPristine();
          $scope.showErrorMsg = false;
          $scope.isSent = true;
          scrollToDetails('message-sent');
        }, function () {
          $scope.showErrorMsg = true;
        });
      }
    };

    function scrollToDetails(target) {
      $timeout(function(){
        scrollService.scrollTo(target, 20);
      }, 100);
    }

  });
