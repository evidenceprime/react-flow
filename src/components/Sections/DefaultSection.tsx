import React from 'react';
import cc from 'classcat';
import { SectionProps, SectionState } from '../../types';

class DefaultSection extends React.PureComponent<SectionProps, SectionState> {
  ref: React.RefObject<HTMLDivElement>;

  constructor(props: SectionProps) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      width: props.data.width,
      height: props.data.height,
    }
  }

  componentDidMount() {
    const element = this.ref.current;
    element!.addEventListener('resize', (event: any) => {
      const updatedDimensions = {
        width: Math.floor(event.detail.width / 12.5) * 12.5,
        height: Math.floor(event.detail.height / 12.5) * 12.5
      }
      this.setState(updatedDimensions);
    });
    
    function checkResize(mutations: any[]) {
      const el = mutations[0].target;
      const w = el.clientWidth;
      const h = el.clientHeight;

      const isChange = mutations
        .map((m) => `${m.oldValue}`)
        .some((prev) => prev.indexOf(`width: ${w}px`) === -1 || prev.indexOf(`height: ${h}px`) === -1);

      if (!isChange) { return; }
      const event = new CustomEvent('resize', { detail: { width: w, height: h } });
      el.dispatchEvent(event);
    }
    
    const observer = new MutationObserver(checkResize);
    observer.observe(element!, { attributes: true, attributeOldValue: true, attributeFilter: ['style'] });
  }

  render() {
    const { label, lockPosition, background } = this.props.data;
    return (
      <div
        ref={this.ref}
        className={cc(["react-flow__section", { "nodrag": lockPosition }])}
        style={{
          height: this.state.height,
          width: this.state.width
        }}
      >
        <div className='react-flow__section__label'>
          <span
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {label}
          </span>
        </div>
        <div className='react-flow__section__content' style={{
          background: background ?? '#FBFAF8'
        }}>
          {/* content */}
        </div>
      </div>
    )
  }
};

export default DefaultSection;
