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
    .factory('horizon.app.resources.os-horizon-django.actions.service', djangoActionsService);

  djangoActionsService.$inject = [
    '$http',
    '$modal',
    '$q',
    'horizon.app.core.openstack-service-api.django-actions'
  ];

  /*
   * @ngdoc factory
   * @name horizon.app.core.images.actions.create-volume.service
   *
   * @Description
   * Brings up the Create Volume modal.
   */
  function djangoActionsService($http,
                                $modal,
                                $q,
                                djangoActions) {

    var service = {
      getAction: getAction
    };
    
    return service;
    
    /// PRIVATE

    function getAction(name) {
      var actionClassName, modal, action, method;
      
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
        console.log('DJANGO ACTION: perform: ' + actionClassName);
        djangoActions.perform(actionClassName, data).then(function (result) {
          console.log(result);
          loadAction(result.data).then(function (result) {
            console.log(result.data);
            displayAction(result.data);
          }, function errorCallback(response) {
            console.log(response);
          })
        })
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
      }

      function onFormSubmit(event) {
        event.preventDefault();
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
        modal.close();
        console.log(response);
        if (response.status === 200 && response.data) {
          // Redisplay the form
          displayAction(response.data, true);
        } else if (response.status === 302) {
          // Redirect...success?
        } else {
          console.log("unexpection action response");
          modal.close();
        }
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
