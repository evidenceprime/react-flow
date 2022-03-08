import { ComponentType } from 'react';

import { BezierEdge, StepEdge, SmoothStepEdge, StraightEdge } from '../../components/Edges';
import wrapEdge from '../../components/Edges/wrapEdge';
import { rectToBox } from '../../utils/graph';

import {
  EdgeTypesType,
  EdgeProps,
  Position,
  Node,
  XYPosition,
  ElementId,
  HandleElement,
  Transform,
  Edge,
} from '../../types';

export function createEdgeTypes(edgeTypes: EdgeTypesType): EdgeTypesType {
  const standardTypes: EdgeTypesType = {
    default: wrapEdge((edgeTypes.default || BezierEdge) as ComponentType<EdgeProps>),
    straight: wrapEdge((edgeTypes.bezier || StraightEdge) as ComponentType<EdgeProps>),
    step: wrapEdge((edgeTypes.step || StepEdge) as ComponentType<EdgeProps>),
    smoothstep: wrapEdge((edgeTypes.step || SmoothStepEdge) as ComponentType<EdgeProps>),
  };

  const wrappedTypes = {} as EdgeTypesType;
  const specialTypes: EdgeTypesType = Object.keys(edgeTypes)
    .filter((k) => !['default', 'bezier'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapEdge((edgeTypes[key] || BezierEdge) as ComponentType<EdgeProps>);

      return res;
    }, wrappedTypes);

  return {
    ...standardTypes,
    ...specialTypes,
  };
}

export function getHandlePosition(
  position: Position,
  node: Node,
  handle: any | null = null
): XYPosition {
  const x = (handle?.x || 0) + node.__rf.position.x;
  const y = (handle?.y || 0) + node.__rf.position.y;
  const width = handle?.width || node.__rf.width;
  const height = handle?.height || node.__rf.height;

  switch (position) {
    case Position.Top:
      return {
        x: x + width / 2,
        y,
      };
    case Position.TopLeft:
      return {
        x: x + width / 4,
        y,
      };
    case Position.TopRight:
      return {
        x: x + width * 0.75,
        y,
      };
    case Position.Right:
      return {
        x: x + width,
        y: y + height / 2,
      };
    case Position.RightTop:
      return {
        x: x + width,
        y: y + height / 4,
      };
    case Position.RightBottom:
      return {
        x: x + width,
        y: y + height * 0.75,
      };
    case Position.Bottom:
      return {
        x: x + width / 2,
        y: y + height,
      };
    case Position.BottomLeft:
      return {
        x: x + width / 4,
        y: y + height,
      };
    case Position.BottomRight:
      return {
        x: x + width * 0.75,
        y: y + height,
      };
    case Position.Left:
      return {
        x,
        y: y + height / 2,
      };
    case Position.LeftTop:
      return {
        x,
        y: y + height / 4,
      };
    case Position.LeftBottom:
      return {
        x,
        y: y + height * 0.75,
      };
    default:
      return {
        x,
        y,
      };
  }
}

export function getHandle(
  bounds: HandleElement[],
  handleId: ElementId | null
): HandleElement | null {
  if (!bounds) {
    return null;
  }

  // there is no handleId when there are no multiple handles/ handles with ids
  // so we just pick the first one
  let handle = null;
  if (bounds.length === 1 || !handleId) {
    handle = bounds[0];
  } else if (handleId) {
    handle = bounds.find((d) => d.id === handleId);
  }

  return typeof handle === 'undefined' ? null : handle;
}

function getBreakpointOffset(
  handlePosition: Position,
  handleType: 'source' | 'target'
): XYPosition {
  const typeMultiplier = handleType === 'source' ? -1 : -0.5;
  const x = [Position.Left, Position.LeftTop, Position.LeftBottom].includes(handlePosition)
    ? typeMultiplier * -10
    : [Position.Right, Position.RightTop, Position.RightBottom].includes(handlePosition)
    ? typeMultiplier * 10
    : 0;
  const y = [Position.Bottom, Position.BottomLeft, Position.BottomRight].includes(handlePosition)
    ? typeMultiplier * 10
    : [Position.Top, Position.TopLeft, Position.TopRight].includes(handlePosition)
    ? typeMultiplier * -10
    : 0;
  return { x, y };
}

function getOffset(position: Position): XYPosition {
  if ([Position.TopLeft, Position.BottomLeft].includes(position)) {
    return {
      x: 3.5,
      y: 0,
    };
  } else if ([Position.TopRight, Position.BottomRight].includes(position)) {
    return {
      x: -2.5,
      y: 0,
    };
  } else if ([Position.LeftTop, Position.RightTop].includes(position)) {
    return {
      x: 0,
      y: 3.5,
    };
  } else if ([Position.LeftBottom, Position.RightBottom].includes(position)) {
    return {
      x: 0,
      y: -2.5,
    };
  } else {
    return {
      x: 0,
      y: 0,
    };
  }
}

interface EdgePositions {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

export const getEdgePositions = (
  sourceNode: Node,
  sourceHandle: HandleElement | unknown,
  sourcePosition: Position,
  targetNode: Node,
  targetHandle: HandleElement | unknown,
  targetPosition: Position
): EdgePositions => {
  const sourceHandlePos = getHandlePosition(sourcePosition, sourceNode, sourceHandle);
  const targetHandlePos = getHandlePosition(targetPosition, targetNode, targetHandle);

  const sourceNodeOffset: XYPosition =
    sourceNode.type === 'breakpoint'
      ? getBreakpointOffset(sourcePosition, 'source')
      : getOffset(sourcePosition);

  const targetNodeOffset: XYPosition =
    targetNode.type === 'breakpoint'
      ? getBreakpointOffset(targetPosition, 'target')
      : getOffset(targetPosition);

  return {
    sourceX: sourceHandlePos.x + sourceNodeOffset.x,
    sourceY: sourceHandlePos.y + sourceNodeOffset.y,
    targetX: targetHandlePos.x + targetNodeOffset.x,
    targetY: targetHandlePos.y + targetNodeOffset.y,
  };
};

interface IsEdgeVisibleParams {
  sourcePos: XYPosition;
  targetPos: XYPosition;
  width: number;
  height: number;
  transform: Transform;
}

export function isEdgeVisible({
  sourcePos,
  targetPos,
  width,
  height,
  transform,
}: IsEdgeVisibleParams): boolean {
  const edgeBox = {
    x: Math.min(sourcePos.x, targetPos.x),
    y: Math.min(sourcePos.y, targetPos.y),
    x2: Math.max(sourcePos.x, targetPos.x),
    y2: Math.max(sourcePos.y, targetPos.y),
  };

  if (edgeBox.x === edgeBox.x2) {
    edgeBox.x2 += 1;
  }

  if (edgeBox.y === edgeBox.y2) {
    edgeBox.y2 += 1;
  }

  const viewBox = rectToBox({
    x: (0 - transform[0]) / transform[2],
    y: (0 - transform[1]) / transform[2],
    width: width / transform[2],
    height: height / transform[2],
  });

  const xOverlap = Math.max(0, Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x));
  const yOverlap = Math.max(0, Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y));
  const overlappingArea = Math.ceil(xOverlap * yOverlap);

  return overlappingArea > 0;
}

type SourceTargetNode = {
  sourceNode: Node | null;
  targetNode: Node | null;
};

export const getSourceTargetNodes = (edge: Edge, nodes: Node[]): SourceTargetNode => {
  return nodes.reduce(
    (res, node) => {
      if (node.id === edge.source) {
        res.sourceNode = node;
      }
      if (node.id === edge.target) {
        res.targetNode = node;
      }
      return res;
    },
    { sourceNode: null, targetNode: null } as SourceTargetNode
  );
};
