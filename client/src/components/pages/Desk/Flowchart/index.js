import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import dagre from 'dagre';
import TextNode from './CustomNodes/TextNode';
import SectionNode from './CustomNodes/SectionNode';
import AnnotationNode from './CustomNodes/AnnotationNode';
import NotebookNode from './CustomNodes/NotebookNode';
import FlowchartSidepanel from './Sidepanel/';
import { toggleFlowchart } from '../../../../store/actions';
// 2do: dimensions depending on type and content
const NODE_WIDTH = 200;
const NODE_HEIGHT = 50;

let initialElements = [
  {
    name: '4',
    label: 'El 4',
    links: []
  },
  {
    name: '0',
    label: 'El 0',
    links: [{ name: '1' }]
  },
  {
    name: '1',
    label: 'El 1',
    links: []
  },
  {
    name: '2',
    label: 'El 2',
    links: [{ name: '3' }, { name: '4' }]
  },
  {
    name: '3',
    label: 'El 3',
    links: [{ name: '4' }]
  }
];

const generateFlow = elements => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({});
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  elements.forEach(e => {
    g.setNode(e.name, {
      label: e.label,
      type: e.type,
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
      type: n.type,
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

  const edges = g.edges().map(e => ({
    id: `__${e.v}__${e.w}`,
    points: g.edge(e).points,
    source: e.w,
    target: e.v,
    animated: false
  }));

  return [...nodes, ...edges];
};

let flowchartInstance = null;
const onLoad = reactFlowInstance => {
  console.log(reactFlowInstance, 'reactFlowInstance');
  flowchartInstance = reactFlowInstance;
  reactFlowInstance.fitView({ padding: 0 });
};

const miniMapSwitch = node => {
  switch (node.type) {
    case 'text':
      return 'rgb(18, 44, 90)';
    case 'section':
      return 'rgb(64, 87, 126)';
    case 'annotation':
      return 'rgb(243, 165, 195)';
    case 'notebook':
      return 'rgb(236, 133, 101)';
    default:
      return '#ccc';
  }
};

// 2do allow scrolling
const Flowchart = () => {
  const dispatch = useDispatch();
  const {
    sections,
    annotations,
    texts,
    notebooks,
    flowchart: { isOpen, sidepanelOpen }
  } = useSelector(state => state);
  const [elements, setElements] = React.useState([]);

  const openFlowchart = () => {
    dispatch(toggleFlowchart());
    setTimeout(() => {
      flowchartInstance.fitView();
    }, 30);
  };

  React.useEffect(
    () => {
      // 2do: only trigger update when necessary
      // if (!isOpen) return;
      const textConnections = Object.keys(texts.byId).map(id => ({
        name: id,
        type: 'text',
        className: 'flowchartText',
        label: texts.byId[id].title,
        links: texts.byId[id].sectionIds.map(id => ({ name: id }))
      }));
      const sectionConnections = Object.keys(sections.byId).map(id => ({
        name: id,
        type: 'section',
        className: 'flowchartSection',
        label: sections.byId[id].title,
        links: sections.byId[id].annotationIds.map(id => ({ name: id }))
      }));
      const annotationConnections = Object.keys(annotations.byId).map(id => ({
        name: id,
        type: 'annotation',
        className: 'flowchartAnnotation',
        label: annotations.byId[id].plainText.slice(0, 20) + '...',
        links: annotations.byId[id].connectedWith.map(id => ({ name: id }))
      }));
      const notebookConnections = Object.keys(notebooks.byId).map(id => ({
        name: id,
        type: 'notebook',
        className: 'flowchartNotebook',
        label: notebooks.byId[id].title,
        links: []
      }));
      let to = [
        ...textConnections,
        ...sectionConnections,
        ...annotationConnections,
        ...notebookConnections
      ];
      // make sure no link is made to non existent
      console.log(to);
      to = to.map(el => ({
        ...el,
        links: el.links.filter(link => to.some(t => t.name === link.name))
      }));
      console.log(to);
      setElements(generateFlow(to));
      return () => {};
    },
    [isOpen]
    // [sections, texts, notebooks, annotations]
  );
  return (
    // <ReactFlow elements={elements} key='feq3g36e56gtdzvetd' />
    <div
      {...(!isOpen && { onClick: openFlowchart })}
      className={`row flowchart ${
        isOpen ? 'flowchartOpen' : 'flowchartPreview'
      }`}
    >
      <div className={`col${isOpen && sidepanelOpen ? '-9' : '-12'}`}>
        <ReactFlow
          onLoad={onLoad}
          elements={elements}
          nodeTypes={{
            text: TextNode,
            annotation: AnnotationNode,
            section: SectionNode,
            notebook: NotebookNode
          }}
          // onElementClick={e => console.log(e)}
          onSelectionChange={e => console.log(e)}
          isInteractive={isOpen}
          minZoom={0.1}
        >
          {/* {isOpen && (
            <>
              <Controls />
              <MiniMap nodeColor={miniMapSwitch} />
            </>
          )} */}
        </ReactFlow>
      </div>
      {isOpen && sidepanelOpen && (
        <FlowchartSidepanel flowchartInstance={flowchartInstance} />
      )}
    </div>
  );
};
export default Flowchart;
