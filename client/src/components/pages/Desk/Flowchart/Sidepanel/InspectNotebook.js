import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { BsLink, BsToggleOn, BsX, BsXCircle, BsTrash } from 'react-icons/bs';
import {
  closeFlowchartElement,
  loadNotebooks
} from '../../../../../store/actions';

const InspectNotebook = ({ id, flowchartInstance }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { notebooks } = useSelector(state => state);
  const removeElementFromInspect = () => dispatch(closeFlowchartElement(id));
  const openClickHandler = () => {
    dispatch(
      loadNotebooks({
        notebookIds: [id],
        open: true,
        setToActive: id,
        history: history
      })
    );
  };
  console.log(notebooks.byId);
  console.log(notebooks.byId[id]);
  // onclick function that selections mindmap node also
  // 2do add clickhandler for links
  return (
    <div>
      <h5>{notebooks.byId[id].title}</h5>
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
        defaultValue={notebooks.byId[id].html}
        theme='bubble'
        readOnly={true}
      />
    </div>
  );
};

export default InspectNotebook;
