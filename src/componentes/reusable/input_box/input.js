import React from 'react';
import PropTypes from 'prop-types';
import './input_box.scss';

export default function Input({
  value, placeholder, onChange, type, className, accept, disabled,
}) {
  return (
    <input
      className={`sub-rectangle ${className}`}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      accept={accept}
      disabled={disabled}
    />
  );
}

Input.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};
