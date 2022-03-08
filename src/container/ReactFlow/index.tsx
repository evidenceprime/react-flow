import React, {
  useMemo,
  CSSProperties,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  WheelEvent,
  forwardRef,
} from 'react';
import cc from 'classcat';

import GraphView from '../GraphView';
import ElementUpdater from '../../components/ElementUpdater';
import {
  DefaultNode,
  InputNode,
  OutputNode,
  UnidirectionalNode,
  BreakpointNode,
} from '../../components/Nodes';
import { createNodeTypes } from '../NodeRenderer/utils';
import DefaultSection from '../../components/Sections/DefaultSection';
import { createSectionTypes } from '../SectionRenderer/utils';
import SelectionListener from '../../components/SelectionListener';
import { BezierEdge, StepEdge, SmoothStepEdge, StraightEdge } from '../../components/Edges';
import { createEdgeTypes } from '../EdgeRenderer/utils';
import Wrapper from './Wrapper';
import {
  Elements,
  NodeTypesType,
  EdgeTypesType,
  SectionTypesType,
  OnLoadFunc,
  Node,
  Edge,
  Section,
  Connection,
  ConnectionMode,
  ConnectionLineType,
  ConnectionLineComponent,
  FlowTransform,
  OnConnectStartFunc,
  OnConnectStopFunc,
  OnConnectEndFunc,
  TranslateExtent,
  KeyCode,
  PanOnScrollMode,
  OnEdgeUpdateFunc,
  NodeExtent,
} from '../../types';

import '../../style.css';
import '../../theme-default.css';

const defaultNodeTypes = {
  input: InputNode,
  default: DefaultNode,
  output: OutputNode,
  unidirectional: UnidirectionalNode,
  breakpoint: BreakpointNode,
};

const defaultEdgeTypes = {
  default: BezierEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge,
};

const defaultSectionTypes = {
  default: DefaultSection,
  section: DefaultSection,
};

export interface ReactFlowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onLoad'> {
  elements: Elements;
  onElementClick?: (event: ReactMouseEvent, element: Node | Edge | Section) => void;
  onElementsRemove?: (elements: Elements) => void;
  onNodeDoubleClick?: (event: ReactMouseEvent, node: Node) => void;
  onNodeMouseEnter?: (event: ReactMouseEvent, node: Node | Section) => void;
  onNodeMouseMove?: (event: ReactMouseEvent, node: Node | Section) => void;
  onNodeMouseLeave?: (event: ReactMouseEvent, node: Node | Section) => void;
  onNodeContextMenu?: (event: ReactMouseEvent, node: Node) => void;
  onNodeDragStart?: (event: ReactMouseEvent, node: Node | Section) => void;
  onNodeDrag?: (event: ReactMouseEvent, node: Node | Section) => void;
  onNodeDragStop?: (event: ReactMouseEvent, node: Node | Section) => void;
  onConnect?: (connection: Edge | Connection) => void;
  onConnectStart?: OnConnectStartFunc;
  onConnectStop?: OnConnectStopFunc;
  onConnectEnd?: OnConnectEndFunc;
  onLoad?: OnLoadFunc;
  onMove?: (flowTransform?: FlowTransform) => void;
  onMoveStart?: (flowTransform?: FlowTransform) => void;
  onMoveEnd?: (flowTransform?: FlowTransform) => void;
  onSelectionChange?: (elements: Elements | null) => void;
  onSelectionDragStart?: (event: ReactMouseEvent, nodes: Node[]) => void;
  onSelectionDrag?: (event: ReactMouseEvent, nodes: Node[]) => void;
  onSelectionDragStop?: (event: ReactMouseEvent, nodes: Node[]) => void;
  onSelectionContextMenu?: (event: ReactMouseEvent, nodes: Node[]) => void;
  onPaneScroll?: (event?: WheelEvent) => void;
  onPaneClick?: (event: ReactMouseEvent) => void;
  onPaneContextMenu?: (event: ReactMouseEvent) => void;
  nodeTypes?: NodeTypesType;
  edgeTypes?: EdgeTypesType;
  sectionTypes?: SectionTypesType;
  connectionMode?: ConnectionMode;
  connectionLineType?: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  connectionLineComponent?: ConnectionLineComponent;
  deleteKeyCode?: KeyCode;
  selectionKeyCode?: KeyCode;
  multiSelectionKeyCode?: KeyCode;
  zoomActivationKeyCode?: KeyCode;
  snapToGrid?: boolean;
  snapGrid?: [number, number];
  onlyRenderVisibleElements?: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  elementsSelectable?: boolean;
  selectNodesOnDrag?: boolean;
  paneMoveable?: boolean;
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  defaultPosition?: [number, number];
  translateExtent?: TranslateExtent;
  preventScrolling?: boolean;
  nodeExtent?: NodeExtent;
  arrowHeadColor?: string;
  markerStartId?: string;
  markerEndId?: string;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  panOnScroll?: boolean;
  panOnScrollSpeed?: number;
  panOnScrollMode?: PanOnScrollMode;
  zoomOnDoubleClick?: boolean;
  onEdgeUpdate?: OnEdgeUpdateFunc;
  onEdgeContextMenu?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeMouseEnter?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeMouseMove?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeMouseLeave?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeDoubleClick?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeUpdateStart?: (event: ReactMouseEvent, edge: Edge) => void;
  onEdgeUpdateEnd?: (event: MouseEvent, edge: Edge) => void;
  onNodeResize: (section: Section, dimensions: object) => void;
  edgeUpdaterRadius?: number;
  nodeTypesId?: string;
  edgeTypesId?: string;
  sectionTypesId?: string;
}

export type ReactFlowRefType = HTMLDivElement;

const ReactFlow = forwardRef<ReactFlowRefType, ReactFlowProps>(
  (
    {
      elements = [],
      className,
      nodeTypes = defaultNodeTypes,
      edgeTypes = defaultEdgeTypes,
      sectionTypes = defaultSectionTypes,
      onElementClick,
      onLoad,
      onMove,
      onMoveStart,
      onMoveEnd,
      onElementsRemove,
      onConnect,
      onConnectStart,
      onConnectStop,
      onConnectEnd,
      onNodeMouseEnter,
      onNodeMouseMove,
      onNodeMouseLeave,
      onNodeContextMenu,
      onNodeDoubleClick,
      onNodeDragStart,
      onNodeDrag,
      onNodeDragStop,
      onSelectionChange,
      onSelectionDragStart,
      onSelectionDrag,
      onSelectionDragStop,
      onSelectionContextMenu,
      connectionMode = ConnectionMode.Strict,
      connectionLineType = ConnectionLineType.Bezier,
      connectionLineStyle,
      connectionLineComponent,
      deleteKeyCode = 'Backspace',
      selectionKeyCode = 'Shift',
      multiSelectionKeyCode = 'Meta',
      zoomActivationKeyCode = 'Meta',
      snapToGrid = false,
      snapGrid = [15, 15],
      onlyRenderVisibleElements = false,
      selectNodesOnDrag = true,
      nodesDraggable,
      nodesConnectable,
      elementsSelectable,
      minZoom,
      maxZoom,
      defaultZoom = 1,
      defaultPosition = [0, 0],
      translateExtent,
      preventScrolling = true,
      nodeExtent,
      arrowHeadColor = '#b1b1b7',
      markerStartId,
      markerEndId,
      zoomOnScroll = true,
      zoomOnPinch = true,
      panOnScroll = false,
      panOnScrollSpeed = 0.5,
      panOnScrollMode = PanOnScrollMode.Free,
      zoomOnDoubleClick = true,
      paneMoveable = true,
      onPaneClick,
      onPaneScroll,
      onPaneContextMenu,
      children,
      onEdgeUpdate,
      onEdgeContextMenu,
      onEdgeDoubleClick,
      onEdgeMouseEnter,
      onEdgeMouseMove,
      onEdgeMouseLeave,
      onEdgeUpdateStart,
      onEdgeUpdateEnd,
      onNodeResize,
      edgeUpdaterRadius = 10,
      nodeTypesId = '1',
      edgeTypesId = '1',
      sectionTypesId = '1',
      ...rest
    },
    ref
  ) => {
    const nodeTypesParsed = useMemo(() => createNodeTypes(nodeTypes), [nodeTypesId]);
    const edgeTypesParsed = useMemo(() => createEdgeTypes(edgeTypes), [edgeTypesId]);
    const sectionTypesParsed = useMemo(() => createSectionTypes(sectionTypes), [sectionTypesId]);
    const reactFlowClasses = cc(['react-flow', className]);

    return (
      <div {...rest} ref={ref} className={reactFlowClasses}>
        <Wrapper>
          <GraphView
            onLoad={onLoad}
            onMove={onMove}
            onMoveStart={onMoveStart}
            onMoveEnd={onMoveEnd}
            onElementClick={onElementClick}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseMove={onNodeMouseMove}
            onNodeMouseLeave={onNodeMouseLeave}
            onNodeContextMenu={onNodeContextMenu}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypesParsed}
            edgeTypes={edgeTypesParsed}
            sectionTypes={sectionTypesParsed}
            connectionMode={connectionMode}
            connectionLineType={connectionLineType}
            connectionLineStyle={connectionLineStyle}
            connectionLineComponent={connectionLineComponent}
            selectionKeyCode={selectionKeyCode}
            onElementsRemove={onElementsRemove}
            deleteKeyCode={deleteKeyCode}
            multiSelectionKeyCode={multiSelectionKeyCode}
            zoomActivationKeyCode={zoomActivationKeyCode}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectStop={onConnectStop}
            onConnectEnd={onConnectEnd}
            snapToGrid={snapToGrid}
            snapGrid={snapGrid}
            onlyRenderVisibleElements={onlyRenderVisibleElements}
            nodesDraggable={nodesDraggable}
            nodesConnectable={nodesConnectable}
            elementsSelectable={elementsSelectable}
            selectNodesOnDrag={selectNodesOnDrag}
            minZoom={minZoom}
            maxZoom={maxZoom}
            defaultZoom={defaultZoom}
            defaultPosition={defaultPosition}
            translateExtent={translateExtent}
            preventScrolling={preventScrolling}
            nodeExtent={nodeExtent}
            arrowHeadColor={arrowHeadColor}
            markerStartId={markerStartId}
            markerEndId={markerEndId}
            zoomOnScroll={zoomOnScroll}
            zoomOnPinch={zoomOnPinch}
            zoomOnDoubleClick={zoomOnDoubleClick}
            panOnScroll={panOnScroll}
            panOnScrollSpeed={panOnScrollSpeed}
            panOnScrollMode={panOnScrollMode}
            paneMoveable={paneMoveable}
            onPaneClick={onPaneClick}
            onPaneScroll={onPaneScroll}
            onPaneContextMenu={onPaneContextMenu}
            onSelectionDragStart={onSelectionDragStart}
            onSelectionDrag={onSelectionDrag}
            onSelectionDragStop={onSelectionDragStop}
            onSelectionContextMenu={onSelectionContextMenu}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeContextMenu={onEdgeContextMenu}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onEdgeMouseEnter={onEdgeMouseEnter}
            onEdgeMouseMove={onEdgeMouseMove}
            onEdgeMouseLeave={onEdgeMouseLeave}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            edgeUpdaterRadius={edgeUpdaterRadius}
            onNodeResize={onNodeResize}
          />
          <ElementUpdater elements={elements} />
          {onSelectionChange && <SelectionListener onSelectionChange={onSelectionChange} />}
          {children}
        </Wrapper>
      </div>
    );
  }
);

ReactFlow.displayName = 'ReactFlow';

export default ReactFlow;
