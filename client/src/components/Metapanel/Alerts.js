import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeAlert } from '../../store/actions';
import { BsX } from 'react-icons/bs';

const maxStack = 5; // show maximum x last alerts

const Alerts = () => {
  const dispatch = useDispatch();
  const alerts = useSelector(s => s.ui.alerts);

  return (
    <div className='alert-container'>
      {[...alerts]
        .filter((el, index) => index >= alerts.length - maxStack)
        .reverse()
        .map(el => (
          <div key={el.id} className={`alert-element ${el.type} fade-in`}>
            <button
              className='close-alert-element'
              onClick={() => dispatch(removeAlert(el.id))}
            >
              <BsX />
            </button>
            <p
              className='lead'
              dangerouslySetInnerHTML={{ __html: el.message }}
            ></p>
          </div>
        ))}
    </div>
  );
};

export default Alerts;
