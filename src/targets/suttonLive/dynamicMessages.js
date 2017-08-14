//Service to store translations that need to be accessed by JS (all other translations are compiled into HTML from locales)

'use strict';

angular.module('mobiusApp.dynamicMessages', [])

.constant('DynamicMessages', {
  'en-us':{
    'your_reservation':'<div>Your Reservation <strong>',
    'was_successfully_cancelled':'</strong> was successfully cancelled.</div>',
    'you_have_added':'<div>You have added ',
    'to_your_reservation':' to your reservation</div>',
    'you_have_added_passbook': '<div>You have successfully added your reservation to passbook.</div>',
    'sorry_could_not_add_passbook':'<div>Sorry, we could not add reservation to passbook, please try again.</div>',
    'exact_dates':'Exact Dates',
    'days':'days',
    'cancel':'Cancellation',
    'cancellation':'Cancellation',
    'checkinout':'Check-In-Out',
    'extraguest':'Extra Guest',
    'extraguests':'Extra Guest',
    'family':'Family',
    'guarantee':'Guarantee',
    'noshow':'No Show',
    'pet':'Pet',
    'from':'From',
    'tax':'tax',
    'promo_code_applied':'Promo code applied successfully',
    'corp_code_applied':'Corp code applied successfully',
    'group_code_applied':'Group code applied successfully',
    'promo_code': 'Promo code',
    'corp_code': 'Corp code',
    'group_code': 'Group code',
    'apply_code': 'Enter a code',
    'select_property': 'Find Your Hotel',
    'find_your_hotel': 'Find Your Hotel'
  },
  'de':{
    'your_reservation':'<div>Ihre Reservierung <strong>',
    'was_successfully_cancelled':'</strong> wurde erfolgreich storniert.</div>',
    'you_have_added':'<div>Sie haben ',
    'to_your_reservation':' zu Ihrer Reservierung hinzugefügt</div>',
    'you_have_added_passbook': '<div>Sie haben Ihre Reservierung zum Passbook erfolgreich hinzugefügt.</div>',
    'sorry_could_not_add_passbook':'<div>Entschuldigung, wir konnten keine Reservierung zum Sparbuch hinzufügen, bitte versuchen Sie es erneut.</div>',
    'exact_dates':'Genaue Daten',
    'days':'tage',
    'cancel':'Stornierung',
    'cancellation':'Stornierung',
    'checkinout':'Einchecken / Auschecken',
    'extraguest':'Extra Gast',
    'extraguests':'Extra Gasts',
    'family':'Familie',
    'guarantee':'Garantie',
    'noshow':'Keine Show',
    'pet':'Haustier',
    'from':'Von',
    'tax':'Steuer',
    'promo_code_applied':'Promo code applied successfully',
    'corp_code_applied':'Corp code applied successfully',
    'group_code_applied':'Group code applied successfully'
  }
});
