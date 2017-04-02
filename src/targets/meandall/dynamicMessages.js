//Service to store translations that need to be accessed by JS (all other translations are compiled into HTML from locales)

'use strict';

angular.module('mobiusApp.dynamicMessages', [])

.constant('DynamicMessages', {
  'en':{
    'your_reservation':'<div>Your Reservation <strong>',
    'was_successfully_cancelled':'</strong> was successfully cancelled.</div>',
    'you_have_added':'<div>You have added ',
    'to_your_reservation':' to your reservation</div>',
    'you_have_added_passbook': '<div>You have successfully added your reservation to passbook.</div>',
    'sorry_could_not_add_passbook':'<div>Sorry, we could not add reservation to passbook, please try again.</div>',
    'exact_dates':'Exact Dates'
  },
  'de':{
    'your_reservation':'<div>Your Reservation <strong>',
    'was_successfully_cancelled':'</strong> was successfully cancelled.</div>',
    'you_have_added':'<div>You have added ',
    'to_your_reservation':' to your reservation</div>',
    'you_have_added_passbook': '<div>You have successfully added your reservation to passbook.</div>',
    'sorry_could_not_add_passbook':'<div>Sorry, we could not add reservation to passbook, please try again.</div>',
    'exact_dates':'Genaue Daten'
  }
});
