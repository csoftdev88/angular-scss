'use strict';

angular.module('mobiusApp.services.forms', [])
  .service( 'formsService',  function($window, $q, apiService) {

    function getContactForm (){
      return apiService.get(apiService.getFullURL('forms.contact', {}));
    }

    function sendContactForm (data) {
      return apiService.post(apiService.getFullURL('forms.contactSubmissions'), data);
    }
    // Public methods
    return {
      getContactForm: getContactForm,
      sendContactForm: sendContactForm
    };
  });
