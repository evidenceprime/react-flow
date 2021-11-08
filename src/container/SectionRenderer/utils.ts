import { ComponentType } from 'react';

import DefaultSection from '../../components/Nodes/DefaultNode';
import wrapSection from '../../components/Sections/wrapSection';
import { SectionTypesType, SectionComponentProps } from '../../types';

export function createSectionTypes(sectionTypes: SectionTypesType): SectionTypesType {
  const standardTypes: SectionTypesType = {
    default: wrapSection((sectionTypes.default || DefaultSection) as ComponentType<
      SectionComponentProps
    >),
  };

  const wrappedTypes = {} as SectionTypesType;
  const specialTypes: SectionTypesType = Object.keys(sectionTypes)
    .filter(k => !['input', 'default', 'output'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapSection((sectionTypes[key] || DefaultSection) as ComponentType<
        SectionComponentProps
      >);

      return res;
    }, wrappedTypes);

  return {
    ...standardTypes,
    ...specialTypes,
  };
}
