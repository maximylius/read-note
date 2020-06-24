import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { BsLink, BsToggleOn, BsX, BsXCircle, BsTrash } from 'react-icons/bs';
import { closeFlowchartElement, loadText } from '../../../../../store/actions';

const InspectAnnotation = ({ id, flowchartInstance }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { annotations } = useSelector(state => state);
  const removeElementFromInspect = () => dispatch(closeFlowchartElement(id));
  const openClickHandler = () => {
    dispatch(
      loadText({
        textId: annotations.byId[id].textId,
        openText: true,
        setToActive: true,
        history: history
      })
    );
    //set committed to sectionId
  };
  console.log(annotations.byId);
  console.log(annotations.byId[id]);
  console.log(id);
  // 2do add clickhandler for links
  // onclick function that selections mindmap node also
  return (
    <div>
      <h5>{'annotations.byId[id].title'}</h5>
      <span>
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
      <ReactQuill
        defaultValue={annotations.byId[id].html}
        theme='bubble'
        readOnly={true}
      />
    </div>
  );
};

export default InspectAnnotation;
