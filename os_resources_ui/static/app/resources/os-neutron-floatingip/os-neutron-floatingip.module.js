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
   * @name horizon.app.resources.os-neutron-floatingip
   * @description
   *
   * # horizon.app.resources.os-neutron-floatingip
   *
   * This module provides OpenStack Neutron Ports functionality
   */
  angular.module('horizon.app.resources.os-neutron-floatingip', [
    'horizon.app.resources.os-neutron-floatingip.actions'
  ])
  .constant('horizon.app.resources.os-neutron-floatingip.resourceType', 'OS::Neutron::FloatingIP')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.network',
    'horizon.app.resources.os-neutron-floatingip.basePath',
    'horizon.app.resources.os-neutron-floatingip.resourceType'
  ];

  function run(registry, network, basePath, resourceTypeName) {
    registry.getResourceType(resourceTypeName)
      .setNames(gettext('Floating IP'), gettext('Floating IPs'))
      .setSummaryTemplateUrl(basePath + '/drawer.html')
      .setProperty('id', {
        label: gettext('ID')
      })
      .setProperty('ip', {
        label: gettext('IP Address')
      })
      .setProperty('fixed_ip_address', {
        label: gettext('Mapped Fixed IP Address'),
        filters: ['noValue']
      })
      .setProperty('pool', {
        label: gettext('Pool')
      })
      .setProperty('status', {
        label: gettext('Status'),
        values: {
          'UP': gettext('Up'),
          'DOWN': gettext('Down'),
          'ERROR': gettext('Error'),
        }
      })
      .setListFunction(listFunction)
      .tableColumns
      .append({
        id: 'ip',
        priority: 1,
        sortDefault: true,
        template: '<a ng-href="{$ \'project/ngdetails/OS::Neutron::FloatingIp/\' + item.id $}">' +
          '{$ item.ip $}</a>'
      })
      .append({
        id: 'fixed_ip_address',
        priority: 1
      })
      .append({
        id: 'pool',
        priority: 1
      })
      .append({
        id: 'status',
        priority: 2
      });

    function listFunction() {
      return network.getFloatingIps();
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
    var path = $windowProvider.$get().STATIC_URL + 'app/resources/os-neutron-floatingip';
    $provide.constant('horizon.app.resources.os-neutron-floatingip.basePath', path);
  }


})();
