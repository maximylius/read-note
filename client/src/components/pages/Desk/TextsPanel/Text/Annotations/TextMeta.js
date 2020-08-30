import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputWithPrepend from '../../../../../Metapanel/InputWithPrepend';
import { updateText, deleteText } from '../../../../../../store/actions';
function TextMeta() {
  const dispatch = useDispatch();
  const activeTextPanel = useSelector(s => s.textsPanel.activeTextPanel);
  const text = useSelector(s => s.texts[s.textsPanel.activeTextPanel]);

  const [changeCounter, setChangeCounter] = useState(0);
  const [title, _setTitle] = useState(text.title);
  const [author, _setAuthor] = useState(text.author);
  const [publishedIn, _setPublishedIn] = useState(text.publishedIn);
  const [publicationDate, _setPublicationDate] = useState(text.publicationDate);

  const titleRef = React.useRef(text.title);
  const authorRef = React.useRef(text.author);
  const publishedInRef = React.useRef(text.publishedIn);
  const publicationDateRef = React.useRef(text.publicationDate);

  const setTitle = val => {
    _setTitle(val);
    titleRef.current = val;
    setChangeCounter(prevState => prevState + 1);
  };
  const setAuthor = val => {
    _setAuthor(val);
    authorRef.current = val;
    setChangeCounter(prevState => prevState + 1);
  };
  const setPublishedIn = val => {
    _setPublishedIn(val);
    publishedInRef.current = val;
    setChangeCounter(prevState => prevState + 1);
  };
  const setPublicationDate = val => {
    _setPublicationDate(val);
    publicationDateRef.current = val;
    setChangeCounter(prevState => prevState + 1);
  };

  const updateChanges = () => {
    const title = titleRef.current;
    const author = authorRef.current;
    const publishedIn = publishedInRef.current;
    const publicationDate = publicationDateRef.current;
    if (
      title !== text.title ||
      author !== text.author ||
      publishedIn !== text.publishedIn ||
      publicationDate !== text.publicationDate
    ) {
      console.log('dispatch');
      dispatch(
        updateText(text._id, {
          title,
          author,
          publishedIn,
          publicationDate
        })
      );
    }
  };

  const deleteTextClick = () => dispatch(deleteText(activeTextPanel));

  useEffect(() => {
    const updateTimer = setTimeout(() => {
      updateChanges();
    }, 3000);
    return () => {
      clearTimeout(updateTimer);
    };
  }, [changeCounter]);

  useEffect(() => {
    return () => {
      console.log('unmounts');
      updateChanges();
      // 2do updates with initial values..
    };
  }, []);

  return (
    <div className='mt-2'>
      <InputWithPrepend
        id='TextMetaTitle'
        type='text'
        prepend='Title'
        placeholder='Enter title'
        value={title}
        onEvent={{ onChange: e => setTitle(e.target.value) }}
      />
      <InputWithPrepend
        id='TextMetaAuthor'
        type='text'
        prepend='Author(s)'
        placeholder='Enter author(s)'
        value={author}
        onEvent={{ onChange: e => setAuthor(e.target.value) }}
      />
      <InputWithPrepend
        id='TextMetaPublishedIn'
        type='text'
        prepend='Published in'
        placeholder='Enter publication'
        value={publishedInRef.current}
        onEvent={{ onChange: e => setPublishedIn(e.target.value) }}
      />
      <InputWithPrepend
        id='TextMetaPublicationDate'
        type='date'
        prepend='Publication Date'
        placeholder='YYYY-MM-DD'
        value={publicationDate}
        onEvent={{ onChange: e => setPublicationDate(e.target.value) }}
      />
      <button className='btn btn-block btn-danger' onClick={deleteTextClick}>
        <span>
          <strong>permantly delete</strong> this text
        </span>
      </button>
    </div>
  );
}

export default TextMeta;
