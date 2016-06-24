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
   * @name horizon.app.resources.os-neutron-nets
   * @description
   *
   * # horizon.app.resources.os-neutron-nets
   *
   * This module provides OpenStack Neutron Ports functionality
   */
  angular.module('horizon.app.resources.os-nova-hypervisors', [
  ])
  .constant('horizon.app.resources.os-nova-hypervisors.resourceType', 'OS::Nova::Hypervisor')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.nova',
    'horizon.app.resources.os-nova-hypervisors.basePath',
    'horizon.app.resources.os-nova-hypervisors.resourceType'
  ];

  function run(registry, nova, basePath, resourceTypeName) {
    registry.getResourceType(resourceTypeName)
      .setNames(gettext('Hypervisor'), gettext('Hypervisors'))
      .setSummaryTemplateUrl(basePath + '/drawer.html')
      .setProperty('id', {
        label: gettext('ID')
      })
      .setProperty('name', {
        label: gettext('Name'),
        filters: ['noValue']
      })
      .setProperty('hypervisor_hostname', {
        label: gettext('Hostname')
      })
      .setProperty('hypervisor_type', {
        label: gettext('Type')
      })
      .setProperty('vcpus', {
        label: gettext('VCPUs')
      })
      .setProperty('local_gb', {
        label: gettext('Local GB (total)'),
        filters: ['gb']
      })
      .setProperty('state', {
        label: gettext('State'),
        filters: ['title']
      })
      .setProperty('status', {
        label: gettext('Status'),
        filters: ['title']
      })
      .setListFunction(listFunction)
      .tableColumns
      .append({
        id: 'name',
        priority: 1,
        sortDefault: true,
        template: '<a ng-href="{$ \'project/ngdetails/OS::Neutron::Net/\' + item.id $}">' +
          '{$ item.hypervisor_hostname $}</a>'
      })
      .append({
        id: 'hypervisor_hostname',
        priority: 1
      })
      .append({
        id: 'hypervisor_type',
        priority: 1
      })
      .append({
        id: 'vcpus',
        priority: 1
      })
      .append({
        id: 'local_gb',
        priority: 1
      })
      .append({
        id: 'state',
        priority: 1
      })
      .append({
        id: 'status',
        priority: 1
      });

    function listFunction() {
      // TODO: return nova.get();
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
    var path = $windowProvider.$get().STATIC_URL + 'app/resources/os-nova-hypervisors';
    $provide.constant('horizon.app.resources.os-nova-hypervisors.basePath', path);
  }


})();
