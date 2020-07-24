import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { BsLink, BsToggleOn, BsX, BsXCircle, BsTrash } from 'react-icons/bs';
import { closeFlowchartElement, loadNotes } from '../../../../../store/actions';

const InspectNote = ({ id, flowchartInstance }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const note = useSelector(s => s.notes[id]);
  const removeElementFromInspect = () => dispatch(closeFlowchartElement(id));
  const openClickHandler = () => {
    dispatch(
      loadNotes({
        noteIds: [id],
        open: true,
        setToActive: id,
        history: history
      })
    );
  };
  // onclick function that selections mindmap node also
  // 2do add clickhandler for links
  return (
    <div>
      <h5>{note.title}</h5>
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
      <ReactQuill defaultValue={note.delta} theme='bubble' readOnly={true} />
    </div>
  );
};

export default InspectNote;
