import React from 'react';

function TextareaWithPrepend({
  id,
  type,
  ariaLabel,
  prepend,
  placeholder,
  value,
  onEvent
}) {
  return (
    <div className='input-group input-group-sm mb-2'>
      <div className='input-group-prepend' id={`basic-addon-${id}`}>
        <span className='input-group-text'>{prepend}</span>
      </div>
      <input
        id={`input_${type}_${id}`}
        className='form-control'
        placeholder={placeholder}
        aria-label={ariaLabel ? ariaLabel : prepend}
        aria-describedby={`basic-addon-${id}`}
        value={value}
        {...onEvent}
      />
    </div>
  );
}

export default TextareaWithPrepend;
