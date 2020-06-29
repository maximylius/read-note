import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { BsLink, BsToggleOn, BsX, BsXCircle, BsTrash } from 'react-icons/bs';
import { closeFlowchartElement, loadText } from '../../../../../store/actions';

const InspectSection = ({ id, flowchartInstance }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { sections } = useSelector(state => state);
  const removeElementFromInspect = () => dispatch(closeFlowchartElement(id));
  const openClickHandler = () => {
    dispatch(
      loadText({
        textId: sections.byId[id].textId,
        openText: true,
        setToActive: true,
        history: history
      })
    );
    //set committed to sectionId
  };
  // onclick function that selections mindmap node also
  return (
    <div>
      <h5>{sections.byId[id].title}</h5>
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
        defaultValue={sections.byId[id].fullWords}
        theme='bubble'
        readOnly={true}
      />
    </div>
  );
};

export default InspectSection;
