import React, { memo } from 'react';
import { isEmpty } from 'lodash/fp';
import Handle from '../Handle';
import { NodeProps, Position } from '../../types';

function getBreakpointPath(connectedHandlePositions: Position[]) {
  if(isEmpty(connectedHandlePositions)) return "M 5 0 L 5 10 M 0 5 L 10 5 Z";
  let path: string = '';
  if (connectedHandlePositions.includes(Position.Top) && connectedHandlePositions.includes(Position.Bottom)) {
    path += 'M 5 0 L 5 10 ';
  } else if (connectedHandlePositions.includes(Position.Top)) {
    path += 'M 5 0 L 5 5 ';
  } else if (connectedHandlePositions.includes(Position.Bottom)) {
    path += 'M 5 5 L 5 10 ';
  }
  if (connectedHandlePositions.includes(Position.Left) && connectedHandlePositions.includes(Position.Right)) {
    path += 'M 0 5 L 0 10 ';
  } else if (connectedHandlePositions.includes(Position.Left)) {
    path += 'M 0 5 L 5 5 ';
  } else if (connectedHandlePositions.includes(Position.Right)) {
    path += 'M 5 5 L 10 5 ';
  }
  return path += 'Z';
}

const BreakpointNode = ({
  isConnectable,
  connectedHandlePositions,
}: NodeProps) => {
  const breakpointNodePath = getBreakpointPath(connectedHandlePositions ?? []);
  return (
    <>
      <svg width="10px" height="10px">
        <path
          className="react-flow__edge-path"
          d={breakpointNodePath}
        />
      </svg>
      <Handle
        type="source"
        id={Position.Top}
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        id={Position.Right}
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        id={Position.Bottom}
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        id={Position.Left}
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </>
  )
};

BreakpointNode.displayName = 'BreakpointNode';

export default memo(BreakpointNode);
