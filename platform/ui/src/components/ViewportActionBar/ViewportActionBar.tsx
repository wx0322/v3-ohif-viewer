import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon, ButtonGroup, Button, Tooltip, CinePlayer } from '../';
import useOnClickOutside from '../../utils/useOnClickOutside';
import { useTranslation } from 'react-i18next';
import { StringNumber } from '../../types';

const classes = {
  infoHeader: 'text-base text-primary-light',
  infoText: 'text-base text-white max-w-24 truncate',
  firstRow: 'flex flex-col',
  row: 'flex flex-col ml-4',
};

const ViewportActionBar = ({
  studyData,
  showNavArrows,
  showStatus,
  showCine,
  cineProps,
  showPatientInfo: patientInfoVisibility,
  onSeriesChange,
  onDoubleClick,
  //
  onPillClick,
}) => {
  const [showPatientInfo, setShowPatientInfo] = useState(patientInfoVisibility);

  // TODO -> Remake this component with a bunch of generic slots that can be filled,
  // Its not generic at all, isTracked etc shouldn't be parts of this component.
  // It shouldn't care that a tracking mode or SR exists.
  // Things like the right/left buttons should be made into smaller
  // Components you can compose.
  // OHIF-200 ticket.

  const {
    label,
    isTracked,
    isLocked,
    isRehydratable,
    useAltStyling,
    modality,
    studyDate,
    currentSeries,
    seriesDescription,
    patientInformation,
  } = studyData;

  const {
    patientName,
    patientSex,
    patientAge,
    MRN,
    thickness,
    spacing,
    scanner,
  } = patientInformation;

  const onPatientInfoClick = () => setShowPatientInfo(!showPatientInfo);
  const closePatientInfo = () => setShowPatientInfo(false);
  const showPatientInfoRef = useRef(null);
  const clickOutsideListener = useOnClickOutside(
    showPatientInfoRef,
    closePatientInfo
  );

  useEffect(() => {
    if (showPatientInfo) {
      clickOutsideListener.add();
    } else {
      clickOutsideListener.remove();
    }

    return () => clickOutsideListener.remove();
  }, [clickOutsideListener, showPatientInfo]);

  const renderIconStatus = () => {
    if (modality === 'SR') {
      // 1 - Incompatible
      // 2 - Locked
      // 3 - Rehydratable / Open
      const state =
        isRehydratable && !isLocked ? 3 : isRehydratable && isLocked ? 2 : 1;
      let ToolTipMessage = null;
      let StatusIcon = null;

      switch (state) {
        case 1:
          StatusIcon = () => (
            <div
              className="flex items-center justify-center -mr-1 rounded-full"
              style={{
                width: '18px',
                height: '18px',
                backgroundColor: '#98e5c1',
                border: 'solid 1.5px #000000',
              }}
            >
              <Icon
                name="exclamation"
                style={{ color: '#000', width: '12px', height: '12px' }}
              />
            </div>
          );

          ToolTipMessage = () => (
            <div>
              结构报告不兼容当前程序
            </div>
          );
          break;
        case 2:
          StatusIcon = () => (
            <div
              className="flex items-center justify-center -mr-1 bg-black rounded-full"
              style={{
                width: '18px',
                height: '18px',
              }}
            >
              <Icon
                name="lock"
                style={{ color: '#05D97C', width: '8px', height: '11px' }}
              />
            </div>
          );

          ToolTipMessage = () => (
            <div>
              该结构报告只读，因为在另一个查看器里你正在追踪测量。
            </div>
          );
          break;
        case 3:
          StatusIcon = () => (
            <div
              className="flex items-center justify-center -mr-1 bg-white rounded-full group-hover:bg-customblue-200"
              style={{
                width: '18px',
                height: '18px',
                border: 'solid 1.5px #000000',
              }}
            >
              <Icon
                name="arrow-left"
                style={{ color: '#000', width: '14px', height: '14px' }}
              />
            </div>
          );

          ToolTipMessage = () => <div>点击恢复测量</div>;
      }

      const StatusPill = () => (
        <div
          className={classnames(
            'group relative flex items-center justify-center px-2 rounded-full cursor-default bg-customgreen-100',
            {
              'hover:bg-customblue-100': state === 3,
              'cursor-pointer': state === 3,
            }
          )}
          style={{
            height: '24px',
            width: '55px',
          }}
          onClick={() => {
            if (state === 3) {
              // TODO: Gatsby build failing due
              //       to ESLint's "no-unused-expressions"
              //onPillClick?.();
              if (onPillClick) {
                onPillClick();
              }
            }
          }}
        >
          <span className="pr-1 text-lg font-bold leading-none text-black">
            SR
          </span>
          <StatusIcon />
        </div>
      );

      return (
        <>
          {ToolTipMessage && (
            <Tooltip content={<ToolTipMessage />} position="bottom-left">
              <StatusPill />
            </Tooltip>
          )}
          {!ToolTipMessage && <StatusPill />}
        </>
      );
    }

    const trackedIcon = isTracked ? 'tracked' : 'dotted-circle';

    return (
      <div className="relative">
        <Tooltip
          position="bottom-left"
          content={
            <div className="flex py-2">
              <div className="flex pt-1">
                <Icon name="info-link" className="w-4 text-primary-main" />
              </div>
              <div className="flex ml-4">
                <span className="text-base text-common-light">
                  {isTracked ? (
                    <>
                      被
                      <span className="font-bold text-white"> 追踪</span> 的序列可以在测量面板中查看
                    </>
                  ) : (
                    <>
                      没有被
                      <span className="font-bold text-white"> 追踪 </span>
                      的序列不会显示在测量面板里
                    </>
                  )}
                </span>
              </div>
            </div>
          }
        >
          <Icon name={trackedIcon} className="w-6 text-primary-light" />
        </Tooltip>
      </div>
    );
  };

  const borderColor = useAltStyling ? '#365A6A' : '#1D205A';

  let backgroundColor = '#020424';
  if (useAltStyling || isTracked) {
    backgroundColor = '#031923';
  }

  const fStudyDate = moment(studyDate, "DD-MM-YYYY").format('YYYY-MM-DD');
  return (
    <div
      className="flex flex-wrap items-center p-2 -mt-2 border-b select-none"
      style={{
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      }}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex flex-1 grow mt-2 min-w-48">
        <div className="flex items-center">
          <span className="mr-2 text-white text-large">{label}</span>
          {showStatus && renderIconStatus()}
        </div>
        <div className="flex flex-col justify-start ml-4">
          <div className="flex">
            <span className="text-base text-white">{fStudyDate}</span>
            <span className="pl-2 ml-2 text-base border-l border-primary-light text-primary-light">
              S: {currentSeries}
            </span>
          </div>
          <div className="flex">
            {/* TODO:
                This is tricky. Our "no-wrap" in truncate means this has a hard
                length. The overflow forces ellipse. If we don't set max width
                appropriately, this causes the ActionBar to overflow.
                Can clean up by setting percentage widths + calc on parent
                containers
             */}
            <p className="text-base truncate max-w-40 text-primary-light">
              {seriesDescription}
            </p>
          </div>
        </div>
      </div>
      {showNavArrows && !showCine && (
        <div className="mt-2" style={{ pointerEvents: 'all' }}>
          <ButtonGroup className={undefined}>
            <Button
              size="initial"
              className="px-2 py-1 bg-black"
              border="light"
              onClick={() => onSeriesChange('left')}
              startIcon={undefined} endIcon={undefined} name={undefined}            >
              <Icon name="chevron-left" className="w-4 text-white" />
            </Button>
            <Button
              size="initial"
              border="light"
              className="px-2 py-1 bg-black"
              onClick={() => onSeriesChange('right')}
              startIcon={undefined} endIcon={undefined} name={undefined}>
              <Icon name="chevron-right" className="w-4 text-white" />
            </Button>
          </ButtonGroup>
        </div>
      )}
      {showCine && !showNavArrows && (
        <div className="mt-2 mr-auto min-w-48 max-w-48">
          <CinePlayer {...cineProps} />
        </div>
      )}
      <div className="flex h-8 mt-2 ml-4 mr-2" onClick={onPatientInfoClick}>
        <PatientInfo
          showPatientInfoRef={showPatientInfoRef}
          isOpen={showPatientInfo}
          patientName={patientName}
          patientSex={patientSex}
          patientAge={patientAge}
          MRN={MRN}
          thickness={thickness}
          spacing={spacing}
          scanner={scanner}
        />
      </div>
    </div>
  );
};

ViewportActionBar.propTypes = {
  onSeriesChange: PropTypes.func.isRequired,
  showNavArrows: PropTypes.bool,
  showCine: PropTypes.bool,
  cineProps: PropTypes.object,
  showPatientInfo: PropTypes.bool,
  studyData: PropTypes.shape({
    //
    useAltStyling: PropTypes.bool,
    //
    label: PropTypes.string.isRequired,
    isTracked: PropTypes.bool.isRequired,
    isRehydratable: PropTypes.bool.isRequired,
    studyDate: PropTypes.string.isRequired,
    currentSeries: StringNumber.isRequired,
    seriesDescription: PropTypes.string.isRequired,
    modality: PropTypes.string.isRequired,
    patientInformation: PropTypes.shape({
      patientName: PropTypes.string.isRequired,
      patientSex: PropTypes.string.isRequired,
      patientAge: PropTypes.string.isRequired,
      MRN: PropTypes.string.isRequired,
      thickness: PropTypes.string.isRequired,
      spacing: PropTypes.string.isRequired,
      scanner: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

ViewportActionBar.defaultProps = {
  cineProps: {},
  showCine: false,
  showStatus: true,
  showNavArrows: true,
  showPatientInfo: false,
};

function PatientInfo({
  patientName,
  patientSex,
  patientAge,
  MRN,
  thickness,
  spacing,
  scanner,
  isOpen,
  showPatientInfoRef,
}) {
  const { t } = useTranslation('PatientInfo');

  while (patientAge.charAt(0) === '0') {
    patientAge = patientAge.substr(1);
  }

  return (
    <div ref={showPatientInfoRef}>
      <Tooltip
        isSticky
        isDisabled={!isOpen}
        position="bottom-right"
        content={
          isOpen && (
            <div className="flex py-2">
              <div className="flex pt-1">
                <Icon name="info-link" className="w-4 text-primary-main" />
              </div>
              <div className="flex flex-col ml-2">
                <span
                  className="text-base font-bold text-white"
                  title={patientName}
                >
                  {patientName}
                </span>
                <div className="flex pb-4 mt-4 mb-4 border-b border-secondary-main">
                  <div className={classnames(classes.firstRow)}>
                    <span className={classnames(classes.infoHeader)}>
                      {t('Sex') as string}
                    </span>
                    <span
                      className={classnames(classes.infoText)}
                      title={patientSex}
                    >
                      {patientSex}
                    </span>
                  </div>
                  <div className={classnames(classes.row)}>
                    <span className={classnames(classes.infoHeader)}>
                      {t('Age') as string}
                    </span>
                    <span
                      className={classnames(classes.infoText)}
                      title={patientAge}
                    >
                      {patientAge}
                    </span>
                  </div>
                  <div className={classnames(classes.row)}>
                    <span className={classnames(classes.infoHeader)}>
                      {t('MRN') as string}
                    </span>
                    <span className={classnames(classes.infoText)} title={MRN}>
                      {MRN}
                    </span>
                  </div>
                </div>
                <div className="flex">
                  <div className={classnames(classes.firstRow)}>
                    <span className={classnames(classes.infoHeader)}>
                      {t('Thickness') as string}
                    </span>
                    <span
                      className={classnames(classes.infoText)}
                      title={thickness}
                    >
                      {thickness}
                    </span>
                  </div>
                  <div className={classnames(classes.row)}>
                    <span className={classnames(classes.infoHeader)}>
                      {t('Spacing') as string}
                    </span>
                    <span
                      className={classnames(classes.infoText)}
                      title={spacing}
                    >
                      {spacing}
                    </span>
                  </div>
                  <div className={classnames(classes.row)}>
                    <span className={classnames(classes.infoHeader)}>
                      {t('Scanner') as string}
                    </span>
                    <span
                      className={classnames(classes.infoText)}
                      title={scanner}
                    >
                      {scanner}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      >
        <div className="relative flex justify-end cursor-pointer">
          <div className="relative">
            <Icon name="profile" className="w-5 text-white" />
            <Icon
              name="info-link"
              className="absolute w-5 text-white bg-black"
              style={{ right: -7, bottom: -10 }}
            />
          </div>
        </div>
      </Tooltip>
    </div>
  );
}

export default ViewportActionBar;
