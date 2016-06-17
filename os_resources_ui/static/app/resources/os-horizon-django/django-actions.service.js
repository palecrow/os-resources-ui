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
    '$http',
    '$modal',
    '$q',
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
    $http,
    $modal,
    $q,
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
      var actionClassName, modal, action, method, performData, performDeferred;
      
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
            return response;
          })
        });
        return performDeferred.promise;
      }

      function displayAction(html, isRedisplay) {
        html = $.parseHTML($.trim(html));
        var formOnly = $(html[0]).find("form");
        if (!isRedisplay) {
          // Django is returning "horizon:admin:networks:addport" in the form response
          // if the form doesn't validation. Therefore, if we are redisplaying the form
          // don't use the action and method from this response.
          method = $(formOnly).attr('method');
          action = $(formOnly).attr('action');
        }
        // use .one to avoid multiple submit handlers if form is redisplayed
        $("body").one('submit', modal, onFormSubmit);
        formOnly = formOnly[0].outerHTML;
        modal = $modal.open(
          {
            template: formOnly
          }
        )
        return modal.result;
      }

      function onFormSubmit(event) {
        event.preventDefault();
        waitSpinner.showModalSpinner(gettext("Submitting"));
        var form = $(".modal-dialog").find("form");
        var formData = new FormData(form[0]);

        $http({
          headers: {'Content-Type': undefined},
          transformRequest: function (data) {
            return data;
          },
          method: method,
          url: action,
          data: formData
        }).then(onSubmitResponse, onSubmitResponseError);

        return false;
      }

      function onSubmitResponse(response) {
        waitSpinner.hideModalSpinner();
        console.log(response);
        if (response.status === 200 && response.data) {
          // Redisplay the form
          modal.dismiss();
          // Notice we do NOT resolve the promise because we are going
          // to re-display the action modal, likely due to validation
          // errors. This is the same reason we can't simply return the
          // modal.result promise earlier.
          displayAction(response.data, true);
        } else if (response.status === 302) {
          // Redirect...success?
          modal.close();
          performDeferred.resolve(onActionSuccess());
        } else {
          console.log("unexpected action response");
          modal.close();
          performDeferred.resolve(onActionSuccess());
        }
      }

      function onActionSuccess() {
        var actionResult = actionResultService.getActionResult();
        var id = performData[idAttributeName];
        actionResult.updated(type, id);
        return actionResult.result;
      }

      function onSubmitResponseError(error) {
        console.log("submit response error: " + error);
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
