/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ToolTip({ toolText }) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {toolText}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <i className="bi bi-info-circle" />
    </OverlayTrigger>
  );
}

ToolTip.propTypes = {
  toolText: PropTypes.string.isRequired,
};
