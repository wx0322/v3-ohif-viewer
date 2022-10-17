import React from 'react';
import { DicomMetadataStore } from '@ohif/core';

/**
 *
 * @param {*} servicesManager
 * @param {*} dataSource
 * @param {*} measurements
 * @param {*} options
 * @returns {string[]} displaySetInstanceUIDs
 */
async function createReportAsync(
  servicesManager,
  commandsManager,
  dataSource,
  measurements,
  options
) {

  const {
    DisplaySetService,
    UINotificationService,
    UIDialogService,
  } = servicesManager.services;
  const loadingDialogId = UIDialogService.create({
    showOverlay: true,
    isDraggable: false,
    centralize: true,
    // TODO: Create a loading indicator component + zeplin design?
    content: Loading,
  });

  try {
    const naturalizedReport = await commandsManager.runCommand(
      'storeMeasurements',
      {
        measurementData: measurements,
        dataSource,
        additionalFindingTypes: ['ArrowAnnotate'],
        options,
      },
      'CORNERSTONE_STRUCTURED_REPORT'
    );

    // The "Mode" route listens for DicomMetadataStore changes
    // When a new instance is added, it listens and
    // automatically calls makeDisplaySets
    DicomMetadataStore.addInstances([naturalizedReport], true);

    const displaySetInstanceUID = DisplaySetService.getMostRecentDisplaySet();

    UINotificationService.show({
      title: '创建报告',// 'Create Report',
      message: '测量保存成功', //'Measurements saved successfully',
      type: 'success',
    });

    return [displaySetInstanceUID];
  } catch (error) {
    UINotificationService.show({
      title: '创建报告',//'Create Report',
      message: error.message || '测量保存失败',//'Failed to store measurements',
      type: 'error',
    });
  } finally {
    UIDialogService.dismiss({ id: loadingDialogId });
  }
}

function Loading() {
  return <div className="text-primary-active">加载中...</div>;
}

export default createReportAsync;
