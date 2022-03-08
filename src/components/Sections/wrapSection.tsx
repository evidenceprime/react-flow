import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  memo,
  ComponentType,
  CSSProperties,
  useMemo,
  MouseEvent,
  useCallback,
} from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import cc from 'classcat';

import { useStoreActions } from '../../store/hooks';
import { Provider } from '../../contexts/NodeIdContext';
import { SectionComponentProps, WrapSectionProps } from '../../types';

export default (SectionComponent: ComponentType<SectionComponentProps>) => {
  const SectionWrapper = ({
    id,
    type,
    data,
    label,
    scale,
    xPos,
    yPos,
    selected,
    onClick,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,
    onNodeResize,
    style,
    className,
    isDraggable,
    isSelectable,
    isHidden,
    isInitialized,
    snapToGrid,
    snapGrid,
    isDragging,
    resizeObserver,
  }: WrapSectionProps) => {
    const updateNodeDimensions = useStoreActions((actions) => actions.updateNodeDimensions);
    const updateNodePosDiff = useStoreActions((actions) => actions.updateNodePosDiff);

    const sectionElement = useRef<HTMLDivElement>(null);

    const section = useMemo(
      () => ({ id, type, label, position: { x: xPos, y: yPos }, data }),
      [id, type, xPos, yPos, data, label]
    );
    const grid = useMemo(
      () => (snapToGrid ? snapGrid : [1, 1])! as [number, number],
      [snapToGrid, snapGrid]
    );

    const nodeStyle: CSSProperties = useMemo(
      () => ({
        zIndex: selected ? 10 : 3,
        transform: `translate(${xPos}px,${yPos}px)`,
        pointerEvents:
          isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave
            ? 'all'
            : 'none',
        // prevents jumping of nodes on start
        opacity: isInitialized ? 1 : 0,
        ...style,
      }),
      [
        selected,
        xPos,
        yPos,
        isSelectable,
        isDraggable,
        onClick,
        isInitialized,
        style,
        onMouseEnter,
        onMouseMove,
        onMouseLeave,
      ]
    );
    const onMouseEnterHandler = useMemo(() => {
      if (!onMouseEnter || isDragging) {
        return;
      }

      return (event: MouseEvent) => onMouseEnter(event, section);
    }, [onMouseEnter, isDragging, section]);

    const onMouseMoveHandler = useMemo(() => {
      if (!onMouseMove || isDragging) {
        return;
      }

      return (event: MouseEvent) => onMouseMove(event, section);
    }, [onMouseMove, isDragging, section]);

    const onMouseLeaveHandler = useMemo(() => {
      if (!onMouseLeave || isDragging) {
        return;
      }

      return (event: MouseEvent) => onMouseLeave(event, section);
    }, [onMouseLeave, isDragging, section]);

    const onDragStart = useCallback(
      (event: DraggableEvent) => {
        onNodeDragStart?.(event as MouseEvent, section);
      },
      [section, onNodeDragStart]
    );

    const onDrag = useCallback(
      (event: DraggableEvent, draggableData: DraggableData) => {
        if (onNodeDrag) {
          section.position.x += draggableData.deltaX;
          section.position.y += draggableData.deltaY;
          onNodeDrag(event as MouseEvent, section);
        }

        updateNodePosDiff({
          id,
          diff: {
            x: draggableData.deltaX,
            y: draggableData.deltaY,
          },
          isDragging: true,
        });
      },
      [id, section, onNodeDrag]
    );

    const onDragStop = useCallback(
      (event: DraggableEvent) => {
        // onDragStop also gets called when user just clicks on a section.
        // Because of that we set dragging to true inside the onDrag handler and handle the click here
        if (!isDragging) {
          onClick?.(event as MouseEvent, section);
          return;
        }

        updateNodePosDiff({
          id: section.id,
          isDragging: false,
        });

        onNodeDragStop?.(event as MouseEvent, section);
      },
      [section, onClick, onNodeDragStop, isDragging]
    );

    const handleNodeResize = useCallback(
      (dimensions: object) => {
        onNodeResize(section, dimensions);
      },
      [section]
    );

    useLayoutEffect(() => {
      if (sectionElement.current && !isHidden) {
        updateNodeDimensions([{ id, sectionElement: sectionElement.current, forceUpdate: true }]);
      }
    }, [id, isHidden]);

    useEffect(() => {
      if (sectionElement.current) {
        const currNode = sectionElement.current;
        resizeObserver?.observe(currNode);

        return () => resizeObserver?.unobserve(currNode);
      }
    }, []);

    if (isHidden) {
      return null;
    }

    const nodeClasses = cc([
      'react-flow__node',
      `react-flow__node-${type}`,
      className,
      {
        selected,
        selectable: isSelectable,
      },
    ]);

    return (
      <DraggableCore
        onStart={onDragStart}
        onDrag={onDrag}
        onStop={onDragStop}
        scale={scale}
        disabled={!isDraggable}
        cancel=".nodrag"
        nodeRef={sectionElement}
        grid={grid}
        enableUserSelectHack={false}
      >
        <div
          className={nodeClasses}
          ref={sectionElement}
          style={nodeStyle}
          onMouseEnter={onMouseEnterHandler}
          onMouseMove={onMouseMoveHandler}
          onMouseLeave={onMouseLeaveHandler}
          onClick={(evt) => onClick?.(evt, section)}
          data-id={id}
        >
          <Provider value={id}>
            <SectionComponent
              id={id}
              data={data}
              type={type}
              xPos={xPos}
              yPos={yPos}
              selected={selected}
              isDragging={isDragging}
              onNodeResize={handleNodeResize}
            />
          </Provider>
        </div>
      </DraggableCore>
    );
  };

  SectionWrapper.displayName = 'SectionWrapper';

  return memo(SectionWrapper);
};
