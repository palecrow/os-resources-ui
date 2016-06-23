/**
 * (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
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

(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @ngname horizon.app.core.instances
   *
   * @description
   * Provides all of the services and widgets required
   * to support and display instances related content.
   */
  angular
    .module('horizon.app.core.instances', ['ngRoute',
     'horizon.app.core.instances.actions', 'horizon.app.core.instances.details'])
    .constant('horizon.app.core.instances.resourceType', 'OS::Nova::Server')
    .config(config)
    .run(run);

  config.$inject = [
    '$provide',
    '$windowProvider',
    '$routeProvider'
  ];

  function config($provide, $windowProvider, $routeProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'app/core/instances/';
    $provide.constant('horizon.app.core.instances.basePath', path);

    var template = '<hz-resource-panel resource-type-name="OS::Nova::Server">' +
      '<hz-resource-table resource-type-name="OS::Nova::Server">' +
      '</hz-resource-table></hz-resource-panel>';

    $routeProvider.when('/project/nginstances/', {
      template: template
    });
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.nova',
    'horizon.app.core.instances.basePath',
    'horizon.app.core.instances.resourceType'
  ];

  function run(registry, nova, basePath, instanceResourceType) {
    registry.getResourceType(instanceResourceType)
      .setNames(gettext('Instance'), gettext('Instances'))
      .setSummaryTemplateUrl(basePath + 'drawer.html')
      .setListFunction(listFunction)
      .setProperty('name', {
        label: gettext('Name')
      })
      .setProperty('created', {
        label: gettext('Created')
      })
      .setProperty('image_name', {
        label: gettext('Image Name'),
        filters: ['noValue']
      })
      .setProperty('key_name', {
        label: gettext('Key Pair Name'),
        filters: ['noValue']
      })
      .setProperty('flavor_name', {
        label: gettext('Flavor Name'),
        filters: ['noValue']
      })
      .setProperty('status', {
        label: gettext('Status'),
        values: {
          'DELETED': gettext('Deleted'),
          'ACTIVE': gettext('Active'),
          'SHUTOFF': gettext('Shutoff'),
          'SUSPENDED': gettext('Suspended'),
          'PAUSED':	gettext('Paused'),
          'ERROR': gettext('Error'),
          'RESIZE': gettext('Resize/Migrate'),
          'VERIFY_RESIZE': gettext('Confirm or Revert Resize/Migrate'),
          'REVERT_RESIZE': gettext('Revert Resize/Migrate'),
          'REBOOT': gettext('Reboot'),
          'HARD_REBOOT': gettext('Hard Reboot'),
          'PASSWORD': gettext('Password'),
          'REBUILD': gettext('Rebuild'),
          'MIGRATING': gettext('Migrating'),
          'BUILD': gettext('Build'),
          'RESCUE':  gettext('Rescue'),
          'SOFT-delete':  gettext('Soft Deleted'),
          'SHELVED':  gettext('Rescue'),
          'SHELVED_OFFLOADED':  gettext('Shelved Offloaded'),
          'BUILDING':  gettext('Building'),
          'STOPPED':  gettext('Stopped'),
          'RESCUED':  gettext('Rescued'),
          'RESIZED':  gettext('Resized')
        }
      })
      .setProperty('OS-EXT-AZ:availability_zone', {
        label: gettext('Availability Zone')
      })
      .setProperty('OS-EXT-STS:task_state', {
        label: gettext('Task State'),
        filters: ['noValue']
      })
      .setProperty('OS-EXT-STS:power_state', {
        label: gettext('Power State'),
        values: {
          '0': gettext('No State'),
          '1': gettext('Running'),
          '2': gettext('Blocked'),
          '3': gettext('Paused'),
          '4': gettext('Shutdown'),
          '5': gettext('Shutoff'),
          '6': gettext('Crashed'),
          '7': gettext('Suspended'),
          '8': gettext('Failed'),
          '9': gettext('Building')
        }
      })
      .tableColumns
      .append({
        id: 'name',
        priority: 1,
        sortDefault: true,
        template: '<a ng-href="{$ \'project/ngdetails/OS::Nova::Server/\'' +
          ' + item.id $}">{$ item.name $}</a>'
      })
      .append({
        id: 'image_name',
        priority: 2
      })
      .append({
        id: 'flavor_name',
        priority: 2
      })
      .append({
        id: 'key_name',
        priority: 2
      })
      .append({
        id: 'status',
        priority: 1
      })
      .append({
        id: 'OS-EXT-AZ:availability_zone',
        excludeSort: true,
        priority: 2
      })
      .append({
        id: 'OS-EXT-STS:task_state',
        priority: 1,
        excludeSort: true
      })
      .append({
        id: 'OS-EXT-STS:power_state',
        priority: 1,
        excludeSort: true
      })
      .append({
        id: 'created',
        priority: 1
      });

    function listFunction() {
      return nova.getServers();
    }
  }

})();
