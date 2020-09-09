import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSection } from '../../../../../../store/actions';
import { BsPlus } from 'react-icons/bs';
import TextMeta from './TextMeta';
import ButtonToolbar from './ButtonToolbar';
import Sections from './Sections';
import FlowSections from './FlowSections';

const Sidepanel = ({}) => {
  const dispatch = useDispatch();
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const displayTextMeta = useSelector(s => s.textsPanel.displayTextMeta);
  const flowSectionView = useSelector(s => s.panel.flowSectionView);
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
  };

  return (
    <>
      <ButtonToolbar />

      {!displayTextMeta ? (
        <>
          {flowSectionView ? <FlowSections /> : <Sections />}
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
