import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSection } from '../../../../../store/actions';

const Tooltip = () => {
  const dispatch = useDispatch();
  const {
    categories,
    textsPanel: { validSelection }
  } = useSelector(state => state);

  const styleDiv = {
    position: 'fixed',
    zIndex: 1000,
    left: `${validSelection.boundingClientRect.right + 10}px`,
    top: `${
      validSelection.boundingClientRect.top * 0.6 +
      validSelection.boundingClientRect.bottom * 0.4
    }px`
  };

  return (
    <div className='noSelect' style={styleDiv}>
      <ul
        className='list-group'
        style={{ listStyle: 'none', backgroundColor: '#fff' }}
      >
        {Object.keys(categories.byId).map(id => (
          <li key={id}>
            <a
              href='#!'
              className='list-group-item list-group-item-action categorize-section'
              style={{
                paddingLeft: '4px',
                paddingRight: '4px',
                paddingTop: '2px',
                paddingBottom: '2px',
                background: 'rgb(' + categories.byId[id].rgbColor + ',0.7)'
              }}
              onClick={() => dispatch(addSection(id))}
            >
              {categories.byId[id].title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tooltip;
