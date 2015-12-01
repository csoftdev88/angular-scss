'use strict';

describe('mobius.controllers.contacts', function() {
  describe('ContactsCtrl', function() {
    var _scope, _breadcrumbsService, _chainService, _$location, _metaInformationService,
      _formsService, _propertyService;

    var CHAIN_DATA = {
      images: [1,2],
      meta: {
        description: 'desc',
        pagetitle: 'title',
        keywords: 'kw',
        microdata: {
          og: 'og-microdata'
        }
      }
    };

    var PROPERTY_DETAILS = [{
      code: 'LBH'
    }];

    var HOTEL_DETAILS = {
      nameShort: 'Mobius hotel',
      images: [
        {
          uri: 'http://testimage',
          includeInSlider: true
        }
      ],
      long: 'testLong',
      lat: 'testLat',
      meta: {
        description: 'meta description',
        pagetitle: 'Hotel',
        keywords: 'hotel, rooms',
        microdata: {
          schemaOrg: [],
          og: []
        }
      }
    };

    var FORM_DATA = {
      schema: {
        subject: {
          default: 'default-subject'
        }
      }
    };

    beforeEach(function() {
      module('underscore');

      module('mobius.controllers.contacts', function($provide, $controllerProvider) {
        $provide.value('breadcrumbsService', {
          clear: sinon.stub().returns(this),
          addBreadCrumb: sinon.stub().returns(this)
        });

        $provide.value('chainService', {
          getChain: sinon.stub()
        });

        $provide.value('scrollService', {scrollTo: function(){}});

        $provide.value('propertyService', {
            getAll: function(){
              return {
                then: function(c){
                  c(PROPERTY_DETAILS);
                }
              };
            },
            getPropertyDetails: function(){
              return {
                then: function(c){
                  c(HOTEL_DETAILS);
                }
              };
            }
          });

        $provide.value('Settings', {
          API: {
            chainCode: 'TEST-CHAIN'
          },
          UI: {
            forms: {
              contact : 'forms/contact',
              contactSubmissions: 'forms/contact/submissions',
              contactSubjects: 'cSubjects'
            },
            viewsSettings: {
              contacts: {
                formGrid: 12,
                hasMap: true
              }
            }
          }
        });

        $provide.value('formsService', {
          getContactForm: sinon.stub(),
          sendContactForm: sinon.stub()
        });

        $provide.value('metaInformationService', {
          setMetaDescription: sinon.spy(),
          setMetaKeywords: sinon.spy(),
          setPageTitle: sinon.spy(),
          setOgGraph: sinon.spy()
        });

        $provide.value('$location', {
          absUrl: sinon.stub()
        });

        $controllerProvider.register('MainCtrl', function($scope){
          $scope._mainCtrlInherited = true;
        });
      });
    });

    beforeEach(inject(function($controller, $rootScope, $q, $location, formsService,
        breadcrumbsService, chainService, metaInformationService, propertyService) {

      _scope = $rootScope.$new();
      _breadcrumbsService = breadcrumbsService;

      _breadcrumbsService.clear.returns({
        addBreadCrumb: sinon.stub().returns(_breadcrumbsService)
      });

      _propertyService = propertyService;

      _chainService = chainService;
      _chainService.getChain.returns($q.when(CHAIN_DATA));

      _metaInformationService = metaInformationService;

      _$location = $location;
      _$location.absUrl.returns('http://testdomain/contact');

      _formsService = formsService;
      _formsService.getContactForm.returns($q.when(FORM_DATA));
      _formsService.sendContactForm.returns($.when());

      $controller('ContactsCtrl', { $scope: _scope });
    }));

    describe('when controller initialized', function() {
      it('should inherit MainCtrl', function(){
        expect(_scope._mainCtrlInherited).equal(true);
      });

      it('should add Contact breadcrumb', function(){
        expect(_breadcrumbsService.addBreadCrumb.calledOnce).equal(true);
        expect(_breadcrumbsService.addBreadCrumb.calledWith('Contact')).equal(true);
      });

      it('should download chain data from the server and define it on scope', function(){
        _scope.$digest();
        expect(_scope.chain).equal(CHAIN_DATA);
      });

      it('should define subjectOptions on scope', function(){
        expect(_scope.subjectOptions).equal('cSubjects');
      });

      it('should define formData on scope', function(){
        expect(_scope.formData).to.be.an('object');
        expect(_scope.formData.code).equal('contact');
      });
    });


    describe('sendForm', function() {
      beforeEach(function(){
        _scope.form = {
          $valid: true,
          $setPristine: sinon.spy()
        };
      });

      it('should send form to the server', function(){
        _scope.formData = {name: 'testName'};
        _scope.sendForm();
        expect(_scope.form.$submitted).equal(true);
        expect(_formsService.sendContactForm.calledOnce).equal(true);
        expect(_formsService.sendContactForm.calledWith({name: 'testName'})).equal(true);
      });

      it('should set isSent flag to true on scope once form is sumbitted', function(){
        _scope.sendForm();
        _scope.$digest();

        expect(_scope.isSent).equal(true);
      });
    });
  });
});
