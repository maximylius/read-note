import React, { memo } from 'react';
import { inspectSectionInFlowchart } from '../../../../../store/actions';
import StandardNode from './StandardNode';

export default memo(props => {
  return <StandardNode {...props} inspectAction={inspectSectionInFlowchart} />;
});
