import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';
import dagre from 'dagre';
import TextNode from './CustomNodes/TextNode';
import SectionNode from './CustomNodes/SectionNode';
import AnnotationNode from './CustomNodes/AnnotationNode';
import ReplyNode from './CustomNodes/ReplyNode';
import NoteNode from './CustomNodes/NoteNode';
import FlowchartSidepanel from './Sidepanel/';
import {
  toggleFlowchart,
  setFlowchartElements,
  setNonLayoutedFlowchartElements
} from '../../../../store/actions';
// 2do: dimensions depending on type and content
const NODE_WIDTH = 200;
const NODE_HEIGHT = 50;

// let initialElements = [{
//     name: '2',
//     label: 'El 2',
//     links: [{ name: '3' }, { name: '4' }]
//   }];

const generateFlow = (elements, strictSearchResults) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'TB',
    ranksep: 200,
    align: 'DR',
    ranker: 'tight-tree'
  });
  g.setDefaultEdgeLabel(function () {
    return {};
  });
  console.log('elements', elements);
  elements.forEach(e => {
    g.setNode(e.name, {
      label: e.label,
      notype: e.type,
      className: e.className,
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    });
    e.links.forEach(i => {
      g.setEdge(e.name, i.name);
    });
  });

  // 2do check whether can be adjusted if just one new node is added instead of beeing recreated from scratch.
  dagre.layout(g);

  const nodes = g.nodes().map(i => {
    let n = g.node(i);
    return {
      id: i,
      type: n.notype,
      data: {
        label: n.label,
        width: n.width,
        height: n.height
      },
      className: n.className,
      width: n.width,
      height: n.height,
      position: {
        x: n.x - n.width / 2,
        y: n.y - n.height / 2
      }
    };
  });
  console.log('g.edges()', g.edges());
  const edges = g.edges().map(e => {
    const incoming = (strictSearchResults || []).includes(e.v);
    const outgoing = (strictSearchResults || []).includes(e.w);
    const selectionType = !strictSearchResults
      ? 'null'
      : incoming && outgoing
      ? 'two-way'
      : incoming
      ? 'incoming'
      : outgoing
      ? 'outgoing'
      : 'none';
    return {
      id: `__${e.v}__${e.w}`,
      points: g.edge(e).points,
      source: e.w,
      target: e.v,
      className: `selection-${selectionType}`,
      data: { selection: selectionType },
      type: 'smoothedge',
      ...(strictSearchResults && selectionType !== 'none'
        ? {
            animated: false
          }
        : {
            animated: false
          })
    };
  });
  console.log('nodes', nodes, 'edges', edges);
  return [...nodes, ...edges];
};

let flowchartInstance = null;
const onLoad = reactFlowInstance => {
  flowchartInstance = reactFlowInstance;
  reactFlowInstance.fitView({ padding: 0 });
};

const miniMapSwitch = node => {
  switch (node.type) {
    case 'text':
      return `rgba(12, 100, 16, ${
        node.className.includes('non-match') ? 0.3 : 1
      })`;
    case 'section':
      return `rgba(198, 235, 210, ${
        node.className.includes('non-match') ? 0.3 : 1
      })`;
    case 'annotation':
      return `rgba(209, 54, 106, ${
        node.className.includes('non-match') ? 0.3 : 1
      })`;
    case 'reply':
      return `rgba(209, 209, 209, ${
        node.className.includes('non-match') ? 0.3 : 1
      })`;
    case 'note':
      return `rgba(197, 73, 24, ${
        node.className.includes('non-match') ? 0.2 : 1
      })`;
    default:
      return '#ccc';
  }
};

// 2do allow scrolling
const Flowchart = () => {
  const dispatch = useDispatch();

  const sections = useSelector(s => s.sections);
  const texts = useSelector(s => s.texts);
  const notes = useSelector(s => s.notes);
  const flowchartIsOpen = useSelector(s => s.panel.flowchartIsOpen);
  const inspectIsOpen = useSelector(s => s.panel.inspectIsOpen);
  const elements = useSelector(s => s.inspect.elements);
  const nonLayoutedElements = useSelector(s => s.inspect.nonLayoutedElements);
  const strictSearchResults = useSelector(s => s.inspect.strictSearchResults);
  const displayNonMatches = useSelector(s => s.inspect.displayNonMatches);
  const filterTypes = useSelector(s => s.inspect.filterTypes);
  const filterAncestors = useSelector(s => s.inspect.filterAncestors);
  const filterDescendants = useSelector(s => s.inspect.filterDescendants);

  useEffect(
    () => {
      // 2do: only trigger update when necessary
      // if (!flowchartIsOpen) return;
      const connectedTexts = Object.keys(texts).map(id => ({
        name: id,
        type: 'text',
        className: 'flowchartText',
        label: texts[id].title,
        links: [
          ...texts[id].sectionIds.map(id => ({ name: id })),
          ...(filterTypes.includes('sections')
            ? []
            : texts[id].directConnections.map(c => ({ name: c.resId })))
        ]
      }));
      const connectedSections = Object.keys(sections).map(id => ({
        name: id,
        type: 'section',
        className: 'flowchartSection',
        label: sections[id].title,
        links: [
          ...sections[id].directConnections.map(c => ({ name: c.resId })),
          ...sections[id].noteIds.map(id => ({ name: id }))
        ]
      }));
      const connectedNotes = Object.keys(notes).map(id => {
        const note = notes[id];
        console.log('note', note);
        return {
          name: id,
          type: note.isAnnotation
            ? 'annotation'
            : note.isReply
            ? 'reply'
            : 'note',
          className: 'flowchartNote',
          label: note.title,
          links: [
            ...note.directConnections.map(c => ({ name: c.resId })),
            ...note.replies.map(id => ({ name: id }))
          ]
        };
      });
      dispatch(
        setNonLayoutedFlowchartElements([
          ...connectedTexts,
          ...connectedSections,
          ...connectedNotes
        ])
      );
      return () => {};
    },
    // [flowchartIsOpen]
    [sections, texts, notes, filterTypes]
  );

  useEffect(() => {
    // displayNonMatches,
    // searchWithinTextcontent,
    // filterTypes,
    // filterAncestors,
    // filterDescendants
    // console.log('nonLayoutedElements', nonLayoutedElements);
    // console.log('strictSearchResults', strictSearchResults);
    // make sure no link is made to non existent
    console.log('nonLayoutedElements', nonLayoutedElements);
    console.log('strictSearchResults', strictSearchResults);
    let filteredElements;
    if (strictSearchResults.length > 0) {
      if (displayNonMatches) {
        filteredElements = nonLayoutedElements.map(el => ({
          ...el,
          className: strictSearchResults.includes(el.name)
            ? el.className + ' match'
            : el.className + ' non-match',
          links: el.links.filter(link =>
            nonLayoutedElements.some(el => el.name === link.name)
          )
        }));
      } else {
        filteredElements = nonLayoutedElements
          .filter(el => strictSearchResults.includes(el.name))
          .map(el => ({
            ...el,
            links: el.links.filter(link =>
              strictSearchResults.includes(link.name)
            )
          }));
      }
    } else {
      filteredElements = nonLayoutedElements.map(el => ({
        ...el,
        links: el.links.filter(link =>
          nonLayoutedElements.some(el => el.name === link.name)
        )
      }));
    }
    console.log('filteredElements', filteredElements);
    dispatch(
      setFlowchartElements(
        generateFlow(
          filteredElements,
          strictSearchResults.length > 0 ? strictSearchResults : null
        )
      )
    );
    return () => {};
  }, [
    nonLayoutedElements,
    strictSearchResults,
    displayNonMatches,
    filterTypes,
    filterAncestors,
    filterDescendants
  ]);

  return (
    <div className={`row growContent flex-row flowchart-container`}>
      <div className={`col-${inspectIsOpen ? '8' : '12'} flowchart-area`}>
        <ReactFlow
          key='reactFlowchartMainComponent'
          onLoad={onLoad}
          elements={elements}
          nodeTypes={{
            text: TextNode,
            section: SectionNode,
            annotation: AnnotationNode,
            reply: ReplyNode,
            note: NoteNode
          }}
          // onElementClick={e => console.log(e)}
          onSelectionChange={e => console.log(e)}
          minZoom={0.15}
        >
          <Controls />
          <MiniMap nodeColor={miniMapSwitch} />
          <Background variant='dots' gap={50} size={0.7} />
        </ReactFlow>
      </div>
      {inspectIsOpen && (
        <FlowchartSidepanel flowchartInstance={flowchartInstance} />
      )}
    </div>
  );
};
export default Flowchart;
