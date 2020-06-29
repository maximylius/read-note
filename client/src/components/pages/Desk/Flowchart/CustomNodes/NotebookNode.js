import React, { memo } from 'react';
import { useDispatch } from 'react-redux';

import { Handle } from 'react-flow-renderer';
import { inspectNotebookInFlowchart } from '../../../../../store/actions';

export default memo(props => {
  const dispatch = useDispatch();
  const {
    id,
    data: { width, height, label }
  } = props;
  const onClickHandler = () => {
    // 2do distinguish drag and click
    dispatch(inspectNotebookInFlowchart(id));
  };
  return (
    <div style={{ width, height }} onClick={onClickHandler}>
      <Handle
        type='source'
        position='top'
        id='a'
        style={{ background: 'transparent' }}
      />
      <span>
        <strong>{label}</strong>
      </span>
      <Handle
        type='target'
        position='bottom'
        id='b'
        style={{ background: 'transparent' }}
      />
    </div>
  );
});
