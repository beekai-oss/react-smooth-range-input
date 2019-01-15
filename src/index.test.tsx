import * as React from 'react';
import { mount } from 'enzyme';
import Slider from './index';

jest.useFakeTimers();

jest.mock('lodash.debounce', () => data => data);
jest.mock('./utilities/findElementXandY', () => ({
  default: () => ({
    x: 2,
  }),
}));

describe('Slider', () => {
  it('should update dragX position when click on the bar', () => {
    const onChange = jest.fn();
    const tree = mount(<Slider value={20} min={2} max={20} onChange={onChange} />);

    tree
      .find('div')
      .at(0)
      .simulate('click');

    expect(tree.state()).toEqual({
      dragX: 3,
      showBubble: false,
    });

    jest.runAllTimers();
    expect(onChange).toBeCalled();
  });

  it('should update dragX position when user touch on the bar', () => {
    const tree = mount(<Slider value={20} min={2} max={20} onChange={() => {}} />);

    tree
      .find('div')
      .at(0)
      .simulate('touchstart', {
        targetTouches: [
          {
            pageX: 0,
          },
        ],
      });

    expect(tree.state()).toEqual({
      dragX: 3,
      showBubble: true,
    });
  });

  it('should call on change prop when touch end', () => {
    const onChange = jest.fn();
    const tree = mount(<Slider value={20} min={2} max={20} onChange={onChange} />);

    tree
      .find('div')
      .at(0)
      .simulate('touchend', {
        targetTouches: [
          {
            pageX: 0,
          },
        ],
      });

    expect(tree.state()).toEqual({
      dragX: 0,
      showBubble: false,
    });
    expect(onChange).toBeCalled();
  });

  it('should call on change prop when keyboard ArrowDown or ArrowLeft pressed', () => {
    const onChange = jest.fn();
    const preventDefault = jest.fn();
    const tree = mount(<Slider value={20} min={2} max={20} onChange={onChange} />);

    expect(tree.state()).toEqual({
      dragX: 0,
      showBubble: false,
    });

    // @ts-ignore:
    tree.instance().onKeyEvent({
      preventDefault,
      key: 'ArrowLeft',
    });

    expect(tree.state()).toEqual({
      dragX: 3,
      showBubble: false,
    });
    expect(onChange).toBeCalled();
    expect(preventDefault).toBeCalled();
  });

  it('should call on change prop when keyboard ArrowRight or ArrowUp pressed', () => {
    const onChange = jest.fn();
    const preventDefault = jest.fn();
    const tree = mount(<Slider value={20} min={2} max={20} onChange={onChange} />);

    expect(tree.state()).toEqual({
      dragX: 0,
      showBubble: false,
    });

    // @ts-ignore:
    tree.instance().onKeyEvent({
      preventDefault,
      key: 'ArrowUp',
    });

    expect(tree.state()).toEqual({
      dragX: 3,
      showBubble: false,
    });
    expect(onChange).toBeCalled();
    expect(preventDefault).toBeCalled();
  });

  it('should not take any action when other key pressed than arrow', () => {
    const onChange = jest.fn();
    const preventDefault = jest.fn();
    const tree = mount(<Slider value={20} min={2} max={20} onChange={onChange} />);

    expect(tree.state()).toEqual({
      dragX: 0,
      showBubble: false,
    });

    // @ts-ignore:
    tree.instance().onKeyEvent({
      preventDefault,
      key: 'What',
    });

    expect(tree.state()).toEqual({
      dragX: 0,
      showBubble: false,
    });
    expect(preventDefault).not.toBeCalled();
  });
});
