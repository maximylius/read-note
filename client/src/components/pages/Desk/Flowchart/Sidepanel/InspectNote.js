import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { BsXCircle, BsTrash } from 'react-icons/bs';
import { closeFlowchartElement, loadNotes } from '../../../../../store/actions';

const InspectNote = ({ id }) => {
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
      <p className='inspect-toolbar'>
        <span className='inspect-toolbar'>
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
