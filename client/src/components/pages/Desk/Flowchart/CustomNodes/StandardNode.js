import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Handle } from 'react-flow-renderer';
import InspectNote from '../Sidepanel/InspectNote';
import InspectSection from '../Sidepanel/InspectSection';
import InspectText from '../Sidepanel/InspectText';

export default memo(
  ({ id, type, data: { width, height, label }, inspectAction }) => {
    const dispatch = useDispatch();
    const isInspected = useSelector(s =>
      s.inspect.inspectElements.some(el => el.resId === id)
    );

    const MAX_FONTSIZE = 60;
    const MIN_FONTSIZE = 16;
    let fontSizePx = Math.max(
      Math.min((width / Math.max(label.length, 8)) * 1.5, MAX_FONTSIZE),
      MIN_FONTSIZE
    );

    const onClickHandler = () => dispatch(inspectAction(id));

    const labelSpan = (
      <span className='react-flow-node-label'>
        <strong>{label}</strong>
      </span>
    );

    let nodeInspect;
    if (isInspected) {
      nodeInspect = (
        <div className={`inspect-container inspect-${type}`}>
          {type === 'note' || type === 'annotation' || type === 'reply' ? (
            <InspectNote id={id} />
          ) : type === 'section' ? (
            <InspectSection id={id} />
          ) : type === 'text' ? (
            <InspectText id={id} />
          ) : (
            labelSpan
          )}
        </div>
      );
    }
    return (
      <div
        style={{
          width,
          minHeight: height,
          fontSize: `${fontSizePx}px`
        }}
        onDoubleClick={onClickHandler}
        className='react-flow-node-inner-container'
      >
        <Handle type='source' position='top' id='st' />
        <Handle type='target' position='bottom' id='tb' />

        {
          // nodeInspect ||
          labelSpan
        }
      </div>
    );
  }
);
