import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NotFound = ({
  message = '404 页面不存在',
  showGoBackButton = false,
}) => {
  return (
    <div className="w-full h-full flex justify-center items-center text-blue-900">
      <div>
        <h4>{message}</h4>
        {showGoBackButton && (
          <h5>
            <Link to={'/'}>返回检查列表页面</Link>
          </h5>
        )}
      </div>
    </div>
  );
};

NotFound.propTypes = {
  message: PropTypes.string,
  showGoBackButton: PropTypes.bool,
};

export default NotFound;
