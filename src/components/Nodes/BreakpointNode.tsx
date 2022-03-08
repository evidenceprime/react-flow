import React, { memo } from 'react';
import { isEmpty } from 'lodash/fp';
import Handle from '../Handle';
import { NodeProps, Position } from '../../types';

const breakpointElementSize = 20;

function getBreakpointPath(connectedHandlePositions: Position[]) {
  if (isEmpty(connectedHandlePositions)) {
    return `M ${breakpointElementSize / 2} 0 L ${
      breakpointElementSize / 2
    } ${breakpointElementSize} M 0 ${breakpointElementSize / 2} L ${breakpointElementSize} ${
      breakpointElementSize / 2
    } Z`;
  }
  let path: string = '';
  if (
    connectedHandlePositions.includes(Position.Top) &&
    connectedHandlePositions.includes(Position.Bottom)
  ) {
    path += `M ${breakpointElementSize / 2} 0 L ${
      breakpointElementSize / 2
    } ${breakpointElementSize} `;
  } else if (connectedHandlePositions.includes(Position.Top)) {
    path += `M ${breakpointElementSize / 2} 0 L ${breakpointElementSize / 2} ${
      breakpointElementSize / 2
    } `;
  } else if (connectedHandlePositions.includes(Position.Bottom)) {
    path += `M ${breakpointElementSize / 2} ${breakpointElementSize / 2} L ${
      breakpointElementSize / 2
    } ${breakpointElementSize} `;
  }
  if (
    connectedHandlePositions.includes(Position.Left) &&
    connectedHandlePositions.includes(Position.Right)
  ) {
    path += `M 0 ${breakpointElementSize / 2} L ${breakpointElementSize} ${
      breakpointElementSize / 2
    } `;
  } else if (connectedHandlePositions.includes(Position.Left)) {
    path += `M 0 ${breakpointElementSize / 2} L ${breakpointElementSize / 2} ${
      breakpointElementSize / 2
    } `;
  } else if (connectedHandlePositions.includes(Position.Right)) {
    path += `M ${breakpointElementSize / 2} ${
      breakpointElementSize / 2
    } L ${breakpointElementSize} ${breakpointElementSize / 2} `;
  }
  return (path += 'Z');
}

const BreakpointNode = ({ isConnectable, connectedHandlePositions }: NodeProps) => {
  const breakpointNodePath = getBreakpointPath(connectedHandlePositions ?? []);
  return (
    <>
      <svg width="20px" height="20px" style={{ lineHeight: 1 }}>
        <path className="react-flow__edge-path" d={breakpointNodePath} />
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
  );
};

BreakpointNode.displayName = 'BreakpointNode';

export default memo(BreakpointNode);
