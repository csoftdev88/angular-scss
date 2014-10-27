'use strict';
/*
* This service gets content for application main menu
*/
angular.module('mobiusApp.services.properties', [])
.service( 'propertyService',  function(apiService) {

	function getAll(){
		return apiService.get(apiService.getFullURL('properties.all'));
	}

	var a = {
		'ID' : 42,
		'name' : 'Abbotsford',
		'code' : 'ABB',
		'externalCode' : 'ABB',
		'add1' : '32720 Simon Avenue',
		'add2' : null,
		'add3' : null,
		'city' : 'Abbotsford',
		'ZIP' : 'V2T 0B8',
		'tel1' : '604 556 7263',
		'tel2' : null,
		'fax' : '604 556 7253',
		'email' : 'reservations@client.com',
		'URI' : 'http://www.client.com/hotels/abbotsford/',
		'latitude' : 49.053213000000,
		'longitude' : -122.315465000000,
		'priceFrom' : 158.500,
		'priceTo' : 220.000,
		'starRating' : 3,
		'policyCancel' : 'SAME DAY 4PM',
		'policyCommission' : '5% Commission',
		'policyGuarantee' : 'Default Guarantee Policy',
		'policyTax' : 'PST(8%)+GST(5%)',
		'policyFamily' : 'Default Family Policy',
		'policyPet' : 'Pets Allowed ($20)',
		'policyExtraGuests' : 'Extra Guest ($10)',
		'policyCheckInOut' : '4PM-11AM',
		'policyNoShow' : 'Default No Show Policy',
		'localeCode' : 'CAN-BC',
		'chainName' : 'Client Hotels & Inns',
		'messageHeader' : 'Header (Default)',
		'messageFooter' : 'Footer (Default)',
		'desc' : 'Ideally located, this hotel is just steps away from the city center’s most popular malls, businesses and local attractions.',
		'locationCategoryName' : 'city',
		'classTypeName' : 'All suite',
		'productName' : 'Best Available Rate',
		'autoAvailabilityEmail' : false,
		'confirmationContact' : 'mobius1@client.com',
		'autoAvailabilityContact' : 'mobius2@client.com',
		'overrideContacts' : true,
		'rolloverTimeZone' : -8.0,
		'rolloverTime' : '22:00:00',
		'useChainRollover' : false,
		'excludeDistance' : null,
		'warnDistance' : null,
		'pms' : [
			{
				'pmsType' : 'maestro',
				'pmsPropertyCode' : 'mABB'
			},
			{
				'pmsType' : 'opera',
				'pmsPropertyCode' : 'oABB'
			}
		],
		'amenities' : ['24-hour coffee shop', 'Accessible parking'],
		'businessServiceTypes' : ['Audio visual equipment', 'Blackboard'],
		'guestViews' : ['City view', 'Forest view'],
		'previews' : ['http://www.images.com/default11-prev.jpg', 'http://www.images.com/default12-prev.jpg'],
		'images' : [
			{
				'URI' : 'http://www.images.com/default11.jpg',
				'width' : 250,
				'height' : 200,
				'order' : 5,
				'thumbnailURI' : 'http://www.images.com/default11-thumb.jpg',
				'thumbnailWidth' : 50,
				'thumbnailHeight' : 50
			},
			{
				'URI' : 'http://www.images.com/default12.jpg',
				'width' : 250,
				'height' : 200,
				'order' : 4,
				'thumbnailURI' : 'http://www.images.com/default12-thumb.jpg',
				'thumbnailWidth' : 50,
				'thumbnailHeight' : 50
			}
		],
		'IRI' : '/properties/property-ABB'
	},
	{
		'ID' : 43,
		'name' : 'Blue River',
		'code' : 'BLR',
		'externalCode' : 'BLR',
		'desc' : 'Inn Blue River',
		'add1' : '795 Highway 5 South',
		'add2' : null,
		'add3' : null,
		'city' : 'Blue River',
		'ZIP' : 'V0E 1J0',
		'tel1' : '250 673 8364',
		'tel2' : null,
		'fax' : '250 673 8440',
		'email' : 'reservations@client.com',
		'URI' : 'http://www.client.com/hotels/blue-river/',
		'latitude' : 52.101270000000,
		'longitude' : -119.311300000000,
		'priceFrom' : 5.000,
		'priceTo' : 50.000,
		'starRating' : 3,
		'policyCancel' : '48HR',
		'policyCommission' : '15% Commission',
		'policyGuarantee' : 'Default Guarantee Policy',
		'policyTax' : 'AHRT(2%) + PST(8%) + GST(5%)',
		'policyFamily' : 'Default Family Policy',
		'policyPet' : 'No Pets Allowed',
		'policyExtraGuests' : 'Extra Guest ($10)',
		'policyCheckInOut' : '4PM-11AM',
		'policyNoShow' : 'Default No Show Policy',
		'policyCancelShowWarning' : true,
		'policyCommissionShowWarning' : true,
		'policyGuaranteeShowWarning' : true,
		'policyTaxShowWarning' : true,
		'policyFamilyShowWarning' : true,
		'policyPetShowWarning' : true,
		'policyExtraGuestsShowWarning' : true,
		'policyCheckInOutShowWarning' : true,
		'policyNoShowShowWarning' : true,
		'localeCode' : 'CAN-BC',
		'chainName' : 'Client Hotels & Inns',
		'messageHeader' : 'Header (Default)',
		'messageFooter' : 'Footer (Default)',
		'desc' : 'The Inn Blue River is quiet, comfortable, and well-suited for an overnight stay for the busy traveler. Restaurant, sauna, kitchenette units and non-smoking rooms are available.',
		'locationCategoryName' : 'Location category not assigned',
		'classTypeName' : 'Property class not assigned',
		'productName' : 'Best Available Rate',
		'autoAvailabilityEmail' : false,
		'propretyLimit' : null,
		'usesDerivedRooms' : null,
		'tempAvailabilityExpired' : 36000,
		'confirmationContact' : 'mobius1@client.com',
		'autoAvailabilityContact' : 'mobius2@client.com',
		'overrideContacts' : true,
		'rolloverTimeZone' : -8.0,
		'rolloverTime' : '22:00:00'
		'useChainRollover' : false,
		'excludeDistance' : null,
		'warnDistance' : null,
		'pms' : null,
		'amenities' : ['Hot breakfast', 'Ice machine']
		'businessServiceTypes' : ['Internet access', 'Meeting facilities'],
		'guestViews' : ['Mountain view', 'Lake view'],
		'previews' : ['http://www.images.com/default21-prev.jpg', 'http://www.images.com/default22-prev.jpg'],
		'images' : [
		{
			'URI' : 'http://www.images.com/default21.jpg',
			'width' : 250,
			'height' : 200,
			'order' : 5,
			'thumbnailURI' : 'http://www.images.com/default21-thumb.jpg',
			'thumbnailWidth' : 50,
			'thumbnailHeight' : 50
		},
		{
			'URI' : 'http://www.images.com/default22.jpg',
			'width' : 250,
			'height' : 200,
			'order' : 4,
			'thumbnailURI' : 'http://www.images.com/default22-thumb.jpg',
			'thumbnailWidth' : 50,
			'thumbnailHeight' : 50
		}
		],
		'IRI' : '/properties/property-BLR'
	}
	];
}

  // Public methods
  return {
  	getAll: getAll
  };
});
