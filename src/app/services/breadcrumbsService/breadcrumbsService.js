'use strict';

angular.module('mobiusApp.services.breadcrumbs', [])
  .service('breadcrumbsService', function(_, $rootScope,
      scrollService) {

    var breadcrumbs = [];
    var hrefs = [];
    var absHrefs = [];
    var activeHref;
    var isPropertyPage = false;
    var isRoomPage = false;
    var title = '';

    function clear() {
      breadcrumbs = [];
      hrefs = [];
      absHrefs = [];
      $rootScope.showHomeBreadCrumb = true;
      return object;
    }

    function getBreadCrumbs() {
      return breadcrumbs;
    }

    function setBreadCrumbs(newBreadcrumbs) {
      breadcrumbs = newBreadcrumbs;
      return object;
    }

    function addBreadCrumb(name, stateName, stateParams, hash) {
      breadcrumbs.push({
        state: stateName,
        params: stateParams,
        name: name,
        hash: hash
      });
      return object;
    }

    function getHrefs() {
      return hrefs;
    }

    function setHrefs(newHrefs) {
      hrefs = newHrefs;
      return object;
    }

    function addHref(name, href) {
      hrefs.push({
        id: href,
        name: name
      });
      return object;
    }

    function getAbsHrefs() {
      return absHrefs;
    }

    function addAbsHref(name, stateName, stateParams) {
      absHrefs.push({
        state: stateName,
        params: stateParams,
        name: name
      });
      return object;
    }

    function removeHref(name) {
      var indexOfRemovedElement = _.findIndex(hrefs, {name: name});
      if(indexOfRemovedElement >= 0) {
        hrefs.splice(indexOfRemovedElement, 1);
      }
    }

    // TODO: This seems to be redundant
    function setActiveHref(href) {
      activeHref = href;
      return object;
    }

    function getActiveHref() {
      return activeHref;
    }

    // Return visible href in viewport
    function getVisibleHref(){
      if(hrefs && hrefs.length){
        // Getting positions
        var hrefAreas = _.compact(hrefs.map(function(href){
          var top = getHrefPosition(href);
          // NOTE - interested only real poritive positions
          if(top){
            return {
              href: href,
              top: top
            };
          }else{
            return null;
          }
        }));

        // Sorting by positions
        hrefAreas = _.sortBy(hrefAreas, function(area){
          return area.top;
        });

        if(hrefAreas.length){
          var scrollTop = scrollService.getScrollTop();
          for(var i = hrefAreas.length-1; i >=0; i--){
            var area = hrefAreas[i];
            // NOTE: Set highlight accuracy here
            if(area.top - scrollService.getHeaderHeight(true) < scrollTop){
              return area.href;
            }
          }

          // NOTE: Returning first href
          return hrefAreas[0].href;
        }
      }

      return null;
    }

    function getHrefPosition(href){
      var hrefElement = angular.element('#' + href.id);
      if(hrefElement.length){
        return hrefElement.offset().top;
      }

      return 0;
    }

    //isProperty getter/setter
    function isProperty(bool){
      if(bool){
        isPropertyPage = bool;
      }
      else{
        return isPropertyPage;
      }
    }

    //isRoom getter/setter
    function isRoom(bool){
      if(bool){
        isRoomPage = bool;
      }
      else{
        return isRoomPage;
      }
    }

    function setHeader(val){
      title = val;
    }

    function getHeader(){
      return title;
    }

    // Public methods
    var object = {
      clear: clear,
      getBreadCrumbs: getBreadCrumbs,
      setBreadCrumbs: setBreadCrumbs,
      addBreadCrumb: addBreadCrumb,
      getHrefs: getHrefs,
      setHrefs: setHrefs,
      addHref: addHref,
      addAbsHref: addAbsHref,
      getAbsHrefs: getAbsHrefs,
      removeHref: removeHref,
      setActiveHref: setActiveHref,
      getActiveHref: getActiveHref,
      getVisibleHref: getVisibleHref,
      isProperty: isProperty,
      isRoom: isRoom,
      setHeader: setHeader,
      getHeader: getHeader
    };

    return object;
  })
;
