/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './toolTip.scss';

export default function ToolTip({ toolText, info }) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {toolText}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 10, hide: 10 }}
      overlay={renderTooltip}
    >
      {info ? <i className="tool-tip bi bi-info-circle" /> : <i className="tool-tipbi bi-clock-history" />}
    </OverlayTrigger>
  );
}

ToolTip.propTypes = {
  toolText: PropTypes.string.isRequired,
  info: PropTypes.bool.isRequired,
};
