import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { loadNotes } from '../../../../../store/actions';
import NotePanel from '../../NotesPanel/NotePanel';
import InspectToolbar from './InspectToolbar';

const InspectNote = ({ id }) => {
  const history = useHistory();
  const note = useSelector(s => s.notes[id]);
  const openAction = () =>
    loadNotes({
      noteIds: [id],
      open: true,
      setToActive: id,
      history: history
    });

  // onclick function that selections mindmap node also
  // 2do add clickhandler for links
  return (
    <div>
      <h5>{note.title}</h5>
      <InspectToolbar id={id} openAction={openAction} />
      <div className='notepanel-background'>
        <NotePanel noteId={id} containerType='inspect-note' />
      </div>
    </div>
  );
};

export default InspectNote;
