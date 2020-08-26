import React from 'react';
import { useSelector } from 'react-redux';
import { BsChevronDown, BsFile } from 'react-icons/bs';
import Importance from './Importance';

const SectionPreview = ({ sectionId }) => {
  const categories = useSelector(s => s.categories);
  const sections = useSelector(s => s.sections);
  const sectionCategoryIds = useSelector(
    s => s.sections[sectionId].categoryIds
  );
  const sectionDirectConnections = useSelector(
    s => s.sections[sectionId].directConnections
  );
  const sectionIndirectConnections = useSelector(
    s => s.sections[sectionId].indirectConnections
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
  const noteIds = sectionDirectConnections.filter(
    connection => connection.resType === 'note'
  );

  return (
    <>
      {/* //div className='section-attribute-preview-container' */}
      <div className='section-attribute-preview-shadow'>
        <span>
          <BsChevronDown />
        </span>
      </div>
      <Importance sectionId={sectionId} preview={true} />
      {noteIds.length > 0 && (
        <div
          key={`number-of-notes-by-type`}
          className='section-attribute section-notes-preview'
        >
          <strong>{noteIds.length}x</strong>
          <BsFile />
        </div>
      )}
      {sectionCategoryIds.map(id => (
        <div
          key={`sectionCategoryIds-${id}`}
          className='section-attribute section-categories-preview'
        >
          {categories.byId[id].title}
        </div>
      ))}
      {twoWayConnections.map(connection => (
        <div
          key={`connection-${connection.resId}`}
          className='section-attribute section-connections two-way-connection'
        >
          {(sections[connection.resId] || { title: 'Unknown' }).title}
        </div>
      ))}
      {outgoingConnections.map(connection => (
        <div
          key={`connection-${connection.resId}`}
          className='section-attribute section-connections outgoing-connection'
        >
          {(sections[connection.resId] || { title: 'Unknown' }).title}
        </div>
      ))}
      {incomingConnections.map(connection => (
        <div
          key={`connection-${connection.resId}`}
          className='section-attribute section-connections incoming-connection'
        >
          {(sections[connection.resId] || { title: 'Unknown' }).title}
        </div>
      ))}
    </>
  );
};

export default SectionPreview;
