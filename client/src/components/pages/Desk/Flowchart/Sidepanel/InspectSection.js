import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { loadText } from '../../../../../store/actions';
import SectionAttributes from '../../TextsPanel/Text/Annotations/SectionAttributes';
import SectionTitle from '../../TextsPanel/Text/Annotations/SectionTitle';
import InspectToolbar from './InspectToolbar';

const InspectSection = ({ id }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const section = useSelector(s => s.sections[id]);
  const openAction = () =>
    loadText({
      textId: section.textId,
      openText: true,
      setToActive: true,
      history: history
    });
  // onclick function that selections mindmap node also
  return (
    <div>
      <SectionTitle sectionId={id} triggerRemeasure={() => {}} />
      <InspectToolbar id={id} openAction={openAction} />
      <SectionAttributes sectionId={id} triggerRemeasure={() => {}} />
      <div className='inspect-text-quill-wrapper'>
        <ReactQuill
          defaultValue={`<blockquoute>${section.fullWords}</blockquoute>`}
          theme='bubble'
          readOnly={true}
        />
      </div>
    </div>
  );
};

export default InspectSection;
