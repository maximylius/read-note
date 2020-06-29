import React, { memo } from 'react';
import { useDispatch } from 'react-redux';

import { Handle } from 'react-flow-renderer';
import { inspectAnnotationInFlowchart } from '../../../../../store/actions';

export default memo(props => {
  const dispatch = useDispatch();
  const {
    id,
    data: { width, height, label }
  } = props;
  const onClickHandler = () => {
    // 2do distinguish drag and click
    dispatch(inspectAnnotationInFlowchart(id));
  };
  return (
    <div style={{ width, height }} onClick={onClickHandler}>
      <Handle
        type='source'
        position='top'
        id='a'
        className='flowchartCustomHandle'
      />
      <Handle
        type='target'
        position='bottom'
        id='b'
        className='flowchartCustomHandle'
      />
      <div className='flowchartHandleInnerBox'>
        <span>
          <strong>{label}</strong>
        </span>
      </div>
    </div>
  );
});
