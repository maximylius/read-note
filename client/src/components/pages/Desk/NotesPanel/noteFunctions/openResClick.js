import {
  loadText,
  loadNotes,
  setCommittedSections,
  setTentativeSections
} from '../../../../../store/actions';

const openResClick = (resId, resType, g) => {
  const { sections, history, dispatch } = g.current;

  if (resType === 'text') {
    console.log('loadtext');
    dispatch(
      loadText({
        textId: resId,
        openText: true,
        setToActive: true,
        history: history
      })
    );
  } else if (resType === 'note') {
    console.log('load note');
    dispatch(
      loadNotes({
        noteIds: [resId],
        open: true,
        setToActive: resId,
        history: history
      })
    );
  } else if (resType === 'section') {
    console.log('load text section');
    dispatch(
      loadText({
        textId: sections[resId].textId,
        openText: true,
        setToActive: true,
        history: history
      })
    );
    dispatch(setCommittedSections([resId], false));
    dispatch(setTentativeSections([resId], false));
  }
};

export default openResClick;
