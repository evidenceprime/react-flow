import React from 'react';
import cc from 'classcat';

import Handle from '../Handle';
import { NodeProps, Position } from '../../types';

class UnidirectionalNode extends React.PureComponent<NodeProps> {
  ref: React.RefObject<HTMLDivElement>;

  constructor(props: NodeProps) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const element = this.ref.current;
    element!.addEventListener('resize', (event: any) => {
      const updatedDimensions = {
        width: Math.floor(event.detail.width / 12.5) * 12.5,
        height: Math.floor(event.detail.height / 12.5) * 12.5,
      };
      this.props.onNodeResize(updatedDimensions);
    });

    function checkResize(mutations: any[]) {
      const el = mutations[0].target;
      const w = el.clientWidth;
      const h = el.clientHeight;

      const isChange = mutations
        .map((m) => `${m.oldValue}`)
        .some(
          (prev) => prev.indexOf(`width: ${w}px`) === -1 || prev.indexOf(`height: ${h}px`) === -1
        );

      if (!isChange) {
        return;
      }
      const event = new CustomEvent('resize', { detail: { width: w, height: h } });
      el.dispatchEvent(event);
    }

    const observer = new MutationObserver(checkResize);
    observer.observe(element!, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['style'],
    });

    return () => observer.disconnect();
  }

  render() {
    const { data, isConnectable } = this.props;
    const label = data.hyperlink ? (
      <a href={data.hyperlink} target="_blank">
        {data.label}
      </a>
    ) : (
      data.label
    );

    return (
      <div
        ref={this.ref}
        style={{
          height: '100%',
          width: '100%',
        }}
        className={cc([
          'react-flow__node-unidirectional-content',
          {
            nodrag: data.lockPosition,
          },
        ])}
      >
        {label} {data.width}/{data.height}
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
      </div>
    );
  }
}

export default UnidirectionalNode;
