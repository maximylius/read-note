import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, ReactReduxContext } from 'react-redux';
import ReactQuill from 'react-quill';
import QuillMention from 'quill-mention';
import _isEqual from 'lodash/isEqual';
import AnnotationBlot from '../../../Metapanel/AnnotationBlot';
import BlotEmbedSeperator from '../../../Metapanel/BlotEmbedSeperator';
import {
  loadText,
  setCommittedSections,
  setTentativeSections,
  updateNotebook,
  loadNotebooks,
  addAlert
} from '../../../../store/actions';
import { getAllKeys } from '../../../../functions/main';

ReactQuill.Quill.register(AnnotationBlot);
ReactQuill.Quill.register(BlotEmbedSeperator);

const initialDelta = [
  { insert: 'Heading for section' },
  { attributes: { header: 1 }, insert: '\n' },
  {
    insert:
      'These possible effect of spatial relocation of economic activity should also be considered when assessing the economic impact of specific transport improvements. '
  },
  {
    attributes: {
      bold: true
    },
    insert:
      'Additional to the effects of economic relocation, changes in residential choices also have to be considered, to better predict changes in agglomeration levels. '
  },
  {
    insert:
      'Our measure of effective density could be further improved. To better estimate cost of traveling between two locations, distance should be included in terms of fuel cost. As we have not included the cost of distance we did slightly underestimate the accessibility of regions at far distances.'
  }
];

const hashValues = [
  { id: 3, value: 'Fredrik Sundqvist 2' },
  { id: 4, value: 'Patrik Sjölin 2' }
];

// 2do each notebook needs a title and a section below that is partly uneditable (their ids shall be numbered notebookId_2_outOf_9 ), that contains all notebook links. shall be updated when changes are committed. shall be collapsable.
// also contain a section that contains link to notebook that are only one way.
// shall enable to disable links even though they appear in text?
// does link section need an input field? no
// 2do check how mention module works first.
// 2do possibly by handling selection? do not allow to be at begin? Maybe problem with drag and drop... selection

const NotebookPanel = ({ setNotebookRef, quillNotebookRefs, notebookId }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    notebooks,
    texts,
    sections,
    annotations,
    user,
    ui: { mdNotebooksPanel },
    textsPanel: { activeTextPanel }
  } = useSelector(state => state);
  const notebook = notebooks.byId[notebookId];
  const [quillValue, setQuillValue] = useState(notebook.deltas || '');
  const [changedEditorCounter, setChangedEditorCounter] = useState(-1);

  // when shall the numbers be updated? at best whenever a mention is used. how to notice?
  const atValues = Object.keys(texts.byId)
    .map(id => {
      let nr = 0; // 2do check with while loop through notebook state
      return {
        id: `${id}_${nr}_${notebookId}`,
        value: texts.byId[id].title
      };
    })
    .concat(
      Object.keys(notebooks.byId).map(id => {
        let nr = 0; // 2do check with while loop through notebook state
        return {
          id: `${id}_${nr}_${notebookId}`,
          value: notebooks.byId[id].title
        };
      })
    )
    .concat(
      Object.keys(sections.byId).map(id => {
        const textTitle = texts.byId[sections.byId[id].textId].title;
        const sectionTitle = sections.byId[id].title;

        let value =
          textTitle +
          // .slice(0, Math.max(6, 24 - sectionTitle.length))
          ' - ' +
          sectionTitle;
        let nr = 0; // 2do check with while loop through notebook state
        return {
          id: `${id}_${nr}_${notebookId}`,
          value
        };
      })
    );

  const mentionModule = React.useCallback(
    {
      allowedChars: /^[A-Za-z\s]*$/,
      mentionDenotationChars: ['@', '#'],
      source: function (searchTerm, renderList, mentionChar) {
        let values;

        if (mentionChar === '@') {
          values = atValues;
        } else {
          values = hashValues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      }
    },
    [user.textIds, user.notebookIds]
  );

  const onChangeHandler = () => {
    if (!quillNotebookRefs.current[notebookId]) return;
    const editor = quillNotebookRefs.current[notebookId].editor;
    const currentDelta = editor.getContents();
    const whiteList = [];
    // check whether it is inconsistent: add Title section and link section.
    // let hasTitle = false;
    // let inConnections = null;
    const isInconsistent = currentDelta.ops.some((op, index) => {
      if (!op.attributes) return false;
      // if (op.attributes.noteTitle) {
      //   if (hasTitle)
      //     return '<p>Title can only be set once in a single line for a notebook.</p>';
      // } else {
      //   if (index === currentDelta.ops.length - 1) return 'No title supplied.';
      //   hasTitle = true;
      //   return false;
      // }
      // if (op.attributes.connectedWith) {
      //   if (!inConnections) {
      //     // should be something 1_outOf_8 or 1_12
      //   } else {
      //     // should be (parseInt( inConnections.split("_")[0])+1)+"_"+inConnections.split("_").slice(1).join("_")
      //   }
      // }
      if (!op.attributes.embedSeperator) return false;
      if (op.attributes.embedSeperator.case === 'begin') {
        // if (!hasTitle) return 'No title supplied.';
        // if(inConnections.split("_")[0]!==inConnections.split("_")[2]) return "No manual adjustment possible"
        // hasTitle = false;
        // inConnections = null;
        if (
          //check whether end of embed exists
          currentDelta.ops
            .slice(index + 1)
            .some(
              el =>
                el.attributes &&
                el.attributes.embedSeperator &&
                el.attributes.embedSeperator.case === 'end' &&
                el.attributes.embedSeperator.idPath ===
                  op.attributes.embedSeperator.idPath
            ) && //check whether mention blot still exists
          currentDelta.ops
            .slice(0, index + 1)
            .some(
              el =>
                el.insert &&
                el.insert.mention &&
                el.insert.mention.id === op.attributes.embedSeperator.idPath
            )
        ) {
          whiteList.push(op.attributes.embedSeperator.idPath);
          return false;
        } else {
          return '<p><strong>Operation not allowed.</strong> <br />Emebed content cannot be removed partly. Collapse or remove completly. </p>';
        }
      } else return !whiteList.includes(op.attributes.embedSeperator.idPath);
    });
    if (isInconsistent) {
      editor.history.undo();
      dispatch(
        addAlert({
          message: isInconsistent,
          type: 'warning'
        })
      );
    } else {
      setChangedEditorCounter(prevState => prevState + 1);
    }
  };

  const handleEditorChange = () => {
    if (!quillNotebookRefs.current[notebookId]) return;
    const editor = quillNotebookRefs.current[notebookId].editor;
    const currentDeltas = editor.getContents();

    // clean current deltas from embeded content:
    // this is also the point where the embededPath shall be derived right?
    // 2do: add links to connectedWith state
    // 2do: add mutedConnections to state
    const embeds = currentDeltas.ops.flatMap((op, opIndex) =>
      op.attributes && op.attributes.embedSeperator
        ? {
            case: op.attributes.embedSeperator.case,
            id: op.attributes.embedSeperator.id,
            parent: op.attributes.embedSeperator.idPath.split('_')[2],
            idPath: op.attributes.embedSeperator.idPath,
            index: opIndex
          }
        : []
    );
    console.log('embeds', embeds);

    const embededNotebooks = [
      {
        id: notebookId,
        beginIndex: 0,
        endIndex: currentDeltas.ops.length - 1,
        deltas: notebooks.byId[notebookId].deltas,
        embedIndexes: []
      }
    ];
    const embedPath = { begin: 0, end: currentDeltas.ops.length - 1 };
    const currentPath = [];
    let currentPos = embedPath;
    embeds.forEach(embed => {
      console.log('embed:', embed);
      currentPos = embedPath;
      currentPath.forEach(el => (currentPos = currentPos[el]));
      console.log('currentPath:', currentPath);
      if (embed.case === 'begin') {
        console.log('begin of embed');
        currentPos[embed.idPath] = { begin: embed.index };
        console.log(currentPos, 'currentPos');
        currentPath.push(embed.idPath);
      } else {
        console.log('end of embed');
        if (currentPath[currentPath.length - 1] !== embed.idPath)
          throw 'Error: inconsistent embeds.';
        currentPos.end = embed.index;
        embededNotebooks.push({
          id: embed.id,
          beginIndex: currentPos.begin + 1, //excl sep
          endIndex: currentPos.end - 1, //excl sep
          embedIndexes: Object.keys(currentPos)
            .filter(key => !['begin', 'end'].includes(key))
            .map(key => ({
              begin: currentPos[key].begin,
              end: currentPos[key].end
            })),
          deltas: notebooks.byId[embed.id].deltas
        });
        currentPath.pop();
      }
      console.log('currentPath', currentPath, 'embedPath', embedPath);
    });
    embededNotebooks[0].embedIndexes = Object.keys(embedPath)
      .filter(key => !['begin', 'end'].includes(key))
      .map(key => ({
        begin: embedPath[key].begin,
        end: embedPath[key].end
      }));
    console.log('embedPath final', embedPath);

    console.log('embededNotebooks', embededNotebooks);
    embededNotebooks.forEach(embededNotebook => {
      // include from begin Index to first embed index, then exclude until embed end, then include from end+1 to next first embedIndex, then exlude until embed,  then include from embed end +1 until end index
      // exclude them seperators
      console.log('embededNotebook', embededNotebook);
      const concernedOps = [...embededNotebook.embedIndexes, {}].flatMap(
        (embedIndex, index) => {
          // console.log("slice frrom", ,"to", );
          return currentDeltas.ops.slice(
            index === 0
              ? embededNotebook.beginIndex
              : embededNotebook.embedIndexes[index - 1].end + 1, //excl sep
            index === embededNotebook.embedIndexes.length
              ? embededNotebook.endIndex + 1
              : embededNotebook.embedIndexes[index].begin //excl sep
          ); // more complex: remove its embeds!
        }
      );

      console.log('concernedOps', concernedOps);
      console.log('embededNotebook.deltas.ops', embededNotebook.deltas.ops);

      if (_isEqual(concernedOps, embededNotebook.deltas.ops)) {
        console.log('no change in', notebooks.byId[embededNotebook.id].title);
        if (
          embededNotebook.id === notebookId &&
          !_isEqual(notebooks.byId[notebookId].embedPath, embedPath)
        ) {
          // think about whether changing the embed path can change the displayed embeds?
          dispatch(
            updateNotebook({
              _id: notebookId,
              embedPath
            })
          );
        }
        return;
      }
      // each main notebook should contain a path of what is expanded: embeds: [{id,nr, id_nr: `${id}_${nr}`, expaneded: false, type: "notebook", id:id, embeds: [{...}]},{...}]
      // if other notebook than active one is changed than an update / remount has to be forced on those places where it is active

      console.log('currentDeltas', currentDeltas);
      const embedPlainText = concernedOps
        .map(op =>
          typeof op.insert === 'string'
            ? op.insert
            : op.insert.mention
            ? op.insert.mention.value
            : ''
        )
        .join('');
      console.log(
        notebooks.byId[embededNotebook.id].title,
        'embedPlainText',
        embedPlainText
      );
      dispatch(
        updateNotebook({
          _id: embededNotebook.id,
          deltas: { ops: concernedOps },
          plainText: embedPlainText,
          embedPath
        })
      );
    });
  };

  React.useEffect(() => {
    if (changedEditorCounter < 0) return;
    if (!quillNotebookRefs.current[notebookId]) return;
    const commitChangeTimer = setTimeout(() => {
      handleEditorChange();
    }, 5000);

    return () => {
      clearTimeout(commitChangeTimer);
    };
  }, [changedEditorCounter]);

  React.useEffect(() => {
    return () => {
      handleEditorChange();
    };
  }, []);

  // make whole embed as content editable false, but turn inner contenteditable to true.
  // 2do include a paste sanitizer: should check whether links are inside. if so it should give the links a new number.
  // 2do improve
  const clickHandler = e => {
    console.log(e.target, e.target.className);
    if (typeof e.target.className !== 'string') return;
    if (
      (!e.target.className.includes('ql-mention-denotation-char') &&
        (e.target.className.includes('mention') ||
          e.target.parentElement.className.includes('mention') ||
          e.target.parentElement.parentElement.className.includes(
            'mention'
          ))) ||
      e.target.className.includes('navline')
    ) {
      const idPath = e.target.className.includes('navline')
        ? e.target.dataset.idPath
        : e.target.dataset.id ||
          e.target.parentElement.dataset.id ||
          e.target.parentElement.parentElement.dataset.id;
      let dontOpen, closeIndexes;
      // idPath contains: resource-nr-parentResource
      // will it always be unique?
      // a parentResource can only be opened once. for that reason: yes

      const resId = idPath.split('_')[0];

      if (resId === notebookId) {
        // 2do or elsewhere in idPath
        dispatch(
          addAlert({
            message: `<p>You are <strong>already</strong> working within <strong>${notebooks.byId[notebookId].title}</strong>.</p>`,
            type: 'info'
          })
        );
        return;
      }
      const mentionType = Object.keys(texts.byId).includes(resId)
        ? 'text'
        : Object.keys(sections.byId).includes(resId)
        ? 'section'
        : Object.keys(annotations.byId).includes(resId)
        ? 'annotation'
        : Object.keys(notebooks.byId).includes(resId)
        ? 'notebook'
        : undefined;
      console.log(resId, 'resId', mentionType, 'mentionType');
      if (!mentionType || mentionType !== 'notebook') return;
      const deltaToEmbed = notebooks.byId[resId].deltas;
      const editor = quillNotebookRefs.current[notebookId].editor;
      const length = editor.getLength();
      const deltas = editor.getContents();
      const deltaIndex = deltas.ops.findIndex(
        op => op.insert.mention && op.insert.mention.id === idPath
      );

      // or if resId is been open upwards the tree.
      // if resId is open sidewards in the tree close this other instance. Otherwise sync problems.

      closeIndexes = {
        begin: deltas.ops.findIndex(
          op =>
            op.attributes &&
            op.attributes.embedSeperator &&
            op.attributes.embedSeperator.case === 'begin' &&
            op.attributes.embedSeperator.idPath === idPath
        ),
        end: deltas.ops.findIndex(
          op =>
            op.attributes &&
            op.attributes.embedSeperator &&
            op.attributes.embedSeperator.case === 'end' &&
            op.attributes.embedSeperator.idPath === idPath
        )
      };
      if (closeIndexes.begin >= 0 && closeIndexes.end >= 0) {
        // resource is open and shall be closed.
        dontOpen = true;
      } else {
        closeIndexes = {
          begin: deltas.ops.findIndex(
            op =>
              op.attributes &&
              op.attributes.embedSeperator &&
              op.attributes.embedSeperator.case === 'begin' &&
              op.attributes.embedSeperator.idPath.includes(
                idPath.split('_').slice(0, 2).join('_')
              )
          ),
          end: deltas.ops.findIndex(
            op =>
              op.attributes &&
              op.attributes.embedSeperator &&
              op.attributes.embedSeperator.case === 'end' &&
              op.attributes.embedSeperator.idPath.includes(
                idPath.split('_').slice(0, 2).join('_')
              )
          )
        };
        if (closeIndexes.begin >= 0 && closeIndexes.end >= 0) {
          // resource is open else where and shall be open in new place and closed in old place
        } else {
          closeIndexes = null; // set to null to not close any.
        }
      }

      console.log('deltas on click', deltas);
      const deltasAfterClick = {
        ops: [
          { delete: length },
          ...(closeIndexes && closeIndexes.begin < deltaIndex
            ? [
                ...deltas.ops.slice(0, closeIndexes.begin),
                ...deltas.ops.slice(closeIndexes.end + 1, deltaIndex + 1)
              ]
            : deltas.ops.slice(0, deltaIndex + 1)),
          ...(dontOpen
            ? []
            : [
                {
                  insert: '\n ',
                  attributes: {
                    embedSeperator: {
                      case: 'begin',
                      embedType: mentionType,
                      id: resId,
                      idPath: idPath,
                      isOpen: true
                    }
                  }
                },
                ...deltaToEmbed.ops,
                {
                  insert: ' ', //2do issued here. block format somehow need to be escaped
                  attributes: {
                    embedSeperator: {
                      case: 'end',
                      embedType: mentionType,
                      id: resId,
                      idPath: idPath,
                      isOpen: true
                    }
                  }
                }
              ]),
          ...(closeIndexes && closeIndexes.begin > deltaIndex
            ? [
                ...deltas.ops.slice(deltaIndex + 1, closeIndexes.begin - 1),
                ...deltas.ops.slice(closeIndexes.end + 1, deltas.ops.length)
              ]
            : deltas.ops.slice(deltaIndex + 1, deltas.ops.length))
        ]
      };
      // 2do updated embed Path with the change:
      // either remove it or add it.
      // shall children always collapsed.
      console.log('deltasAfterClick', deltasAfterClick);
      editor.updateContents(deltasAfterClick);
      // 2do: call a timeout and then add bar next to text
      console.log('expand me...');
      return;
    }
    if (e.target.className.includes('ql-mention-denotation-char')) {
      const mentionId = e.target.parentElement.parentElement.dataset.id.split(
        '_'
      )[0];
      console.log(mentionId);
      if (user.textIds.includes(mentionId)) {
        console.log('loadtext');
        dispatch(
          loadText({
            textId: mentionId,
            openText: true,
            setToActive: true,
            history: history
          })
        );
      } else if (user.notebookIds.includes(mentionId)) {
        console.log('load notebokk');
        dispatch(
          loadNotebooks({
            notebookIds: [mentionId],
            open: true,
            setToActive: mentionId,
            history: history
          })
        );
      } else if (Object.keys(sections.byId).includes(mentionId)) {
        console.log('load text section');
        dispatch(
          loadText({
            textId: sections.byId[mentionId].textId,
            openText: true,
            setToActive: true,
            history: history
          })
        );
        dispatch(setCommittedSections([mentionId], false));
        dispatch(setTentativeSections([mentionId], false));
      }
    }
    if (!e.target.className.includes('QuillEditorAnnotation')) return;
    dispatch(
      loadText({
        textId: e.target.dataset.textId,
        openText: true,
        setToActive: true,
        history: history
      })
    );
    // console.log('about ot set committed.....', e.target.dataset);
    dispatch(setCommittedSections([e.target.dataset.sectionId], false));
    dispatch(setTentativeSections([e.target.dataset.sectionId], false));
  };
  // clickhandler for section blots
  React.useEffect(() => {
    document
      .getElementById(`notebookCardBody${notebookId}`)
      .addEventListener('click', clickHandler);

    return () => {
      document
        .getElementById(`notebookCardBody${notebookId}`)
        .removeEventListener('click', clickHandler);
    };
  }, [notebookId, user.textIds, user.notebookIds]);

  // navline
  React.useEffect(() => {
    if (!quillNotebookRefs.current[notebookId]) return;
    const cardBody = document.getElementById(`notebookCardBody${notebookId}`);
    // delete navlines and replace them with new ones
    Array.from(cardBody.querySelectorAll('.navline')).forEach(navline =>
      navline.remove()
    );

    let index = 0; // understand nested hierachy to chose colors

    // add navline for whole
    const cardBodyRect = cardBody.firstElementChild.getBoundingClientRect();
    const [parentPadding, extendTop, extendBottom] = [16 * 1.25, 14, 14];
    const { top, bottom } = cardBodyRect;
    const navline = document.createElement('div');
    navline.className = `navline navline-${index}`;
    navline.id = 'navline_scroll_' + notebookId;
    navline.dataset.idPath = 'none_none_none';
    navline.style = `height: ${
      cardBodyRect.height + 2 * parentPadding
    }px; left:${cardBodyRect.width + 9}px; top:${top - cardBodyRect.top}px;`;
    cardBody.appendChild(navline);

    const seperators = Array.from(cardBody.querySelectorAll('.embedSeperator'));
    seperators.forEach(seperator => {
      if (seperator.dataset.case === 'end') return;
      const endIndex = seperators.findIndex(
        el =>
          el.dataset.idPath === seperator.dataset.idPath &&
          el.dataset.case === 'end'
      );
      if (endIndex < 0) return;
      index += 1;
      const { top } = seperator.getBoundingClientRect();
      const { bottom } = seperators[endIndex].getBoundingClientRect();
      const navline = document.createElement('div');
      navline.className = `navline navline-${index}`;
      navline.id = 'navline_' + seperator.dataset.idPath;
      navline.dataset.idPath = seperator.dataset.idPath;
      navline.style = `height: ${
        bottom - top + extendTop + extendBottom
      }px; left:${cardBodyRect.width + 9}px; top:${
        top - cardBodyRect.top + parentPadding - extendTop //add parent padding
      }px;`;
      cardBody.appendChild(navline);
      index = index === 6 ? 0 : index;
    });
    return () => {};
  }, [
    changedEditorCounter,
    notebooks.byId[notebookId].embedPath,
    mdNotebooksPanel
  ]);

  if (!notebook) return <></>;
  return (
    <div className='card-body'>
      <div id={`notebookCardBody${notebookId}`} style={{ height: '100%' }}>
        {/* <NotebooksToolbar /> */}
        <ReactQuill
          ref={setNotebookRef}
          onChange={onChangeHandler}
          defaultValue={quillValue}
          theme='bubble'
          modules={{
            //'#notebooksToolbar'
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              // [{ size: ['small', false, 'large'] }],
              ['bold', 'italic', 'underline', 'annotation'],
              [{ color: [] }, { background: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ align: [] }]
            ],
            history: {
              delay: 1000,
              maxStack: 100
            },
            mention: mentionModule
          }}
          placeholder='Add your notes...'
          sanitize='true'
        />
      </div>
      {/* <span>Spinner or check saved</span> */}
    </div>
  );
};

export default NotebookPanel;
