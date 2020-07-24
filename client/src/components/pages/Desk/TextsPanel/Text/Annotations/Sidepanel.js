import React from 'react';
import _isEqual from 'lodash/isEqual';
import { useSelector, useDispatch } from 'react-redux';
import SectionItem from './SectionItem';
import { addSection } from '../../../../../../store/actions';
import { BsInfoCircle, BsPlus } from 'react-icons/bs';
import TextMeta from './TextMeta';
import ButtonToolbar from './ButtonToolbar';

const Sidepanel = ({ quillTextRef, quillNoteRefs }) => {
  const dispatch = useDispatch();
  const {
    sections,
    texts,
    textsPanel: { activeTextPanel, expandAll, displayTextMeta, speedReader }
  } = useSelector(s => s);
  const sectionsToDisplay = texts[activeTextPanel]
    ? texts[activeTextPanel].sectionIds.filter(id =>
        Object.keys(sections).includes(id)
      )
    : [];

  const addSectionClickHandler = () => {
    const words = speedReader.words;
    const speedReaderDetails = speedReader.byId[activeTextPanel];
    const begin =
      words[speedReaderDetails.lastIndex || speedReaderDetails.begin].index;
    const end =
      words[speedReaderDetails.index].index +
      words[speedReaderDetails.index].plainText.length;
    dispatch(
      addSection({
        categoryId: 'none',
        begin: begin,
        end: end
      })
    );

    console.log('speedReaderDetails.index', speedReaderDetails.index);
    console.log('speedReaderDetails.lastIndex', speedReaderDetails.lastIndex);
    console.log('speedReaderDetails.begin', speedReaderDetails.begin);
    console.log('begin', begin, 'end', end);
  };

  return (
    <>
      <ButtonToolbar />

      {!displayTextMeta ? (
        <div className='list-group pt-2 annotation-container '>
          {sectionsToDisplay.length > 0 ? (
            sectionsToDisplay.map(id => (
              <SectionItem
                key={id}
                sectionId={id}
                quillTextRef={quillTextRef}
                quillNoteRefs={quillNoteRefs}
              />
            ))
          ) : (
            <p>
              <small>
                <BsInfoCircle /> Add sections and annotations by selecting
                text...
              </small>{' '}
            </p>
          )}
          {speedReader.isOpenFor.includes(activeTextPanel) && (
            <button
              className='btn btn-light btn-block btn-lg'
              onClick={addSectionClickHandler}
            >
              <BsPlus /> section
            </button>
          )}
        </div>
      ) : (
        <TextMeta />
      )}
    </>
  );
};

export default Sidepanel;
