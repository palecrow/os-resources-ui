/**
 * (c) Copyright 2016 Hewlett Packard Enterprise Development Company LP
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
   * @ngname horizon.app.core.instances.actions
   *
   * @description
   * Provides all of the actions for instances.
   */
  angular.module('horizon.app.core.instances.actions',
    ['horizon.framework.conf', 'horizon.app.core'])
    .run(run);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.framework.util.actions.redirect-action.service',
    'horizon.app.core.instances.actions.associate-ip',
    'horizon.app.core.instances.actions.attach-interface',
    'horizon.app.core.instances.actions.detach-interface',
    'horizon.app.core.instances.actions.launch-instance.service',
    'horizon.app.core.instances.actions.create-snapshot.service',
    'horizon.app.core.instances.actions.delete-instance.service',
    'horizon.app.core.instances.actions.edit-instance',
    'horizon.app.core.instances.actions.edit-instance-security-groups',
    'horizon.app.core.instances.actions.pause.service',
    'horizon.app.core.instances.actions.rebuild-instance',
    'horizon.app.core.instances.actions.resize-instance',
    'horizon.app.core.instances.actions.unpause.service',
    'horizon.app.core.instances.actions.update-metadata',
    'horizon.app.core.instances.actions.suspend.service',
    'horizon.app.core.instances.actions.resume.service',
    'horizon.app.core.instances.actions.hard-reboot.service',
    'horizon.app.core.instances.actions.soft-reboot.service',
    'horizon.app.core.instances.actions.start.service',
    'horizon.app.core.instances.actions.stop.service',
    'horizon.app.core.instances.resourceType'
  ];

  function run(
    registry,
    redirectService,
    associateIp,
    attachInterface,
    detachInterface,
    launchInstanceService,
    createSnapshotService,
    deleteService,
    editInstance,
    editInstanceSecurityGroups,
    pauseService,
    rebuildInstance,
    resizeInstance,
    unpauseService,
    updateMetadata,
    suspendService,
    resumeService,
    hardRebootService,
    softRebootService,
    startService,
    stopService,
    instanceResourceTypeCode)
  {
    var instanceResourceType = registry.getResourceType(instanceResourceTypeCode);
    instanceResourceType.globalActions
      .append({
        id: 'launchInstanceService',
        service: launchInstanceService,
        template: {
          text: gettext('Create Instance')
        }
      });
    instanceResourceType.batchActions
      .append({
        id: 'deleteService',
        service: deleteService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete')
        }
      });
    instanceResourceType.itemActions
      .append({
        id: 'associateIp',
        service: associateIp,
        template: {
          text: gettext('Associate Floating IP')
        }
      }).append({
        id: 'attachInterface',
        service: attachInterface,
        template: {
          text: gettext('Attach Interface')
        }
      }).append({
        id: 'detachInterface',
        service: detachInterface,
        template: {
          text: gettext('Detach Interface')
        }
      }).append({
        id: 'editInstance',
        service: editInstance,
        template: {
          text: gettext('Edit Instance')
        }
      }).append({
        id: 'editInstanceSecurityGroups',
        service: editInstanceSecurityGroups,
        template: {
          text: gettext('Edit Security Groups')
        }
      }).append({
        id: 'pauseService',
        service: pauseService,
        template: {
          text: gettext('Pause')
        }
      })
      .append({
        id: 'rebuildInstance',
        service: rebuildInstance,
        template: {
          text: gettext('Rebuild Instance')
        }
      })
      .append({
        id: 'unpauseService',
        service: unpauseService,
        template: {
          text: gettext('Unpause')
        }
      })
      .append({
        id: 'resizeInstance',
        service: resizeInstance,
        template: {
          text: gettext('Resize Instance')
        }
      })
      .append({
        id: 'updateMetadata',
        service: updateMetadata,
        template: {
          text: gettext('Update Metadata')
        }
      })
      .append({
        id: 'suspendService',
        service: suspendService,
        template: {
          text: gettext('Suspend')
        }
      })
      .append({
        id: 'resumeService',
        service: resumeService,
        template: {
          text: gettext('Resume')
        }
      })
      .append({
        id: 'hardRebootService',
        service: hardRebootService,
        template: {
          text: gettext('Hard Reboot')
        }
      })
      .append({
        id: 'softRebootService',
        service: softRebootService,
        template: {
          text: gettext('Soft Reboot')
        }
      })
      .append({
        id: 'startService',
        service: startService,
        template: {
          text: gettext('Start')
        }
      })
      .append({
        id: 'stopService',
        service: stopService,
        template: {
          text: gettext('Stop')
        }
      })
      .append({
        id: 'legacyService',
        service: redirectService(legacyPath),
        template: {
          text: gettext('More Details...')
        }
      })
      .append({
        id: 'deleteService',
        service: deleteService,
        template: {
          type: 'delete',
          text: gettext('Delete')
        }
      })
      .append({
        id: 'createSnapshotService',
        service: createSnapshotService,
        template: {
          text: gettext('Create Snapshot')
        }
      });

    function legacyPath(item) {
      return 'project/instances/' + item.id + '/';
    }
  }

})();
