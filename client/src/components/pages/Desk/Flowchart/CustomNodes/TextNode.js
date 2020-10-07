import React, { memo } from 'react';
import { inspectTextInFlowchart } from '../../../../../store/actions';
import StandardNode from './StandardNode';

export default memo(props => {
  return <StandardNode {...props} inspectAction={inspectTextInFlowchart} />;
});
