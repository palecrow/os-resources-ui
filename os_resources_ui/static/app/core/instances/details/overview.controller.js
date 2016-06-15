/*
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  "use strict";

  angular
    .module('horizon.app.core.instances.details')
    .controller('ServerOverviewController', controller);

  controller.$inject = [
    'horizon.app.core.instances.resourceType',
    'horizon.app.core.openstack-service-api.nova',
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.instances.instance-status.service',
    '$scope'
  ];

  function controller(
    resourceTypeCode,
    nova,
    registry,
    statusService,
    $scope
  ) {
    var ctrl = this;

    ctrl.server = {};
    ctrl.resourceType = registry.getResourceType(resourceTypeCode);
    ctrl.getAddresses = statusService.getAddresses;
    ctrl.ruleToString = ruleToString;

    function ruleToString(rule) {
      return interpolate(gettext("ALLOW %(type)s %(direction)s %(target)s"), {
        type: rule.ethertype,
        direction: rule.direction === 'egress' ? gettext('to') : gettext('from'),
        target: rule.remote_ip_prefix === null ? gettext('default') : rule.remote_ip_prefix
      }, true);
    }

    $scope.context.loadPromise.then(onGetResponse);

    function onGetResponse(response) {
      ctrl.server = response.data;
      if (ctrl.server.flavor && ctrl.server.flavor.id) {
        nova.getFlavor(ctrl.server.flavor.id).then(onGetFlavor);
      }
      nova.getServerVolumes(ctrl.server.id).then(onGetVolumes);
      nova.getServerSecurityGroups(ctrl.server.id).then(onGetSecurityGroups);
    }

    function onGetFlavor(response) {
      ctrl.flavor = response.data;
    }

    function onGetVolumes(response) {
      ctrl.volumes = response.data.items;
    }

    function onGetSecurityGroups(response) {
      ctrl.securityGroups = response.data.items;
    }
  }

})();
