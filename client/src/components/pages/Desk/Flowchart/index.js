import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';
import dagre from 'dagre';
import TextNode from './CustomNodes/TextNode';
import SectionNode from './CustomNodes/SectionNode';
import AnnotationNode from './CustomNodes/AnnotationNode';
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
  const edges = g.edges().map(e => ({
    id: `__${e.v}__${e.w}`,
    points: g.edge(e).points,
    source: e.w,
    target: e.v,
    ...(strictSearchResults &&
    [e.w, e.v].some(el => strictSearchResults.includes(el))
      ? {
          style: {
            stroke: 'rgb(255, 46, 143)',
            strokeWidth: '4'
          },
          animated: false
        }
      : {
          style: {
            stroke: 'rgba(0,0,0,0.15)'
          },

          animated: false
        })
  }));
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
      return `rgba(18, 44, 90, ${
        node.className.includes('customOpacity') ? 0.3 : 1
      })`;
    case 'section':
      return `rgba(64, 87, 126, ${
        node.className.includes('customOpacity') ? 0.3 : 1
      })`;
    case 'annotation-note':
      return `rgba(243, 165, 195, ${
        node.className.includes('customOpacity') ? 0.3 : 1
      })`;
    case 'note':
      return `rgba(236, 133, 101, ${
        node.className.includes('customOpacity') ? 0.2 : 1
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
  const isOpen = useSelector(s => s.flowchart.isOpen);
  const sidepanelOpen = useSelector(s => s.flowchart.sidepanelOpen);
  const elements = useSelector(s => s.flowchart.elements);
  const nonLayoutedElements = useSelector(s => s.flowchart.nonLayoutedElements);
  const strictSearchResults = useSelector(s => s.flowchart.strictSearchResults);
  const displayNonMatches = useSelector(s => s.flowchart.displayNonMatches);
  const filterTypes = useSelector(s => s.flowchart.filterTypes);
  const filterAncestors = useSelector(s => s.flowchart.filterAncestors);
  const filterDescendants = useSelector(s => s.flowchart.filterDescendants);

  const openFlowchart = () => {
    dispatch(toggleFlowchart());
    setTimeout(() => {
      flowchartInstance.fitView();
    }, 30);
  };

  useEffect(
    () => {
      // 2do: only trigger update when necessary
      // if (!isOpen) return;
      const connectedTexts = Object.keys(texts).map(id => ({
        name: id,
        type: 'text',
        className: 'flowchartText',
        label: texts[id].title,
        links: texts[id].sectionIds.map(id => ({ name: id }))
      }));
      const connectedSections = Object.keys(sections).map(id => ({
        name: id,
        type: 'section',
        className: 'flowchartSection',
        label: sections[id].title,
        links: sections[id].directConnections.map(el => ({ name: el.resId }))
      }));
      const connectedNotes = Object.keys(notes).map(id => {
        const note = notes[id];
        console.log('note', note);
        return {
          name: id,
          type: note.isAnnotation ? 'annotation-note' : 'note',
          className: 'flowchartNote',
          label: note.title,
          links: note.directConnections.map(el => ({ name: el.resId }))
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
    // [isOpen]
    [sections, texts, notes]
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
            ? el.className
            : el.className + ' customOpacity',
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
    <div
      {...(!isOpen && { onClick: openFlowchart })}
      className={`row flowchartContainer ${
        isOpen ? 'flowchartOpen' : 'flowchartPreview'
      }`}
    >
      <div
        className={`col${isOpen && sidepanelOpen ? '-9' : '-12'} flowchartArea`}
      >
        <ReactFlow
          key='reactFlowchartMainComponent'
          onLoad={onLoad}
          elements={elements}
          nodeTypes={{
            text: TextNode,
            annotation: AnnotationNode,
            section: SectionNode,
            note: NoteNode
          }}
          // onElementClick={e => console.log(e)}
          onSelectionChange={e => console.log(e)}
          isInteractive={isOpen}
          minZoom={0.15}
        >
          {isOpen && (
            <>
              <Controls />
              <MiniMap nodeColor={miniMapSwitch} />
              <Background variant='dots' gap={50} size={0.7} />
            </>
          )}
        </ReactFlow>
      </div>
      {isOpen && sidepanelOpen && (
        <FlowchartSidepanel flowchartInstance={flowchartInstance} />
      )}
    </div>
  );
};
export default Flowchart;
