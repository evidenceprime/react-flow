import { ArrowHeadType, Position } from '../../types';

export const getMarkerEnd = (arrowHeadType?: ArrowHeadType, markerEndId?: string): string => {
  if (typeof markerEndId !== 'undefined' && markerEndId) {
    return `url(#${markerEndId})`;
  }
  const isArrowHeadTypeTargetOrDouble =
    arrowHeadType === ArrowHeadType.ArrowTarget || arrowHeadType === ArrowHeadType.DoubleArrow;

  return typeof arrowHeadType !== 'undefined' && isArrowHeadTypeTargetOrDouble
    ? `url(#react-flow__${ArrowHeadType.ArrowTarget})`
    : 'none';
};

export const getMarkerStart = (arrowHeadType?: ArrowHeadType, markerStartId?: string): string => {
  if (typeof markerStartId !== 'undefined' && markerStartId) {
    return `url(#${markerStartId})`;
  }

  const isArrowHeadTypeSourceOrDouble =
    arrowHeadType === ArrowHeadType.ArrowSource || arrowHeadType === ArrowHeadType.DoubleArrow;

  return typeof arrowHeadType !== 'undefined' && isArrowHeadTypeSourceOrDouble
    ? `url(#react-flow__${ArrowHeadType.ArrowSource})`
    : 'none';
};

export interface GetCenterParams {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition?: Position;
  targetPosition?: Position;
}

const LeftOrRight = [Position.Left, Position.Right];

export const getCenter = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
}: GetCenterParams): [number, number, number, number] => {
  const sourceIsLeftOrRight = LeftOrRight.includes(sourcePosition);
  const targetIsLeftOrRight = LeftOrRight.includes(targetPosition);

  // we expect flows to be horizontal or vertical (all handles left or right respectively top or bottom)
  // a mixed edge is when one the source is on the left and the target is on the top for example.
  const mixedEdge =
    (sourceIsLeftOrRight && !targetIsLeftOrRight) || (targetIsLeftOrRight && !sourceIsLeftOrRight);

  if (mixedEdge) {
    const xOffset = sourceIsLeftOrRight ? Math.abs(targetX - sourceX) : 0;
    const centerX = sourceX > targetX ? sourceX - xOffset : sourceX + xOffset;

    const yOffset = sourceIsLeftOrRight ? 0 : Math.abs(targetY - sourceY);
    const centerY = sourceY < targetY ? sourceY + yOffset : sourceY - yOffset;

    return [centerX, centerY, xOffset, yOffset];
  }

  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return [centerX, centerY, xOffset, yOffset];
};
