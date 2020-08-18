import * as types from '../types';
import { ObjectRemoveKeys } from '../../functions/main';

const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.ADD_TEXT:
    case types.ADD_AND_OPEN_TEXT:
    case types.GET_NOTES:
      return {
        ...state,
        ...payload.notesById
      };
    case types.UPDATE_NOTE:
      return {
        ...state,
        [payload.note._id]: payload.note,
        // update other notes when directConnections have changed.
        ...Object.fromEntries(
          payload.connectionsToAdd.flatMap(el =>
            el.resType === 'note' &&
            !state[el.resId].indirectConnections.some(
              connection => connection.resId === el.resId
            )
              ? [
                  [
                    el.resId,
                    {
                      ...state[el.resId],
                      indirectConnections: state[
                        el.resId
                      ].indirectConnections.concat({
                        resId: payload.note._id,
                        resType: 'note'
                      })
                    }
                  ]
                ]
              : []
          )
        ),
        ...Object.fromEntries(
          payload.connectionsToRemove.flatMap(el =>
            el.resType === 'note'
              ? [
                  [
                    el.resId,
                    {
                      ...state[el.resId],
                      indirectConnections: state[
                        el.resId
                      ].indirectConnections.filter(
                        id => id !== payload.note._id
                      )
                    }
                  ]
                ]
              : []
          )
        )
      };
    case types.SUBMIT_NOTE_VOTE:
      // remove it that same vote has been already given
      const lastVote = state[payload.noteId].votes.filter(
        vote => vote.userId === payload.vote.userId
      )[0];

      return {
        ...state,
        [payload.noteId]: {
          ...state[payload.noteId],
          votes: lastVote
            ? lastVote.bill === payload.vote.bill
              ? state[payload.noteId].votes.filter(
                  vote => vote.userId !== payload.vote.userId
                )
              : state[payload.noteId].votes
                  .filter(vote => vote.userId !== payload.vote.userId)
                  .concat(payload.vote)
            : state[payload.noteId].votes.concat(...[payload.vote])
        }
      };

    case types.ADD_NOTE:
      return {
        ...state,
        [payload.note._id]: payload.note,
        // possibly add this note to directConnections of parent note
        ...(payload.note.indirectConnections.length === 1 && {
          [payload.note.indirectConnections[0].resId]: {
            ...state[payload.note.indirectConnections[0].resId],
            directConnections: state[
              payload.note.indirectConnections[0].resId
            ].directConnections.concat({
              resId: payload.note._id,
              resType: 'note'
            })
          }
        }),
        // if note is created as a reply
        ...(payload.note.isReply && {
          [payload.note.isReply.noteId]: {
            ...state[payload.note.isReply.noteId],
            replies: state[payload.note.isReply.noteId].replies.concat({
              resId: payload.note._id,
              resType: 'note'
            })
          }
        })
      };
    case types.DELETE_NOTE:
      return ObjectRemoveKeys(state, [payload.note._id]);

    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
