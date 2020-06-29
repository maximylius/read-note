import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { BsLink, BsToggleOn, BsX, BsXCircle, BsTrash } from 'react-icons/bs';
import { closeFlowchartElement, loadText } from '../../../../../store/actions';

const InspectText = ({ id, flowchartInstance }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { texts } = useSelector(state => state);
  const removeElementFromInspect = () => dispatch(closeFlowchartElement(id));
  const openClickHandler = () =>
    dispatch(
      loadText({
        textId: id,
        openText: true,
        setToActive: true,
        history: history
      })
    );
  // onclick function that selections mindmap node also
  return (
    <div>
      <h5>{texts.byId[id].title}</h5>
      <p className='flowchartInspectElToolbar'>
        <span className='flowchartInspectElToolbar'>
          <button className='btn btn-sm btn-light' onClick={openClickHandler}>
            open
          </button>
          <button className='btn btn-sm btn-light'>
            <BsTrash />
          </button>
          <button
            className='btn btn-sm btn-light'
            onClick={removeElementFromInspect}
          >
            <BsXCircle />
          </button>
        </span>
      </p>
      <ReactQuill
        defaultValue={texts.byId[id].deltas}
        theme='bubble'
        readOnly={true}
      />
    </div>
  );
};

export default InspectText;
