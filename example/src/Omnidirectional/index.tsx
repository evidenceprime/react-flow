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

const onPaneScroll = (event?: MouseEvent) => {};
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
      background: '#fff',
    },
    position: { x: 300, y: 100 },
  },
  {
    id: '2',
    type: 'unidirectional',
    data: {
      label: 'LINK',
      hyperlink: 'https://example.org',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 300, y: 400 },
  },
  {
    id: '3',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'rounded node',
      borderColor: '#f0f',
      background: '#000',
      fontColor: '#fff',
    },
    position: { x: 100, y: 0 },
  },
  {
    id: '4',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in nisi orci. Mauris faucibus nunc sagittis magna iaculis porttitor. Vestibulum sed pulvinar libero. In tincidunt cursus dolor at tristique. Praesent pellentesque rhoncus massa, a blandit magna efficitur ornare. Nam a luctus odio, at ultrices ante. Suspendisse sodales ullamcorper mi in finibus.',
      borderColor: '#f0f',
      background: '#000',
      fontColor: '#fff',
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
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'Left',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 300, y: 800 },
  },
  {
    id: '7',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'Right',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 500, y: 800 },
  },
  {
    id: '8',
    type: 'unidirectional',
    data: {
      shape: 'rectangle',
      label: 'Top',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 300, y: 500 },
  },
  {
    id: '9',
    type: 'unidirectional',
    data: {
      shape: 'rectangle',
      label: 'Bottom',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 300, y: 598 },
  },
  {
    id: '10',
    type: 'breakpoint',
    data: {},
    position: { x: 600, y: 620 },
  },
  {
    id: '11',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'TOP',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 850, y: 100 },
  },
  {
    id: '12',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'BOTTOM',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 850, y: 300 },
  },
  {
    id: '13',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'LEFT',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 700, y: 200 },
  },
  {
    id: '14',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'RIGHT',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 1000, y: 200 },
  },
  {
    id: '15',
    type: 'breakpoint',
    data: {},
    position: { x: 926, y: 222 },
  },
  {
    id: '16',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'TOP from breakpoint',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 850, y: 400 },
  },
  {
    id: '17',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'BOTTOM from breakpoint',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 850, y: 600 },
  },
  {
    id: '18',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'LEFT from breakpoint',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 700, y: 500 },
  },
  {
    id: '19',
    type: 'unidirectional',
    data: {
      shape: 'rounded',
      label: 'RIGHT from breakpoint',
      borderColor: '#000',
      background: '#fff',
    },
    position: { x: 1000, y: 500 },
  },
  {
    id: '20',
    type: 'breakpoint',
    data: {},
    position: { x: 926, y: 522 },
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
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e1-2-2',
    source: '1',
    target: '2',
    targetHandle: Position.TopLeft,
    sourceHandle: Position.BottomLeft,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e1-2-3',
    source: '2',
    target: '1',
    targetHandle: Position.BottomRight,
    sourceHandle: Position.TopRight,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
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
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    targetHandle: Position.Top,
    sourceHandle: Position.Bottom,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e5-4',
    source: '5',
    target: '4',
    targetHandle: Position.LeftTop,
    sourceHandle: Position.Bottom,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    targetHandle: Position.Left,
    sourceHandle: Position.Right,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e6-7-2',
    source: '6',
    target: '7',
    targetHandle: Position.LeftTop,
    sourceHandle: Position.RightTop,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e7-6',
    source: '7',
    target: '6',
    targetHandle: Position.RightBottom,
    sourceHandle: Position.LeftBottom,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e5-1',
    source: '5',
    target: '1',
    targetHandle: Position.Left,
    sourceHandle: Position.Right,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e8-10',
    source: '8',
    target: '10',
    targetHandle: Position.Top,
    sourceHandle: Position.Right,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e10-9',
    source: '10',
    target: '9',
    targetHandle: Position.Right,
    sourceHandle: Position.Left,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e11-15',
    source: '11',
    target: '15',
    targetHandle: Position.Top,
    sourceHandle: Position.Bottom,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e12-15',
    source: '12',
    target: '15',
    targetHandle: Position.Bottom,
    sourceHandle: Position.Top,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e13-15',
    source: '13',
    target: '15',
    targetHandle: Position.Left,
    sourceHandle: Position.Right,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e14-15',
    source: '14',
    target: '15',
    targetHandle: Position.Right,
    sourceHandle: Position.Left,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e20-16',
    source: '20',
    target: '16',
    targetHandle: Position.Bottom,
    sourceHandle: Position.Top,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e20-17',
    source: '20',
    target: '17',
    targetHandle: Position.Top,
    sourceHandle: Position.Bottom,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e20-18',
    source: '20',
    target: '18',
    targetHandle: Position.Right,
    sourceHandle: Position.Left,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
  {
    id: 'e20-19',
    source: '20',
    target: '19',
    targetHandle: Position.Left,
    sourceHandle: Position.Right,
    type: 'smoothstep',
    arrowHeadType: ArrowHeadType.DoubleArrow,
  },
];

const connectionLineStyle: any = { stroke: '#ddd' };
const snapGrid: SnapGrid = [1, 1];

const OmnidirectionalFlow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove: Elements) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) =>
    setElements((els) =>
      addEdge({ ...params, type: 'smoothstep', arrowHeadType: ArrowHeadType.DoubleArrow }, els)
    );

  const diagramContainerStyle = {
    height: '1000px',
    width: '1500px',
    overflow: 'auto',
    border: '1px solid #000',
  };

  return (
    <div>
      <div style={diagramContainerStyle}>
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
      </div>
    </div>
  );
};

export default OmnidirectionalFlow;
