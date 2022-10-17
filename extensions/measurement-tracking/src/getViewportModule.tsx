import React from 'react';
import { useTranslation } from 'react-i18next';

const Component = React.lazy(() => {
  return import(
    /* webpackPrefetch: true */ './viewports/TrackedCornerstoneViewport'
  );
});

const OHIFCornerstoneViewport = props => {
  const { t } = useTranslation();
  return (
    <React.Suspense fallback={<div>{t('Common:Loading...') as string}</div>}>
      <Component {...props} />
    </React.Suspense>
  );
};

function getViewportModule({
  servicesManager,
  commandsManager,
  extensionManager,
}) {
  const ExtendedOHIFCornerstoneTrackingViewport = props => {
    return (
      <OHIFCornerstoneViewport
        servicesManager={servicesManager}
        commandsManager={commandsManager}
        extensionManager={extensionManager}
        {...props}
      />
    );
  };

  return [
    {
      name: 'cornerstone-tracked',
      component: ExtendedOHIFCornerstoneTrackingViewport,
    },
  ];
}

export default getViewportModule;
