'use strict';

/**
 * Directive to encapsulate the methods of contacting the tenant
 */
(function() {
  angular
    .module('mobiusApp.directives.lbe.contactList', [])
    .directive('contactList', ['Settings', '$log', 'propertyService', 'bookingService', ContactList]);

  function ContactList(Settings, $log, propertyService, bookingService) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'directives/lbe/contactList/contactList.html',
      transclude: true,
      link: function (scope) {
        var config = Settings.UI.contactList;
        if (!config) {
          $log.warn('No config for the contact list was provided!');
        }

        scope.address = {
          name: '',
          line1: '',
          line2: '',
          line3: '',
          phone: ''
        };

        scope.contact = {
          phone: '',
          email: ''
        };

        scope.other = {
          phone: config.tel3 // @todo Content admin does not support 3 phone numbers so for now this is a config
        };

        function mapPropertyToContactDetails(property) {
          scope.address.name = property.nameShort;
          scope.address.line1 = property.address1;
          scope.address.line2 = property.address2;
          scope.address.line3 = property.address3;
          scope.address.phone = property.tel1;
          scope.contact.phone = property.tel2;
          scope.contact.email = property.email;
        }

        var propertySlug = bookingService.getParams().propertySlug;
        var propertyCode = bookingService.getCodeFromSlug(propertySlug);

        propertyService.getPropertyDetails(propertyCode)
          .then(mapPropertyToContactDetails)
          .catch($log.warn);
      }
    };
  }
}());
