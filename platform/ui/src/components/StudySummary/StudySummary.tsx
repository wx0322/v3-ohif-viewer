import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const StudySummary = ({ date, modality, description }) => {
  const fDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
  return (
    <div className="p-2">
      <div className="leading-none">
        <span className="mr-2 text-base text-white">{fDate}</span>
        <span className="px-1 text-base font-bold text-black rounded-sm bg-common-bright">
          {modality}
        </span>
      </div>
      <div className="pt-2 text-base leading-none truncate text-primary-light ellipse">
        {description}
      </div>
    </div>
  );
};

StudySummary.propTypes = {
  date: PropTypes.string.isRequired,
  modality: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default StudySummary;
