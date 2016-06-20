/**
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use self file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function () {
  'use strict';

  angular
    .module('horizon.app.resources.os-horizon-django')
    .factory('horizon.app.resources.os-horizon-django.django-actions', djangoActions);

  djangoActions.$inject = [
    '$document',
    '$location',
    '$http',
    '$modal',
    '$rootScope',
    '$q',
    '$timeout',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.app.core.openstack-service-api.django-actions',
    'horizon.framework.util.actions.action-result.service'
  ];

  /*
   * @ngdoc factory
   * @name horizon.app.core.images.actions.create-volume.service
   *
   * @Description
   * Brings up the Create Volume modal.
   */
  function djangoActions(
    $document,
    $location,
    $http,
    $modal,
    $rootScope,
    $q,
    $timeout,
    waitSpinner,
    djangoActions,
    actionResultService)
  {

    var service = {
      getAction: getAction
    };
    
    return service;
    
    /// PRIVATE

    function getAction(name, type, idAttributeName) {
      var actionClassName, modal, action;
      var method, performData, performDeferred;
      var deregisterOnLocationChange = angular.noop;
      
      actionClassName = name;
      var service = {
        initScope: initScope,
        allowed: allowed,
        perform: perform
      };

      return service;

      function initScope(newScope) {
        console.log('DJANGO ACTION: initScope');
        return;
      }

      function allowed(data) {
        console.log('DJANGO ACTION: allowed: ' + actionClassName);
        return $q.when(true);
      }

      // TODO (tyr): block searchlight-ui polling while waiting for action completion
      // otherwise SL might get the update before we return from the action, or perhaps
      // we need to cache the id BEFORE attempting the action?
      function perform(data) {
        performData = data;
        performDeferred = $q.defer();
        console.log('DJANGO ACTION: perform: ' + actionClassName);
        waitSpinner.showModalSpinner(gettext("Loading"));
        djangoActions.perform(actionClassName, data).then(function (result) {
          console.log(result);
          return loadAction(result.data).then(function (result) {
            console.log(result.data);
            waitSpinner.hideModalSpinner();
            return displayAction(result.data);
          }, function errorCallback(response) {
            console.log(response);
            waitSpinner.hideModalSpinner();
            return performDeferred.reject(response);
          })
        });
        // TODO (tyr) Must reject this promise on modal close so that action-list will re-enable
        // clicking on other actions
        return performDeferred.promise;
      }

      function displayAction(html) {

        addModalEventListeners();

        html = $.parseHTML($.trim(html));
        $timeout(function() {
          // Must use $timeout to call modals.success OFF the angular digest cycle
          horizon.modals.success(html);
        }, 0, false);
      }

      function addModalEventListeners() {
        // Listen for location change events
        deregisterOnLocationChange = $rootScope.$on('$locationChangeStart', modalEventHandler);
        // Bind "cancel" button handler.
        $document.one('click', '.modal .cancel', modalEventHandler);
        // Bind "close" button handler
        $document.one('click', '.modal .close', modalEventHandler);
      }

      function removeModalEventListeners() {
        deregisterOnLocationChange();
        $document.off('click', '.modal .cancel', modalEventHandler);
        $document.off('click', '.modal .close', modalEventHandler);
      }

      function modalEventHandler(event) {
        // Unregister *all* listeners when we handle *any* event
        removeModalEventListeners();

        if ( event.type === '$locationChangeStart') {
          onLocationChange(event);
        } else {
          onModalCanceled(event);
        }
      }

      function onModalCanceled(event) {
        performDeferred.reject(gettext("Canceled"));
      }

      function onLocationChange(event) {
        // prevent the redirect on modal success
        event.preventDefault();

        // TOOD (tyr) Is this necessary
        if ( horizon.modals.spinner ) {
          // if horizon.modals.js doesn't redirect after an action, we must hide the spinner
          // ourselves
          horizon.modals.spinner.modal('hide');
        }

        performDeferred.resolve(onActionSuccess());
      }

      function onActionSuccess() {
        var actionResult = actionResultService.getActionResult();
        // Get the id of the item being operated upon
        var id = performData[idAttributeName];

        // TODO (tyr) Give action a way to indicate if it updates, creates or deletes an item
        actionResult.updated(type, id);
        return actionResult.result;
      }

      function loadAction(actionUrl) {
        return $http({
          method: 'GET',
          url: actionUrl
        });
      }
    }
  }
})();
