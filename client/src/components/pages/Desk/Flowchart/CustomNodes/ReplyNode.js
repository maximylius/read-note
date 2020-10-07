import React, { memo } from 'react';
import StandardNode from './StandardNode';
import { inspectNoteInFlowchart } from '../../../../../store/actions';

export default memo(props => {
  return <StandardNode {...props} inspectAction={inspectNoteInFlowchart} />;
});
