//Service to store translations that need to be accessed by JS (all other translations are compiled into HTML from locales)

// FIXME: why reinvent the wheel?? Use a proper i18n library instead, ng-translate works well for example

'use strict';

angular.module('mobiusApp.dynamicMessages', [])

  .constant('DynamicMessages', {
    'en-us': {
      'your_reservation': '<div>Your Reservation <strong>',
      'was_successfully_cancelled': '</strong> was successfully cancelled.</div>',
      'you_have_added': '<div>You have added ',
      'to_your_reservation': ' to your reservation</div>',
      'you_have_added_passbook': '<div>You have successfully added your reservation to passbook.</div>',
      'sorry_could_not_add_passbook': '<div>Sorry, we could not add reservation to passbook, please try again.</div>',
      'exact_dates': 'Exact Dates',
      'days': 'days',
      'cancel': 'Cancellation',
      'cancellation': 'Cancellation',
      'checkinout': 'Check-In-Out',
      'extraguest': 'Extra Guest',
      'extraguests': 'Extra Guest',
      'family': 'Family',
      'guarantee': 'Guarantee',
      'noshow': 'No Show',
      'pet': 'Pet',
      'from': 'From',
      'tax': 'tax',
      'no_adults': 'No adults',
      'adult': 'Adult',
      'adults': 'Adults',
      'no_children': 'No children',
      'child': 'Child',
      'children': 'Children',
      'apply_code': 'Enter a code',
      'select_property': 'Find Your Hotel',
      'promo_code_applied':'Promo code applied successfully',
      'corp_code_applied':'Corp code applied successfully',
      'group_code_applied':'Group code applied successfully',
      'enter_valid_choice': 'Please provide a valid option',
      'answer_the_question': 'Answer the following question to earn XX points',

      // Excelsior register form validation errors
      'invalid_email_message': 'Please enter a valid email address',
      'email_match_error_message': 'The emails do not match',
      'password_pattern_error': 'The password must contain at least 8 characters',
      'password_match_error_message': 'The passwords do not match',
      'missing_title': 'Please select your title',
      'missing_fname': 'Please enter your first name',
      'missing_lname': 'Please enter your last name',
      'missing_country': 'Please select your country',
      'corp_code': 'Corporate Code',
      'group_code': 'Group Code',
      'promo_code': 'Promo Code',
      'room': 'Room',

      'password': 'Password',
      'confirm_password': 'Confirm Password',
      'optional': 'Optional'
    },
    // NOTE: Excelsior is English only currently
    'de': {
      'your_reservation': '<div>Ihre Reservierung <strong>',
      'was_successfully_cancelled': '</strong> wurde erfolgreich storniert.</div>',
      'you_have_added': '<div>Sie haben ',
      'to_your_reservation': ' zu Ihrer Reservierung hinzugefügt</div>',
      'you_have_added_passbook': '<div>Sie haben Ihre Reservierung zum Passbook erfolgreich hinzugefügt.</div>',
      'sorry_could_not_add_passbook': '<div>Entschuldigung, wir konnten keine Reservierung zum Sparbuch hinzufügen, bitte versuchen Sie es erneut.</div>',
      'exact_dates': 'Genaue Daten',
      'days': 'tage',
      'cancel': 'Stornierung',
      'cancellation': 'Stornierung',
      'checkinout': 'Einchecken / Auschecken',
      'extraguest': 'Extra Gast',
      'extraguests': 'Extra Gasts',
      'family': 'Familie',
      'guarantee': 'Garantie',
      'noshow': 'Keine Show',
      'pet': 'Haustier',
      'from': 'Von',
      'tax': 'Steuer',
      'promo_code_applied':'Promo code applied successfully',
      'corp_code_applied':'Corp code applied successfully',
      'group_code_applied':'Group code applied successfully'
    },
    // NOTE: Excelsior is English only currently
    'fr': {
      'your_reservation': '<div>Votre réservation <strong>',
      'was_successfully_cancelled': '</strong> a été annulée avec succès.</div>',
      'you_have_added': '<div>Vous avez ajouté ',
      'to_your_reservation': ' pour votre réservation</div>',
      'you_have_added_passbook': '<div>Vous avez bien ajouté votre réservation au livret.</div>',
      'sorry_could_not_add_passbook': '<div>Désolé, impossible de rajouter la réservation au livret, veuillez réessayer.</div>',
      'exact_dates': 'Dates exactes',
      'days': 'jours',
      'cancel': 'Annuler',
      'cancellation': 'Annulation',
      'checkinout': 'Arrivée - Départ',
      'extraguest': 'Client supplémentaire',
      'extraguests': 'Clients supplémentaires',
      'noshow': 'Non présentation',
      'guarantee': 'Garantie',
      'family': 'Famille',
      'pet': 'Animal',
      'from': 'De',
      'tax': 'Taxes',
      'promo_code_applied':'Promo code applied successfully',
      'corp_code_applied':'Corp code applied successfully',
      'group_code_applied':'Group code applied successfully',
      'enter_valid_choice': 'Please provide a valid option',
      'answer_the_question': 'Answer the following question to earn XX points'
    }
  });
