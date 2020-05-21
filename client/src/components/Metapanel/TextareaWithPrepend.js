import React, { useEffect } from 'react';

function TextareaWithPrepend({
  id,
  prepend,
  ariaLabel,
  placeholder,
  value,
  onEvent,
  autoExpand = true
}) {
  const expandTextArea = eOrTarget => {
    const target = eOrTarget.style ? eOrTarget : eOrTarget.target;
    // static
    target.style.paddingTop = '5x';
    target.style.paddingBottom = '10px';
    // interactive
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.height = target.scrollHeight + 'px';
  };

  useEffect(() => {
    if (autoExpand) {
      const textarea = document.getElementById(`textarea_${id}`);
      expandTextArea(textarea);
      textarea.addEventListener('keydown', expandTextArea);
      textarea.addEventListener('paste', expandTextArea);
    }
    return () => {
      document
        .getElementById(`textarea_${id}`)
        .removeEventListener('change', expandTextArea);
    };
  }, []);

  return (
    <div className='input-group input-group-sm mb-2'>
      <div className='input-group-prepend' id={`basic-addon-${id}`}>
        <span className='input-group-text'>{prepend}</span>
      </div>
      <textarea
        id={`textarea_${id}`}
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
