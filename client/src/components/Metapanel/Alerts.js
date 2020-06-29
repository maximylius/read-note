import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeAlert } from '../../store/actions';
import { BsX } from 'react-icons/bs';

const maxStack = 5; // show maximum x last alerts

const Alerts = () => {
  const dispatch = useDispatch();
  const alerts = useSelector(state => state.ui.alerts);

  return (
    <div className='alertContainer'>
      {[...alerts]
        .filter((el, index) => index >= alerts.length - maxStack)
        .reverse()
        .map(el => (
          <div key={el.id} className={`alertElement ${el.type} fade-in`}>
            <button
              className='closeAlertElement'
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
