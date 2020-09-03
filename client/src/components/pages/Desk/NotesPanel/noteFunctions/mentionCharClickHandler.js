import {
  extractAtValueResType,
  extractAtValueResId
} from '../../../../Metapanel/mentionModule';
// ok

const mentionCharClickHandler = (e, g) => {
  const {
    sections,
    history,
    dispatch,
    loadText,
    loadNotes,
    setCommittedSections,
    setTentativeSections
  } = g.current;
  const resInfo = e.target.parentElement.parentElement.dataset.id;
  const resId = extractAtValueResId(resInfo);
  const resType = extractAtValueResType(resInfo);
  console.log(resId);
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
export default mentionCharClickHandler;
