/*
 *    (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
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
(function () {
  'use strict';

  /* eslint-disable max-len */
  /**
   * @ngdoc overview
   * @name horizon.app.resources.os-neutron-subnets
   * @description
   *
   * # horizon.app.resources.os-neutron-subnets
   *
   * This module provides OpenStack Neutron Ports functionality
   */
  angular.module('horizon.app.resources.os-neutron-subnets', [
    'horizon.app.resources.os-neutron-subnets.actions'
  ])
  .constant('horizon.app.resources.os-neutron-subnets.resourceType', 'OS::Neutron::Subnet')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.neutron',
    'horizon.app.resources.os-neutron-subnets.basePath',
    'horizon.app.resources.os-neutron-subnets.resourceType'
  ];

  function run(registry, neutron, basePath, resourceTypeName) {
    registry.getResourceType(resourceTypeName)
      .setNames(gettext('Subnet'), gettext('Subnets'))
      .setSummaryTemplateUrl(basePath + '/drawer.html')
      .setProperty('id', {
        label: gettext('ID')
      })
      .setProperty('name', {
        label: gettext('Name')
      })
      .setProperty('network_address', {
        label: gettext('Network Address')
      })
      .setProperty('ip_version', {
        label: gettext('IP Version')
      })
      .setProperty('gateway_ip', {
        label: gettext('Gateway IP')
      })
      .setListFunction(listFunction)
      .tableColumns
      .append({
        id: 'name',
        priority: 1,
        sortDefault: true,
        template: '<a ng-href="{$ \'project/ngdetails/OS::Neutron::Subnet/\' + item.id $}">' +
          '{$ item.name $}</a>'
      })
      .append({
        id: 'network_address',
        priority: 1
      })
      .append({
        id: 'ip_version',
        priority: 1
      })
      .append({
        id: 'gateway_ip',
        priority: 2
      });

    function listFunction() {
      return neutron.getSubnets();
    }
  }

  config.$inject = [
    '$provide',
    '$windowProvider'
  ];

  /**
   * @name config
   * @param {Object} $provide
   * @param {Object} $windowProvider
   * @description Routes used by this module.
   * @returns {undefined} Returns nothing
   */
  function config($provide, $windowProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'app/resources/os-neutron-subnets';
    $provide.constant('horizon.app.resources.os-neutron-subnets.basePath', path);
  }


})();
