import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addSectionConnection,
  removeSectionConnection,
  addSectionCategory,
  removeSectionCategory
} from '../../../../../../store/actions';
import {
  BsBookmark,
  BsX,
  BsXCircle,
  BsArrowRight,
  BsArrowLeft,
  BsArrowLeftShort,
  BsArrowRightShort,
  BsCheck,
  BsPlus
} from 'react-icons/bs';
import Importance from './Importance';

// 2do:  improve UI for connection selection.
// 2do: add actions for creation of connections.

const SectionAttributes = ({ sectionId, triggerRemeasure }) => {
  const dispatch = useDispatch();
  const connectionIdRef = useRef();
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingConnection, setAddingConnection] = useState(false);
  const [connectionType, setConnectionType] = useState(
    ['outgoing', 'incoming', 'two-way'][0]
  );
  const categories = useSelector(s => s.categories);
  const sections = useSelector(s => s.sections);
  const section = sections[sectionId];
  const sectionCategoryIds = useSelector(
    s => s.sections[sectionId].categoryIds
  );
  const sectionDirectConnections = useSelector(
    s => s.sections[sectionId].directConnections
  );
  const sectionIndirectConnections = useSelector(
    s => s.sections[sectionId].indirectConnections
  );
  const textSectionIds = useSelector(
    s => (s.texts[section.textId] && s.texts[section.textId].sectionIds) || []
  );

  const twoWayConnections = sectionDirectConnections.filter(
    connection =>
      connection.resType === 'section' &&
      sectionIndirectConnections.some(el => el.resId === connection.resId)
  );
  const outgoingConnections = sectionDirectConnections.filter(
    connection =>
      connection.resType === 'section' &&
      !twoWayConnections.some(el => el.resId === connection.resId)
  );
  const incomingConnections = sectionIndirectConnections.filter(
    connection =>
      connection.resType === 'section' &&
      !twoWayConnections.some(el => el.resId === connection.resId)
  );

  const connectionOptions = textSectionIds.filter(
    id =>
      ![
        { resId: sectionId },
        ...twoWayConnections,
        ...outgoingConnections,
        ...incomingConnections
      ].some(el => el.resId === id)
  ); // concat ("selectSectionByClickingOnIt") // wich would then trigger a state change allow to click any section item. if clicked elsewhere state disapears.

  const onCategoryChangeHandler = e => {
    dispatch(addSectionCategory(sectionId, e.target.value));
    setAddingCategory(false);
  };

  const removeCategory = id => {
    dispatch(removeSectionCategory(sectionId, id));
    // handle case where there is no category left.
  };
  const removeConnection = id => {
    console.log('removeConnection', id);
    dispatch(removeSectionConnection(sectionId, id));
  };
  const addConnection = () => {
    console.log(connectionIdRef.current);
    if (connectionIdRef.current && connectionIdRef.current.value) {
      dispatch(
        addSectionConnection(
          sectionId,
          connectionIdRef.current.value,
          connectionType
        )
      );
    }
    setAddingConnection(false);
  };

  return (
    <div className='section-attrinutes-container'>
      <Importance sectionId={sectionId} />
      <div>
        <span>Categories: </span>{' '}
        {sectionCategoryIds.map(id => (
          <div
            key={`sectionCategoryIds-${id}`}
            className='section-attribute section-categories-preview'
          >
            <div
              className='remove-section-attribute'
              onClick={() => removeCategory(id)}
            >
              <BsXCircle />
            </div>
            {categories.byId[id].title}
          </div>
        ))}
        {addingCategory ? (
          <div className='input-group input-group-sm mb-2'>
            <div
              className='input-group-prepend'
              id={`${sectionId}_secCatSelect`}
            >
              <span className='input-group-text'>
                <BsBookmark />
              </span>
            </div>
            <select
              className='form-control custom-select white-opacity-50'
              value={sectionCategoryIds[0]}
              onChange={onCategoryChangeHandler}
            >
              <option key={'- select -'} value='- select -'>
                - select -
              </option>
              {Object.keys(categories.byId)
                .filter(id => !sectionCategoryIds.includes(id))
                .map(id => (
                  <option key={id} value={id}>
                    {categories.byId[id].title}
                  </option>
                ))}
            </select>
            <div
              className='input-group-prepend'
              id={`${sectionId}_secCatSelect`}
            >
              <button
                className='input-group-text btn-light'
                onClick={() => setAddingCategory(false)}
              >
                <BsX />
              </button>
            </div>
          </div>
        ) : (
          <button
            className='btn btn-sm btn-light'
            onClick={() => setAddingCategory(true)}
          >
            <BsPlus />
          </button>
        )}
      </div>
      <div>
        <span>Connections: </span>{' '}
        {twoWayConnections.map(connection => (
          <div
            key={`connection-${connection.resId}`}
            className='section-attribute section-connections two-way-connection'
          >
            <div
              className='remove-section-attribute'
              onClick={() => removeConnection(connection.resId)}
            >
              <BsXCircle />
            </div>
            {sections[connection.resId].title}
          </div>
        ))}
        {outgoingConnections.map(connection => (
          <div
            key={`connection-${connection.resId}`}
            className='section-attribute section-connections outgoing-connection'
          >
            <div
              className='remove-section-attribute'
              onClick={() => removeConnection(connection.resId)}
            >
              <BsXCircle />
            </div>
            {sections[connection.resId].title}
          </div>
        ))}
        {incomingConnections.map(connection => (
          <div
            key={`connection-${connection.resId}`}
            className='section-attribute section-connections incoming-connection'
          >
            <div
              className='remove-section-attribute'
              onClick={() => removeConnection(connection.resId)}
            >
              <BsXCircle />
            </div>
            {sections[connection.resId].title}
          </div>
        ))}
        {connectionOptions.length > 0 && (
          <button
            className='btn btn-sm btn-light'
            onClick={() => setAddingConnection(true)}
          >
            <BsPlus />
          </button>
        )}
      </div>

      {addingConnection && (
        <div className='input-group input-group-sm mb-2'>
          <div className='input-group-prepend' id={`${sectionId}_secCatSelect`}>
            <div className='input-group-text btn-toolbar'>
              <button
                className={`btn btn-sm btn-light ${
                  connectionType === 'outgoing' ? 'active' : ''
                }`}
                onClick={() => setConnectionType('outgoing')}
              >
                <BsArrowRight />
              </button>
              <button
                className={`btn btn-sm btn-light ${
                  connectionType === 'incoming' ? 'active' : ''
                }`}
                onClick={() => setConnectionType('incoming')}
              >
                <BsArrowLeft />
              </button>
              <button
                className={`btn btn-sm btn-light ${
                  connectionType === 'two-way' ? 'active' : ''
                }`}
                onClick={() => setConnectionType('two-way')}
              >
                <BsArrowLeftShort />
                <BsArrowRightShort />
              </button>
            </div>
          </div>
          <select
            className='form-control custom-select white-opacity-50'
            ref={connectionIdRef}
          >
            {connectionOptions.map(id => (
              <option key={id} value={id}>
                {sections[id].title}
              </option>
            ))}
          </select>
          <div className='input-group-prepend'>
            <button
              className='input-group-text btn-light'
              onClick={addConnection}
            >
              <BsCheck />
            </button>
          </div>
          <div className='input-group-prepend'>
            <button
              className='input-group-text btn-light'
              onClick={() => setAddingConnection(false)}
            >
              <BsX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SectionAttributes);
