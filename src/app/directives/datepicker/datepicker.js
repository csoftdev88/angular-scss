/**
 * Directive built on the top of jquery data picker widget for range data selection.
 */
(function () {
  'use strict';

  angular
    .module('mobiusApp.directives.datepicker', [])
    .directive('rangeDatepicker', RangeDatePicker);

  function RangeDatePicker($window, $filter, $rootScope, $timeout, $stateParams, stateService, Settings,
                           DynamicMessages, propertyService, _, userPreferenceService, bookingService, $q) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        highlights: '=',
        inputText: '=',
        paneTitle: '=',
        selected: '=',
        barData: '=',
        notAvailableDescription: '='
      },
      link: function (scope, element, attrs, ngModelCtrl) {
        var DATE_FORMAT = 'yy-mm-dd';
        var DATES_SEPARATOR = '_';
        var CLASS_DATE_SELECTED = 'date-range-selected';
        var CLASS_RANGE_START = 'date-range-start';
        var CLASS_RANGE_END = 'date-range-end';
        var CLASS_EDIT_RANGE = 'date-range-edit';
        var CLASS_DATE_UNAVAILABLE = 'date-unavailable';
        var CLASS_DATE_PARTIALLY_AVAILABLE = 'date-partially-available';
        var singleProperty = Settings.UI.generics.singleProperty;
        var appLang = stateService.getAppLanguageCode();
        var exactDates = DynamicMessages && DynamicMessages[appLang] ? DynamicMessages[appLang].exact_dates : 'Exact Dates';
        var daysString = DynamicMessages && DynamicMessages[appLang] ? DynamicMessages[appLang].days : 'days';

        var EVENT_VIEWPORT_RESIZE = 'viewport:resize';
        var resizeUnbindHandler;

        var originalWidth = $window.innerWidth;

        var startDate, endDate;
        var rangeSelection = attrs.rangeSelection === '1';
        var forceEndDate = attrs.forceEndDate ? attrs.forceEndDate : false;

        var maxDate = null;
        if (Settings.UI.bookingWidget.searchOffset.enable) {
          if (Settings.UI.bookingWidget.searchOffset.days) {
            maxDate = Settings.UI.bookingWidget.searchOffset.days;
          } else if (Settings.UI.bookingWidget.searchOffset.maxDate) {
            maxDate = new Date(Settings.UI.bookingWidget.searchOffset.maxDate);
          }
        }

        var hasCounter = Settings.UI.bookingWidget.datePickerHasCounter;
        var counterHasDates = Settings.UI.bookingWidget.datePickerCounterIncludeDates;
        var editDateRangeInProgress = false;
        var datePickerDefaultToToday = Settings.UI.bookingWidget.datePickerDefaultToToday;

        var counterPluralizationRules;
        var isStartDateSelected;
        var counterDatesRules;

        var config = Settings.UI.datepicker;
        if (hasCounter) {
          counterPluralizationRules = scope.$eval(attrs.counterPluralization) || {};
        }
        if (counterHasDates) {
          counterDatesRules = scope.$eval(attrs.counterDates) || {};
        }

        scope.lengthOfStay = 1;
        scope.availabilityOverviewEnabled = Settings.UI.bookingWidget.availabilityOverview && Settings.UI.bookingWidget.availabilityOverview.display && ((scope.barData && scope.barData.property && scope.barData.property.code) || singleProperty);

        //stop event bubbling from that container to avoid clicks behing the datepicker
        angular.element(document).ready(function () {
          $('#ui-datepicker-div').click(function (event) {
            event.stopPropagation();
          });
        });

        /**
         * Don't hide the date picker when changing dates
         */
        function selectDateOverride(id, dateStr) {
          /*jshint validthis:true */
          var inst = this._getInst($(id)[0]);
          inst.inline = true;
          /*jshint validthis:true */
          $.datepicker._selectDateOverload(id, dateStr);
          inst.inline = false;
          this._updateDatepicker(inst);
        }

        function beforeShow() {
          // NOTE: using setHours(0) is safe for different timezones. By default
          // jquery date picker returns dates at 00 hour

          var dates = null;

          if (ngModelCtrl.$modelValue !== undefined && ngModelCtrl.$modelValue !== '') {
            // TODO: use $parsers/$formates in case when dates should be presented not
            // as a string
            if (typeof(ngModelCtrl.$modelValue) === 'string') {
              dates = ngModelCtrl.$modelValue.split(DATES_SEPARATOR);
              startDate = $window.moment(dates[0], 'YYYY MM DD').valueOf();
              endDate = dates.length === 2 ? $window.moment(dates[1], 'YYYY MM DD').valueOf() : startDate;
              var parsedDate = $.datepicker.parseDate(DATE_FORMAT, dates[0]);
              $(element).datepicker('setDate', parsedDate);
            }
          }
          if (scope.availabilityOverviewEnabled) {
            if (dates && dates.length) {
              getAvailability($window.moment(dates[0]).format('YYYY'), $window.moment(dates[0]).format('MM'));
            }
            else {
              getAvailability();
            }
          }

          if (hasCounter) {
            updateButtonPane('data-counter', getCounterText());
          }

          updateButtonPane('data-title', scope.paneTitle);
          isStartDateSelected = false;
        }

        // Multi input fields support
        element.bind('focus', function () {

          //If datepicker defaults to today's date and no dates are selected then pre-populate with today's date
          if (datePickerDefaultToToday && (ngModelCtrl.$modelValue === undefined || ngModelCtrl.$modelValue === '')) {
            var today = $window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').format('YYYY-MM-DD');
            var tomorrow = $window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').add(1, 'day').format('YYYY-MM-DD');
            var dateString = today + '_' + tomorrow;
            ngModelCtrl.$modelValue = dateString;
          }

          // For some reason extend widget factory doesnt work for datepicker
          // so I'm overriding the method directly
          if (rangeSelection) {
            // Check if function was overrided already
            if ($.datepicker._selectDateOverload === undefined) {
              $.datepicker._selectDateOverload = $.datepicker._selectDate;
            }
            // Overriding original function
            $.datepicker._selectDate = selectDateOverride;
          } else {
            if ($.datepicker._selectDateOverload !== undefined) {
              $.datepicker._selectDate = $.datepicker._selectDateOverload;
            }
          }

          bindResizeListener();

          var minDate = $window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day').format('YYYY-MM-DD');

          //NOTE: for languages to work, you must download the corresponding lang file from https://github.com/jquery/jquery-ui/tree/master/ui/i18n and include it in vendors/jquery-ui/datepicker-translations/ - then update the build.config.js accordingly
          element.datepicker($.extend({}, $.datepicker.regional[stateService.getAppLanguageCode().split('-')[0]], {
            dateFormat: DATE_FORMAT,
            showButtonPanel: hasCounter,
            maxDate: maxDate,
            numberOfMonths: stateService.isMobile() ? 1 : Settings.UI.bookingWidget.datePickerNumberOfMonths,
            showOtherMonths: true,
            selectOtherMonths: true,
            minDate: minDate,
            closeText: attrs.closeButtonText,
            showAnim: '',
            duration: 0,

            beforeShowDay: function (date) {
              var formattedDate = $window.moment(date).format('YYYY-MM-DD');
              var dayAvailability = _.find(scope.availabilityOverview, function (availability) {
                return availability.date === formattedDate;
              });

              $rootScope.$broadcast('DATE_PICKER_BEFORE_SHOW_DAY', date);

              if (dayAvailability) {
                return [
                  !isSelected(date) && dayAvailability.available,
                  getDateClass(date, dayAvailability),
                  $filter('i18nCurrency')(dayAvailability.priceFrom, $rootScope.currencyCode, undefined, true)
                ];
              }
              else {
                return [
                  !isSelected(date),
                  getDateClass(date)
                ];
              }
            },
            onChangeMonthYear: function (y, m, i) {
              $timeout(function () {
                if (scope.availabilityOverviewEnabled) {
                  getAvailability(y, m);
                }
                $rootScope.$broadcast('DATE_PICKER_MONTH_CHANGED', i);
              });
            },

            beforeShow: beforeShow,

            onClose: function (date) {
              if (!isValid()) {
                // Do not update model
                return;
              }

              if (isNaN(startDate) && !isNaN(endDate)) {
                startDate = endDate;
              }

              if (isNaN(startDate) && isNaN(endDate)) {
                date = null;
              } else if (rangeSelection) {
                // In case when selecting the range days must be different
                if (startDate === endDate) {
                  endDate = $window.moment(endDate).add(1, 'day').valueOf();
                }
                date = {
                  startDate: $.datepicker.formatDate(DATE_FORMAT, new Date(Math.min(startDate, endDate)), {}),
                  endDate: $.datepicker.formatDate(DATE_FORMAT, new Date(Math.max(startDate, endDate)), {})
                };
              }

              // Update model
              scope.$apply(function () {
                if (date) {
                  ngModelCtrl.$setViewValue(date.startDate + DATES_SEPARATOR + date.endDate);
                } else {
                  ngModelCtrl.$setViewValue('');
                }

                ngModelCtrl.$render();
              });

              if (resizeUnbindHandler) {
                resizeUnbindHandler();
                resizeUnbindHandler = null;
              }
            },

            onSelect: function (date, inst) {
              if (!rangeSelection) {
                return;
              }

              var selectedDate = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();

              if (isStartDateSelected) {
                // Selecting endDate;
                if (selectedDate > startDate) {
                  endDate = selectedDate;
                  if (Settings.UI.bookingWidget.datePickerCloseOnDatesSelected && !stateService.isMobile()) {
                    element.datepicker('hide');
                  }
                } else {
                  // Reversing the selection back
                  endDate = startDate;
                  startDate = selectedDate;
                }
              } else {
                // Selecting start/end date
                startDate = selectedDate;
                //If force end date is set to true in config, force an end date on the calendar
                endDate = forceEndDate ? $window.moment(startDate).add(1, 'day').valueOf() : startDate;
              }

              if (hasCounter) {
                updateButtonPane('data-counter', getCounterText());
              }

              updateButtonPane('data-title', scope.paneTitle);

              scope.lengthOfStay = getDaysBetween(startDate, endDate);

              if (scope.availabilityOverviewEnabled) {
                var y = inst ? inst.drawYear : null;
                var m = inst ? inst.drawMonth + 1 : null;
                getAvailability(y, m);
              }

              isStartDateSelected = !isStartDateSelected;
              if (scope.availabilityOverviewEnabled) {
                $timeout(function () {
                  if (!stateService.isMobile()) {
                    addHoverContent();
                  }
                });
              }
            }
          })).datepicker('show');
        });

        function getDaysBetween(startDate, endDate) {
          if (!startDate || !endDate) {
            return 0;
          } else {
            return Math.abs($window.moment(startDate).diff(endDate, 'days'));
          }
        }

        function setInputText() {
          var diff = getDaysBetween(startDate, endDate);
          if (diff) {
            //scope.inputText = window.moment(startDate).format('Do of MMM') + ' (' + $filter('pluralization')(diff, counterPluralizationRules) + ')';
            scope.inputText = window.moment(startDate).format(config.dateFormat) + ' - ' + window.moment(endDate).format(config.dateFormat);
          } else {
            scope.inputText = '';
          }
        }

        function updateButtonPane(attribute, value) {
          $window._.defer(function () {
            var buttonPane = $(element)
              .datepicker('widget')
              .find('.ui-datepicker-buttonpane');
            buttonPane.attr(attribute, value);
            if (Settings.UI.bookingWidget.flexibleDates && Settings.UI.bookingWidget.flexibleDates.enable && ((scope.barData && scope.barData.property && scope.barData.property.code) || singleProperty) && !buttonPane.hasClass('button-added')) {
              buttonPane.append('<span class="flexible-dates-control"><span>' + exactDates + '</span> | <span data-flexi-days="3">-/+3 ' + daysString + '</span> | <span data-flexi-days="7">-/+7 ' + daysString + '</span></span>');
              buttonPane.addClass('button-added');

              var mobiusUserPreferences = userPreferenceService.getCookie();
              var currentFlexibleDates = mobiusUserPreferences && mobiusUserPreferences.flexibleDates ? mobiusUserPreferences.flexibleDates : null;

              $rootScope.flexibleDates = currentFlexibleDates;

              if ($rootScope.flexibleDates === null) {
                $('.flexible-dates-control span').first().addClass('selected');
              }

              $('.flexible-dates-control span').each(function () {
                if ($rootScope.flexibleDates && $(this).attr('data-flexi-days') === $rootScope.flexibleDates.toString()) {
                  $('.flexible-dates-control span').removeClass('selected');
                  $(this).addClass('selected');
                }
              });


              $('.flexible-dates-control span').click(function () {
                $('.flexible-dates-control span').removeClass('selected');
                $(this).addClass('selected');

                if ($(this).attr('data-flexi-days')) {
                  $rootScope.flexibleDates = parseInt($(this).attr('data-flexi-days'));
                }
                else {
                  $rootScope.flexibleDates = null;
                }
                userPreferenceService.setCookie('flexibleDates', $rootScope.flexibleDates);
              });
            }
          });
        }

        function getCounterText() {
          //days
          var diff = getDaysBetween(startDate, endDate);

          //dates
          if(counterHasDates && diff > 0 && !stateService.isMobile()){
            var dateStr = '';
            // @note Moment changes the formatting of a date based on locale, please refer to the docs for more info
            // and switch the locale to test that the format will work for your localedateStr += counterDatesRules['0'].replace('{date}', window.moment(startDate).format(config.dateFormat));
            dateStr += counterDatesRules['0'].replace('{date}', window.moment(startDate).format(config.dateFormat)) + ' | ';
            dateStr += counterDatesRules['1'].replace('{date}', window.moment(endDate).format(config.dateFormat)) + ' | ';
            return dateStr + $filter('pluralization')(diff, counterPluralizationRules);
          }
          else{
            return $filter('pluralization')(diff, counterPluralizationRules);
          }
        }

        // Checking if date is already selected (start date only)
        // This applies only for start date selection
        function isSelected(date) {
          if (isStartDateSelected) {
            return startDate && !$window.moment(date).diff(startDate);
          } else {
            return endDate && !$window.moment(date).diff(endDate);
          }
        }

        // Check if date selection is valid
        function isValid() {
          if (startDate !== undefined && startDate === '') {
            return false;
          }

          if (rangeSelection && endDate !== undefined && endDate === '') {
            return false;
          }

          return true;
        }

        function getDateClass(date, dayAvailability) {
          var dateTime = date.getTime();

          // Classes to be appended to an element which represents the date
          var highlightClasses = '';
          var availabilityClasses = '';

          if (dayAvailability) {
            if (!dayAvailability.available) {
              availabilityClasses = ' ' + CLASS_DATE_UNAVAILABLE;
            }
            else if (!dayAvailability.fullyAvailable) {
              availabilityClasses = ' ' + CLASS_DATE_PARTIALLY_AVAILABLE;
            }
          }

          if (scope.highlights) {
            // Formating the date so we can find it in highlights object
            var formatedDate = $.datepicker.formatDate(DATE_FORMAT, date);
            if (scope.highlights[formatedDate]) {
              highlightClasses = ' ' + scope.highlights[formatedDate];
            }
          }

          if (dateTime === startDate) {
            return CLASS_RANGE_START + highlightClasses + availabilityClasses;
          } else if (dateTime === endDate) {
            return CLASS_RANGE_END + highlightClasses + availabilityClasses + (editDateRangeInProgress ? ' ' + CLASS_EDIT_RANGE : '');
          }

          return ((dateTime > Math.min(startDate, endDate) &&
          dateTime < Math.max(startDate, endDate)) ? CLASS_DATE_SELECTED + highlightClasses + availabilityClasses : highlightClasses + availabilityClasses);
        }

        var unWatchHiglights = scope.$watch('highlights', function () {
          element.datepicker('refresh');
        });

        var unWatchModelValue = scope.$watch(function () {
          return ngModelCtrl.$modelValue;
        }, function () {
          beforeShow();
          setInputText();
        });

        function addHoverContent() {
          //Add the availability description as an attribute to the calender elements
          $('.ui-datepicker-calendar tbody tr td > *').each(function () {
            var el = $(this);

            if (el.parent().attr('data-year') && el.parent().attr('data-month')) {
              var year = el.parent().attr('data-year');
              var month = parseInt(el.parent().attr('data-month')) + 1;
              var day = el.context.textContent;

              if (day.length === 1) {
                day = '0' + day;
              }

              if (month.toString().length === 1) {
                month = '0' + month;
              }

              var formattedDate = year + '-' + month + '-' + day;
              var dayAvailability = _.find(scope.availabilityOverview, function (availability) {
                return availability.date === formattedDate;
              });

              if (dayAvailability && dayAvailability.description) {
                el.attr('data-tooltip', dayAvailability.description);
              }
            }
            else if (el.parent().hasClass('ui-datepicker-unselectable') && !el.parent().hasClass('ui-datepicker-current-day') && !el.parent().hasClass('date-range-end') && !el.parent().hasClass('date-partially-available')) {
              el.attr('data-tooltip', scope.notAvailableDescription);
            }
          });
        }

        function getAvailability(y, m) {
          if (hasCounter) {
            updateButtonPane('data-counter', getCounterText());
          }
          updateButtonPane('data-title', scope.paneTitle);

          var bookingParams = {
            adults: scope.barData.adults.value,
            children: scope.barData.children.value,
            lengthOfStay: scope.lengthOfStay
          };
          if (scope.barData.rate) {
            bookingParams.productGroupId = scope.barData.rate;
          }
          if (scope.barData.promoCode) {
            bookingParams.promoCode = scope.barData.promoCode;
          }
          if (scope.barData.groupCode) {
            bookingParams.groupCode = scope.barData.groupCode;
          }
          if (scope.barData.corpCode) {
            bookingParams.corpCode = scope.barData.corpCode;
          }

          var today = $window.moment.tz(Settings.UI.bookingWidget.timezone).startOf('day');
          var loadPreviousMonth = true;

          if (!y || !m) {
            y = today.format('YYYY');
            m = today.format('MM');
          }

          var startDate = $window.moment.tz([y, m], Settings.UI.bookingWidget.timezone).add(-1, 'month');
          if (startDate.valueOf() < today.valueOf()) {
            startDate = today;
            loadPreviousMonth = false;
          }
          startDate = $window.moment.tz(new Date(startDate), Settings.UI.bookingWidget.timezone).format('YYYY-MM-DD');
          var endDate = $window.moment(startDate).endOf('month').format('YYYY-MM-DD');


          bookingParams.from = startDate;
          bookingParams.to = endDate;

          $('#ui-datepicker-div').addClass('dates-loading');

          var monthPromises = [];
          var currentMonth = getMonthAvailability(bookingParams);
          monthPromises.push(currentMonth);

          var nextMonthParams = generateMonthBookingParams(bookingParams, startDate, 1);
          var nextMonth = getMonthAvailability(nextMonthParams);
          monthPromises.push(nextMonth);

          if (loadPreviousMonth) {
            var previousMonthParams = generateMonthBookingParams(bookingParams, startDate, -1);
            var previousMonth = getMonthAvailability(previousMonthParams);
            monthPromises.push(previousMonth);
          }

          if (!stateService.isMobile()) {
            var nextNextMonthParams = generateMonthBookingParams(bookingParams, startDate, 2);
            var nextNextMonth = getMonthAvailability(nextNextMonthParams);
            monthPromises.push(nextNextMonth);
          }

          $q.all(monthPromises).then(function (allResults) {
            scope.availabilityOverview = [];
            for (var i = 0; i < allResults.length; i++) {
              scope.availabilityOverview = _.union(scope.availabilityOverview, allResults[i]);
            }
            element.datepicker('refresh');
            if (!stateService.isMobile()) {
              addHoverContent();
            }
            if (hasCounter) {
              updateButtonPane('data-counter', getCounterText());
            }
            updateButtonPane('data-title', scope.paneTitle);
            $('#ui-datepicker-div').removeClass('dates-loading');
          });
        }

        function generateMonthBookingParams(params, startDate, month) {
          var bookingParams = angular.copy(params);
          var monthStartDate = $window.moment(startDate).startOf('month').add(month, 'month');
          monthStartDate = monthStartDate.format('YYYY-MM-DD');
          var monthEndDate = $window.moment(monthStartDate).endOf('month').format('YYYY-MM-DD');

          bookingParams.from = monthStartDate;
          bookingParams.to = monthEndDate;

          return bookingParams;
        }

        function getMonthAvailability(bookingParams) {
          var propertyCode = scope.barData.property ? scope.barData.property.code : null;
          if (!propertyCode) {
            propertyCode = bookingService.getCodeFromSlug($stateParams.propertySlug);
          }
          if (!propertyCode && Settings.UI.generics.singleProperty) {
            propertyCode = Settings.UI.generics.defaultPropertyCode;
          }
          if (propertyCode) {
            return propertyService.getAvailabilityOverview(propertyCode, bookingParams);
          }
        }

        function bindResizeListener() {
          unbindResizeListener();

          resizeUnbindHandler = scope.$on(EVENT_VIEWPORT_RESIZE, function () {
            if (resizeUnbindHandler) {
              var width = $window.innerWidth;
              if (originalWidth !== width) {
                element.datepicker('hide');
              }
            }
          });
        }

        function unbindResizeListener() {
          if (resizeUnbindHandler) {
            resizeUnbindHandler();
            resizeUnbindHandler = null;
          }
        }

        scope.$on('$destroy', function () {
          unWatchHiglights();
          unWatchModelValue();
        });
      }
    };
  }

}());
