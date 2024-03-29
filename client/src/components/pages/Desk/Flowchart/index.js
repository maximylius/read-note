import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';
import dagre from 'dagre';
import StandardNode from './CustomNodes/StandardNode';
import FlowchartSidepanel from './Sidepanel/';
import {
  setFlowchartElements,
  setNonLayoutedFlowchartElements,
  inspectElementInFlowchart
} from '../../../../store/actions';
import FullFlowchartToolbar from './FullFlowchartToolbar';
const TextNode = StandardNode;
const SectionNode = StandardNode;
const AnnotationNode = StandardNode;
const ReplyNode = StandardNode;
const NoteNode = StandardNode;

const calcNodeDimensions = (resType, nConnections, isInspected) => {
  // 2do: dimensions depending on type and content
  // if (isInspected) {
  //   const INSPECT_WIDTH = 700;
  //   const MIN_INSPECT_HEIGHT = 300;
  //   const INSPECT_HEIGHT = Math.max(
  //     document.documentElement.clientHeight || 0,
  //     window.innerHeight || 0,
  //     MIN_INSPECT_HEIGHT
  //   );
  //   return {
  //     width: INSPECT_WIDTH,
  //     height: INSPECT_HEIGHT
  //   };
  // }
  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 60;

  const rMult = resType === 'section' ? 0.75 : resType === 'text' ? 1.5 : 1;
  const cMult = Math.max(0.8, nConnections);

  return {
    width: NODE_WIDTH * Math.pow(cMult * rMult, 1 / 4),
    height: NODE_HEIGHT * Math.pow(cMult * rMult, 1 / 2)
  };
};

const generateFlow = (elements, strictSearchResults, inspectElements) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'TB',
    ranksep: 200,
    // align: 'DR',
    ranker: 'network-simplex' || 'tight-tree' || 'longest-path',
    minlen: 3,
    acyclicer: 'greedy'
  });
  g.setDefaultEdgeLabel(function () {
    return {};
  });
  console.log('elements', elements);
  elements.forEach(e => {
    const isInspected = inspectElements.some(el => el.resId === e.name);
    g.setNode(e.name, {
      label: e.label,
      notype: e.type,
      className: e.className,
      width: calcNodeDimensions(e.type, e.nConnections, isInspected).width,
      height: calcNodeDimensions(e.type, e.nConnections, isInspected).height
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
    const incoming = (strictSearchResults || []).some(ele => ele.resId === e.v);
    const outgoing = (strictSearchResults || []).some(ele => ele.resId === e.w);
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
      type: 'smoothedge'
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
  const inspectElements = useSelector(s => s.inspect.inspectElements);
  const displayNonMatches = useSelector(s => s.inspect.displayNonMatches);
  const filterTypes = useSelector(s => s.inspect.filterTypes);
  const filterAncestors = useSelector(s => s.inspect.filterAncestors);
  const filterDescendants = useSelector(s => s.inspect.filterDescendants);
  const elementClickHandler = (event, elem) => {
    dispatch(inspectElementInFlowchart(elem.id, elem.type));
  };

  useEffect(
    () => {
      // 2do: only trigger update when necessary
      const connectedTexts = !filterTypes.includes('texts')
        ? []
        : Object.keys(texts).map(id => ({
            name: id,
            type: 'text',
            className: 'flowchartText',
            label: texts[id].title,
            links: [
              ...texts[id].sectionIds.map(id => ({ name: id })),
              ...(filterTypes.includes('sections')
                ? []
                : texts[id].directConnections.map(c => ({ name: c.resId })))
            ],
            nConnections:
              texts[id].directConnections.length +
              texts[id].indirectConnections.length +
              texts[id].sectionIds.length / 2
          }));
      const connectedSections = !filterTypes.includes('sections')
        ? []
        : Object.keys(sections).map(id => ({
            name: id,
            type: 'section',
            className: 'flowchartSection',
            label: sections[id].title,
            links: [
              ...sections[id].directConnections.map(c => ({ name: c.resId })),
              ...sections[id].noteIds.map(id => ({ name: id }))
            ],
            nConnections:
              sections[id].directConnections.length +
              sections[id].indirectConnections.length
          }));
      const connectedNotes = Object.keys(notes)
        .filter(id =>
          notes[id].isAnnotation
            ? filterTypes.includes('annotations')
            : notes[id].isReply
            ? filterTypes.includes('replies')
            : filterTypes.includes('notes')
        )
        .map(id => {
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
              ...note.directConnections.map(c => ({
                name:
                  c.resType === 'section' &&
                  !connectedSections.some(el => el.name === c.resId) &&
                  sections[c.resId]
                    ? sections[c.resId].textId
                    : c.resId
              })),
              ...note.replies.map(id => ({ name: id }))
            ],
            nConnections:
              note.directConnections.length +
              note.indirectConnections.length +
              note.replies.length
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
    let filteredElements;
    if (strictSearchResults.length > 0) {
      if (displayNonMatches) {
        filteredElements = nonLayoutedElements.map(el => ({
          ...el,
          className: strictSearchResults.some(ele => ele.resId === el.name)
            ? el.className + ' match'
            : el.className + ' non-match',
          links: el.links.filter(link =>
            nonLayoutedElements.some(ele => ele.name === link.name)
          )
        }));
      } else {
        filteredElements = nonLayoutedElements
          .filter(el => strictSearchResults.some(ele => ele.resId === el.name))
          .map(el => ({
            ...el,
            links: el.links.filter(link =>
              strictSearchResults.some(ele => ele.resId === link.name)
            )
          }));
      }
    } else {
      filteredElements = nonLayoutedElements.map(el => ({
        ...el,
        links: el.links.filter(link =>
          nonLayoutedElements.some(ele => ele.name === link.name)
        )
      }));
    }
    console.log('filteredElements', filteredElements);
    dispatch(
      setFlowchartElements(
        generateFlow(
          filteredElements,
          strictSearchResults.length > 0 ? strictSearchResults : null,
          inspectElements
        )
      )
    );
    return () => {};
  }, [
    nonLayoutedElements,
    strictSearchResults,
    inspectElements,
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
          onElementClick={elementClickHandler}
          onSelectionChange={e => console.log(e)}
          minZoom={0.15}
        >
          <Controls />
          <MiniMap nodeColor={miniMapSwitch} />
          <Background variant='dots' gap={80} size={0.5} />
        </ReactFlow>
      </div>
      {inspectIsOpen ? (
        <FlowchartSidepanel flowchartInstance={flowchartInstance} />
      ) : (
        <FullFlowchartToolbar />
      )}
    </div>
  );
};
export default Flowchart;
