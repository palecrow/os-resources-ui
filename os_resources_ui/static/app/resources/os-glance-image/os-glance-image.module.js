/*
 * (c) Copyright 2016 Hewlett Packard Enterprise Development Company LP
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  "use strict";

  angular.module('horizon.app.resources.os-glance-image', [])
    .run(run);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.glance',
    'horizon.app.core.images.basePath',
    'horizon.app.core.images.resourceType'
  ];

  function run(registry, glanceApi, basePath, resourceType) {
    registry.getResourceType(resourceType)
      .setNames(gettext('Image'), gettext('Images'))
      .setSummaryTemplateUrl(basePath + 'details/drawer.html')
      .setProperty('type', {
        label: gettext('Type')
      })
      .setListFunction(listFunction)
      .tableColumns
      .append({
        id: 'name',
        priority: 1,
        sortDefault: true,
        template: '<a ng-href="{$ \'project/ngdetails/OS::Glance::Image/\' + item.id $}">' +
          '{$ item.name $}</a>'
      })
      .append({
        id: 'type',
        priority: 1,
        filters: ['imageType']
      })
      .append({
        id: 'status',
        priority: 1,
        filters: ['imageStatus']
      })
      .append({
        id: 'protected',
        priority: 1,
        filters: ['yesno']
      })
      .append({
        id: 'disk_format',
        priority: 2,
        filters: ['noValue', 'uppercase']
      })
      .append({
        id: 'size',
        priority: 2,
        filters: ['bytes']
      });

    function listFunction() {
<<<<<<< Updated upstream
      return glance.getImages();
=======
      return glanceApi.getImages();
>>>>>>> Stashed changes
    }
  }

})();
