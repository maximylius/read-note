import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { closeAllModals } from '../../../store/actions';
import { BsXCircle } from 'react-icons/bs';

function Welcome() {
  const history = useHistory();
  const dispatch = useDispatch();
  return (
    <>
      <div
        className='page-modal-outer'
        onClick={() => dispatch(closeAllModals(history))}
      ></div>
      <div className='page-modal-body'>
        <div className='page-modal-toolbar'>
          <button
            className='page-modal-close'
            onClick={() => dispatch(closeAllModals(history))}
          >
            <BsXCircle />
          </button>
        </div>
        <h1 className='display-4'>Welcome to the Alpha Version.</h1>
        <p className='lead'>
          In case you haven't done so yet: register to try out the App. We are
          looking forward to your feedback
        </p>
        <p className='lead'>
          Quick explanation. Copy and paste in a text into the add-text panel.
          Categorize the text and take notes for individual text sections. If
          you want to make generell notes not referring to a specific text, do
          so in the panel on the right hand side. Add new notes via the plus
          symbol. You can embed notes into each other and use them as
          sub-heading. The network-graph allows to keep track of all linkages.
        </p>
      </div>
    </>
  );
}

export default Welcome;
