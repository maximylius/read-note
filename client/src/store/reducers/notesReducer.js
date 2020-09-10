import * as types from '../types';
import { ObjectRemoveKeys } from '../../functions/main';

const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.LOAD_NOTES:
      return {
        ...state,
        ...payload.docsById
      };
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
          payload.connectionsToAdd
            .filter(c => c.resType === 'note')
            .flatMap(el => [
              state[el.resId]
                ? [
                    el.resId,
                    {
                      ...state[el.resId],
                      indirectConnections: state[el.resId].indirectConnections
                        .filter(c => c.resId !== el.resId)
                        .concat({
                          resId: payload.note._id,
                          resType: 'note'
                        })
                    }
                  ]
                : []
            ])
        ),
        ...Object.fromEntries(
          payload.connectionsToRemove
            .filter(c => c.resType === 'note')
            .flatMap(el => [
              state[el.resId]
                ? [
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
                : []
            ])
        )
      };
    case types.SUBMIT_NOTE_VOTE:
      // remove it that same vote has been already given
      const lastVote = state[payload.noteId].votes.find(
        vote => vote.userId === payload.vote.userId
      );

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

    case types.ADD_NEW_NOTE:
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
            replies: state[payload.note.isReply.noteId].replies.concat(
              payload.note._id
            )
          }
        })
      };
    case types.DELETE_NOTE:
      return {
        ...ObjectRemoveKeys(state, [payload.note._id]),
        ...(state[payload.note._id].isReply
          ? state[state[payload.note._id].isReply.noteId]
            ? {
                [state[payload.note._id].isReply.noteId]: {
                  ...state[state[payload.note._id].isReply.noteId],
                  replies: state[
                    state[payload.note._id].isReply.noteId
                  ].replies.filter(replyId => replyId !== payload.note._id)
                }
              }
            : {}
          : {})
      };

    case types.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
