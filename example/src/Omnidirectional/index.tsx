import { useState, MouseEvent } from 'react';

import ReactFlow, {
  removeElements,
  addEdge,
  Elements,
  OnLoadParams,
  SnapGrid,
  Connection,
  Edge,
  ReactFlowProvider,
  ConnectionMode,
  Position,
  ArrowHeadType,
} from 'react-flow-renderer';

const onPaneScroll = (event?: MouseEvent) => console.log('pane scroll', event);
const onLoad = (reactFlowInstance: OnLoadParams) => {
  reactFlowInstance.fitView();
};

const initialElements: Elements = [
  {
    id: '1',
    type: 'omnidirectional',
    data: {
      label: 'Omnidirectional block',
      borderColor: '#000',
      background: '#fff'
    },
    position: { x: 300, y: 100 },
  },
  {
    id: '2',
    type: 'omnidirectional',
    data: {
      label: 'LINK',
      hyperlink: 'https://example.org',
      borderColor: '#000',
      background: '#fff'
    },
    position: { x: 300, y: 400 },
  },
  {
    id: '3',
    type: 'omnidirectional',
    data: {
      shape: 'rounded',
      label: 'rounded node',
      borderColor: '#f0f',
      background: '#000',
      fontColor: '#fff'
    },
    position: { x: 100, y: 0 },
  },
  {
    id: '4',
    type: 'omnidirectional',
    data: {
      shape: 'rounded',
      label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in nisi orci. Mauris faucibus nunc sagittis magna iaculis porttitor. Vestibulum sed pulvinar libero. In tincidunt cursus dolor at tristique. Praesent pellentesque rhoncus massa, a blandit magna efficitur ornare. Nam a luctus odio, at ultrices ante. Suspendisse sodales ullamcorper mi in finibus.',
      borderColor: '#f0f',
      background: '#000',
      fontColor: '#fff'
    },
    position: { x: 100, y: 600 },
  },
  {
    id: '5',
    type: 'breakpoint',
    data: {},
    position: { x: 0, y: 100 },
  },
  {
    id: '6',
    type: 'omnidirectional',
    data: {
      shape: 'rounded',
      label: 'Left',
      borderColor: '#000',
      background: '#fff'
    },
    position: { x: 300, y: 800 },
  },
  {
    id: '7',
    type: 'omnidirectional',
    data: {
      shape: 'rounded',
      label: 'Right',
      borderColor: '#000',
      background: '#fff'
    },
    position: { x: 500, y: 800 },
  },
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: 'this is an edge label',
    targetHandle: Position.Top,
    sourceHandle: Position.Bottom,
    type: 'smoothstep',
    labelXYOffset: { x: 0, y: -50 },
    arrowHeadType: ArrowHeadType.DoubleArrow
  },
  {
    id: 'e1-2-2',
    source: '1',
    target: '2',
    targetHandle: Position.TopLeft,
    sourceHandle: Position.BottomLeft,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow
  },
  {
    id: 'e1-2-3',
    source: '2',
    target: '1',
    targetHandle: Position.BottomRight,
    sourceHandle: Position.TopRight,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    label: 'this is the ultimate edge label',
    targetHandle: Position.Top,
    sourceHandle: Position.Bottom,
    type: 'smoothstep',
    labelXYOffset: { x: 0, y: 200 },
    arrowHeadType: ArrowHeadType.DoubleArrow
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    targetHandle: Position.Top,
    sourceHandle: Position.Bottom,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow
  },
  {
    id: 'e5-4',
    source: '5',
    target: '4',
    targetHandle: Position.LeftTop,
    sourceHandle: Position.Bottom,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    targetHandle: Position.Left,
    sourceHandle: Position.Right,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow
  },
  {
    id: 'e6-7-2',
    source: '6',
    target: '7',
    targetHandle: Position.LeftTop,
    sourceHandle: Position.RightTop,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow
  },
  {
    id: 'e7-6',
    source: '7',
    target: '6',
    targetHandle: Position.RightBottom,
    sourceHandle: Position.LeftBottom,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow
  },
  {
    id: 'e5-1',
    source: '5',
    target: '1',
    targetHandle: Position.Left,
    sourceHandle: Position.Right,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow
  },
];

const connectionLineStyle: any = { stroke: '#ddd' };
const snapGrid: SnapGrid = [1, 1];

const OmnidirectionalFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove =
    (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect =
    (params: Connection | Edge) => setElements((els) => addEdge({...params, type: 'smoothstep'}, els));

  return (
    <ReactFlowProvider>
      <ReactFlow
        connectionMode={ConnectionMode.Loose}
        elements={elements}
        onElementsRemove={onElementsRemove}
        deleteKeyCode={46}
        onConnect={onConnect}
        onPaneScroll={onPaneScroll}
        onLoad={onLoad}
        connectionLineStyle={connectionLineStyle}
        snapToGrid={true}
        snapGrid={snapGrid}
        paneMoveable={true}
        minZoom={1}
        maxZoom={4}
        onNodeResize={(section, dimensions) => console.log(dimensions)}
      />
    </ReactFlowProvider>
  );
};

export default OmnidirectionalFlow;
