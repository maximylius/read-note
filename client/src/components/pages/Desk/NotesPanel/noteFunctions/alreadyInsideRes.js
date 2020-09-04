import { addAlert } from '../../../../../store/actions';

const alreadyInsideRes = (resId, g) => {
  const { notes, dispatch } = g.current;
  // necessary only when not open.
  dispatch(
    addAlert({
      message: `<p>You are <strong>already</strong> working within <strong>${notes[resId].title}</strong>.</p>`,
      type: 'info'
    })
  );
};

export default alreadyInsideRes;
