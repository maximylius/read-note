import React, { memo } from 'react';
import { inspectNoteInFlowchart } from '../../../../../store/actions';
import StandardNode from './StandardNode';

export default memo(props => {
  return <StandardNode {...props} inspectAction={inspectNoteInFlowchart} />;
});
