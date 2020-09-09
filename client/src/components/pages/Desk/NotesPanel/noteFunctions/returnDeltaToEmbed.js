import { loadNotes, addAlert } from '../../../../../store/actions';

const returnDeltaToEmbed = (resId, g) => {
  const { notes, dispatch } = g.current;
  let deltaToEmbed = notes[resId] && notes[resId].delta;
  console.log('returnDeltaToEmbed', deltaToEmbed);
  if (deltaToEmbed) return deltaToEmbed;
  if (!deltaToEmbed) {
    console.log('returnDeltaToEmbed needs to load note');
    return dispatch(loadNotes({ noteIds: [resId] }))
      .then(notesById => {
        deltaToEmbed = notesById && notesById[resId] && notesById[resId].delta;
        console.log('sucessfully feteched returnDeltaToEmbed', deltaToEmbed);
        if (!deltaToEmbed) {
          dispatch(
            addAlert({
              message:
                '<p>Ressource not found: Either deleted or not yet loaded</p>',
              type: 'warning'
            })
          );
          return null;
        }
        return deltaToEmbed;
      })
      .catch(err => {
        console.log('returnDeltaToEmbed err', err);
      });
  }
};
export default returnDeltaToEmbed;
