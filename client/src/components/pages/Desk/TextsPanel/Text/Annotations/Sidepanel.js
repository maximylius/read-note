import React from 'react';
import _isEqual from 'lodash/isEqual';
import { useSelector, useDispatch } from 'react-redux';
import { addSection } from '../../../../../../store/actions';
import { BsInfoCircle, BsPlus } from 'react-icons/bs';
import TextMeta from './TextMeta';
import ButtonToolbar from './ButtonToolbar';
import Sections from './Sections';

const Sidepanel = ({ quillTextRef, quillNoteRefs }) => {
  const dispatch = useDispatch();
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const displayTextMeta = useSelector(s => s.textsPanel.displayTextMeta);
  const speedReader = useSelector(s => s.textsPanel.speedReader);

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
        <>
          {/* // 2do: or display FlowSections */}
          <Sections quillTextRef={quillTextRef} quillNoteRefs={quillNoteRefs} />
          {speedReader.isOpenFor.includes(activeTextPanel) && (
            <button
              className='btn btn-light btn-block btn-lg'
              onClick={addSectionClickHandler}
            >
              <BsPlus /> section
            </button>
          )}
        </>
      ) : (
        <TextMeta />
      )}
    </>
  );
};

export default Sidepanel;
