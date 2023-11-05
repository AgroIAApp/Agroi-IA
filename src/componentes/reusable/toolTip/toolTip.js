/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './toolTip.scss';

export default function ToolTip({ toolText }) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {toolText}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 10, hide: 10 }}
      overlay={renderTooltip}
    >
      <i className="tool-tip bi bi-info-circle" />
    </OverlayTrigger>
  );
}

ToolTip.propTypes = {
  toolText: PropTypes.string.isRequired,
};
