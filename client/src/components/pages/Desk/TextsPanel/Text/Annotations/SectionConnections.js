import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSectionConnection } from '../../../../../../store/actions';
import {
  BsX,
  BsArrowRight,
  BsArrowLeft,
  BsArrowLeftShort,
  BsArrowRightShort,
  BsCheck,
  BsPlus
} from 'react-icons/bs';
import SectionConnectionSpan from './SectionConnectionSpan';

const SectionConnections = ({ sectionId, triggerRemeasure }) => {
  const dispatch = useDispatch();
  const connectionIdRef = useRef();
  const [addingConnection, _setAddingConnection] = useState(false);
  const setAddingConnection = val => {
    _setAddingConnection(val);
    triggerRemeasure();
  };
  const [connectionType, setConnectionType] = useState(
    ['outgoing', 'incoming', 'two-way'][0]
  );
  const sections = useSelector(s => s.sections);
  const section = sections[sectionId];
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

  const addConnection = () => {
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
    <>
      <div>
        <span>Connections: </span>{' '}
        {twoWayConnections.map(connection => (
          <SectionConnectionSpan
            key={`connection-${connection.resId}`}
            sectionId={sectionId}
            connectionId={connection.resId}
            connectionType='two-way'
          />
        ))}
        {outgoingConnections.map(connection => (
          <SectionConnectionSpan
            key={`connection-${connection.resId}`}
            sectionId={sectionId}
            connectionId={connection.resId}
            connectionType='outgoing'
          />
        ))}
        {incomingConnections.map(connection => (
          <SectionConnectionSpan
            key={`connection-${connection.resId}`}
            sectionId={sectionId}
            connectionId={connection.resId}
            connectionType='incoming'
          />
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
                className={`btn btn-sm btn-light two-way-connection-btn ${
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
    </>
  );
};

export default SectionConnections;
