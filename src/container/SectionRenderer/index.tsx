import React, { memo, useMemo, ComponentType, MouseEvent } from 'react';

import { getSectionsInside } from '../../utils/graph';
import { useStoreState, useStoreActions } from '../../store/hooks';
import { Node, Section, SectionTypesType, WrapSectionProps, Edge } from '../../types';
interface SectionRendererProps {
  sectionTypes: SectionTypesType;
  onElementClick?: (event: MouseEvent, element: Node | Section | Edge) => void;
  onNodeMouseEnter?: (event: MouseEvent, section: Section) => void;
  onNodeMouseMove?: (event: MouseEvent, section: Section) => void;
  onNodeMouseLeave?: (event: MouseEvent, section: Section) => void;
  onNodeDragStart?: (event: MouseEvent, section: Section) => void;
  onNodeDrag?: (event: MouseEvent, section: Section) => void;
  onNodeDragStop?: (event: MouseEvent, section: Section) => void;
  onNodeResize: (section: Section, dimensions: object) => void;
  snapToGrid: boolean;
  snapGrid: [number, number];
  onlyRenderVisibleElements: boolean;
}

const SectionRenderer = (props: SectionRendererProps) => {
  const { snapToGrid, snapGrid } = props;
  const transform = useStoreState((state) => state.transform);
  const selectedElements = useStoreState((state) => state.selectedElements);
  const nodesDraggable = useStoreState((state) => state.nodesDraggable);
  const elementsSelectable = useStoreState((state) => state.elementsSelectable);
  const width = useStoreState((state) => state.width);
  const height = useStoreState((state) => state.height);
  const sections = useStoreState((state) => state.sections);
  const updateNodeDimensions = useStoreActions((actions) => actions.updateNodeDimensions);

  const visibleSections = props.onlyRenderVisibleElements
    ? getSectionsInside(sections, { x: 0, y: 0, width, height }, transform, true)
    : sections;

  const transformAndZIndexStyle = useMemo(
    () => ({
      transform: `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})`,
      zIndex: 2
    }),
    [transform[0], transform[1], transform[2]]
  );

  const resizeObserver = useMemo(() => {
    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    return new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const updates = entries.map((entry: ResizeObserverEntry) => {
        return {
          id: entry.target.getAttribute('data-id') as string,
          nodeElement: entry.target as HTMLDivElement,
          snapGrid: snapToGrid ? snapGrid : null,
        };
      });

      updateNodeDimensions(updates);
    });
  }, [updateNodeDimensions, snapToGrid, snapGrid]);

  return (
    <div className="react-flow__nodes" style={transformAndZIndexStyle}>
      {visibleSections.map((section) => {
        const sectionType = section.type || 'default';
        const SectionComponent = (props.sectionTypes[sectionType] || props.sectionTypes.default) as ComponentType<WrapSectionProps>;

        if (!props.sectionTypes[sectionType]) {
          console.warn(`Section type "${sectionType}" not found. Using fallback type "default".`);
        }

        const isDraggable = !!(section.draggable || (nodesDraggable && typeof section.draggable === 'undefined'));
        const isSelectable = !!(section.selectable || (elementsSelectable && typeof section.selectable === 'undefined'));

        return (
          <SectionComponent
            isInitialized
            key={section.id}
            id={section.id}
            className={section.className}
            style={section.style}
            type={sectionType}
            label={section.label}
            data={section.data}
            isHidden={section.isHidden}
            xPos={section.__rf.position.x}
            yPos={section.__rf.position.y}
            isDragging={section.__rf.isDragging}
            snapGrid={props.snapGrid}
            snapToGrid={props.snapToGrid}
            onClick={props.onElementClick}
            onMouseEnter={props.onNodeMouseEnter}
            onMouseMove={props.onNodeMouseMove}
            onMouseLeave={props.onNodeMouseLeave}
            onNodeDragStart={props.onNodeDragStart}
            onNodeDrag={props.onNodeDrag}
            onNodeDragStop={props.onNodeDragStop}
            scale={transform[2]}
            selected={selectedElements?.some(({ id }) => id === section.id) || false}
            isDraggable={isDraggable}
            isSelectable={isSelectable}
            resizeObserver={resizeObserver}
            onNodeResize={props.onNodeResize}
          />
        );
      })}
    </div>
  );
};

SectionRenderer.displayName = 'SectionRenderer';

export default memo(SectionRenderer);
