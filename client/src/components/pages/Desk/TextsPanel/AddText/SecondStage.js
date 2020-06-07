import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { regExpHistory } from '../../../../../functions/main';
import InputWithPrepend from '../../../../Metapanel/InputWithPrepend';
import {
  updateText,
  loadText,
  clearAddTextPanel
} from '../../../../../store/actions';

function SecondStage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    spareIds,
    textsPanel: { addedId }
  } = useSelector(state => state);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedIn, setPublishedIn] = useState('');
  const [publicationDate, setPublicationDate] = useState('');

  const buttonClickHandler = () => {
    dispatch(loadText({ textId: addedId, openText: true, history }));
    if (title || author || publishedIn || publicationDate) {
      const textUpdate = {};
      if (title) textUpdate.title = title;
      if (author) textUpdate.author = author;
      if (publishedIn) textUpdate.publishedIn = publishedIn;
      if (publicationDate) textUpdate.publicationDate = publicationDate;
      dispatch(updateText(addedId, textUpdate));
    }
    dispatch(clearAddTextPanel());
  };

  return (
    <div>
      <h5>Congrats! Upload successfull.</h5>
      <h5>Optionally provide extra information about text</h5>
      <form>
        <InputWithPrepend
          id='TextUploadTitle'
          type='text'
          prepend='Title'
          placeholder='Enter title'
          value={title}
          onEvent={{ onChange: e => setTitle(e.target.value) }}
        />
        <InputWithPrepend
          id='TextUploadAuthor'
          type='text'
          prepend='Author(s)'
          placeholder='Enter author(s)'
          value={author}
          onEvent={{ onChange: e => setAuthor(e.target.value) }}
        />
        <InputWithPrepend
          id='TextUploadPublishedIn'
          type='text'
          prepend='Published in'
          placeholder='Enter publication'
          value={publishedIn}
          onEvent={{ onChange: e => setPublishedIn(e.target.value) }}
        />
        <InputWithPrepend
          id='TextUploadPublicationDate'
          type='date'
          prepend='Publication Date'
          placeholder='YYYY-MM-DD'
          value={publicationDate}
          onEvent={{ onChange: e => setPublicationDate(e.target.value) }}
        />
        <button
          className='add-btn btn btn-secondary btn-block '
          onClick={buttonClickHandler}
        >
          {!title && !author && !publishedIn && !publicationDate
            ? 'Go to text'
            : 'Submit & Go to text'}
        </button>
      </form>
    </div>
  );
}

export default SecondStage;
