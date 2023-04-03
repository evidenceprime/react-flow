import { useState, MouseEvent } from 'react';
import { debounce } from 'lodash';

import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Node,
  Elements,
  OnLoadParams,
  SnapGrid,
  Connection,
  Edge,
  ReactFlowProvider,
} from 'react-flow-renderer';

const onPaneScroll = (event?: MouseEvent) => console.log('pane scroll', event);
const onLoad = (reactFlowInstance: OnLoadParams) => {
  reactFlowInstance.fitView();
};

const initialElements: Elements = [
  {
    id: '1',
    type: 'unidirectional',
    data: {
      label: 'Omnidirectional block',
      borderColor: '#000',
      background: '#ddd',
    },
    position: { x: 0, y: 100 },
  },
  {
    id: '2',
    type: 'unidirectional',
    data: {
      label: 'Omnidirectional block, resizable and non-movable',
      borderColor: '#000',
      background: '#b5a0cf',
      lockPosition: true,
    },
    position: { x: 0, y: 300 },
  },
  {
    id: 'section1',
    type: 'section',
    data: { label: 'movable section' },
    position: { x: -250, y: -200 },
  },
  {
    id: 'section2',
    type: 'section',
    data: {
      label: 'resizable section, non-movable',
      lockPosition: true,
      height: '500px',
      background: '#DDD',
    },
    position: { x: -250, y: 100 },
  },
];

const connectionLineStyle: any = { stroke: '#ddd' };
const snapGrid: SnapGrid = [16, 16];

const nodeStrokeColor = (n: Node): string => {
  if (n.style?.background) return n.style.background as string;
  if (n.type === 'input') return '#0041d0';
  if (n.type === 'output') return '#ff0072';
  if (n.type === 'default') return '#1a192b';

  return '#eee';
};

const nodeColor = (n: Node): string => {
  if (n.style?.background) return n.style.background as string;

  return '#fff';
};

const OverviewFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove: Elements) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlowProvider>
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onPaneScroll={onPaneScroll}
        onLoad={onLoad}
        connectionLineStyle={connectionLineStyle}
        snapToGrid={true}
        snapGrid={snapGrid}
        paneMoveable={false}
        minZoom={1}
        maxZoom={1}
        onNodeResize={debounce((node, dimensions) => console.log(dimensions), 500)}
        onSectionResize={debounce((section, dimensions) => console.log(section, dimensions), 500)}
      >
        <MiniMap nodeStrokeColor={nodeStrokeColor} nodeColor={nodeColor} nodeBorderRadius={2} />
        <Controls />
        <Background color="#aaa" gap={20} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default OverviewFlow;
