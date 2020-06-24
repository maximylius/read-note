import dagre from 'dagre';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 50;

const elements = [
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
  },
  {
    name: '4',
    label: 'El 4',
    width: '100px',
    height: '50px'
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
      label: e.name,
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    });
    e.links.forEach(i => {
      g.setEdge(e.name, i.name);
    });
  });

  dagre.layout(g);

  const nodes = g.nodes().map(i => {
    let n = g.node(i);
    return {
      id: i,
      data: {
        label: i
      },
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
    animated: true
  }));

  return [...nodes, ...edges];
};
