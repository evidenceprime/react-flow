import React, { memo } from 'react';

import Handle from '../Handle';
import { NodeProps, Position } from '../../types';

const UnidirectionalNode = ({ data, isConnectable }: NodeProps) => {
  const label = data.hyperlink ? (
    <a href={data.hyperlink} target="_blank">
      {data.label}
    </a>
  ) : (
    data.label
  );

  return (
    <>
      {label}
      {data.lockPosition ? null : (
        <>
          <Handle
            type="source"
            id={Position.TopLeft}
            position={Position.TopLeft}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            id={Position.Top}
            position={Position.Top}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            id={Position.TopRight}
            position={Position.TopRight}
            isConnectable={isConnectable}
          />

          <Handle
            type="source"
            id={Position.RightTop}
            position={Position.RightTop}
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
            id={Position.RightBottom}
            position={Position.RightBottom}
            isConnectable={isConnectable}
          />

          <Handle
            type="source"
            id={Position.BottomRight}
            position={Position.BottomRight}
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
            id={Position.BottomLeft}
            position={Position.BottomLeft}
            isConnectable={isConnectable}
          />

          <Handle
            type="source"
            id={Position.LeftBottom}
            position={Position.LeftBottom}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            id={Position.Left}
            position={Position.Left}
            isConnectable={isConnectable}
          />
          <Handle
            type="source"
            id={Position.LeftTop}
            position={Position.LeftTop}
            isConnectable={isConnectable}
          />
        </>
      )}
    </>
  );
};

UnidirectionalNode.displayName = 'UnidirectionalNode';

export default memo(UnidirectionalNode);
