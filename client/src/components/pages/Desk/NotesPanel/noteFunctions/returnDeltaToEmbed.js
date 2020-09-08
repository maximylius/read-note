import { loadNotes, addAlert } from '../../../../../store/actions';

const returnDeltaToEmbed = (resId, g) => {
  const { notes, dispatch } = g.current;
  let deltaToEmbed = notes[resId] && notes[resId].delta;
  console.log('returnDeltaToEmbed', deltaToEmbed);
  if (deltaToEmbed) return deltaToEmbed;
  if (!deltaToEmbed) {
    return dispatch(loadNotes({ noteIds: [resId] }))
      .then(notesById => {
        deltaToEmbed = notesById && notesById[resId] && notesById[resId].delta;
        return deltaToEmbed;
      })
      .catch(err => {
        console.log('err', err);
        dispatch(
          addAlert({
            message:
              '<p>Ressource not found: Either deleted or not yet loaded</p>',
            type: 'warning'
          })
        );
        return null;
      });
  }
};
export default returnDeltaToEmbed;
