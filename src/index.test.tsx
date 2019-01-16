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

  it('should update client x when mouse move', () => {
    const stopPropagation = jest.fn();
    const tree = mount(<Slider value={20} min={2} max={20} onChange={() => {}} />);

    // @ts-ignore:
    tree.instance().onMouseMove({
      stopPropagation,
      clientX: 20,
    });

    // @ts-ignore:
    expect(tree.instance().clientX).toEqual(20);
    expect(stopPropagation).toBeCalled();
  });

  it('should update state on touch move', () => {
    const tree = mount(<Slider value={20} min={2} max={20} onChange={() => {}} />);

    // @ts-ignore:
    tree.instance().wrapperRef.current.getBoundingClientRect = () => ({
      left: 2,
    });

    // @ts-ignore:
    tree.instance().maxScrollDistance = 500;

    tree
      .find('div')
      .at(0)
      .simulate('touchmove', {
        targetTouches: [
          {
            pageX: 120,
          },
        ],
      });

    expect(tree.state()).toEqual({
      dragX: 101,
      showBubble: false,
    });
  });

  it('should update client X and add event listener after onMouseDown', () => {
    const stopPropagation = jest.fn();
    const tree = mount(<Slider value={20} min={2} max={20} onChange={() => {}} />);

    // @ts-ignore:
    tree.instance().onMouseDown({
      clientX: 2,
      stopPropagation,
    });

    // @ts-ignore:
    expect(tree.instance().clientX).toEqual(2);
    // @ts-ignore:
    expect(tree.instance().isControlByKeyBoard).toEqual(false);
    expect(stopPropagation).toBeCalled();
    expect(tree.state('showBubble')).toBeTruthy();
  });

  it('should trigger width recalculation on resize', () => {
    const tree = mount(<Slider value={20} min={2} max={20} onChange={() => {}} />);
    // @ts-ignore:
    tree.instance().wrapperRef.current.getBoundingClientRect = () => ({
      width: 200,
    });
    // @ts-ignore:
    global.dispatchEvent(new Event('resize'));
    // @ts-ignore:
    expect(tree.instance().maxScrollDistance).toEqual(163);
    // @ts-ignore:
    expect(tree.instance().arrowKeyPerClickDistance).toEqual(9.055555555555555);
    expect(tree.state()).toEqual({ dragX: 0, showBubble: false });
  });

  it('should invoke restoreTouchMove when component un mount', () => {
    const tree = mount(<Slider value={20} min={2} max={20} onChange={() => {}} />);
    const restoreTouchMove = jest.fn();
    // @ts-ignore:
    tree.instance().restoreTouchMove = restoreTouchMove;

    // @ts-ignore:
    tree.instance().componentWillUnmount();
    expect(restoreTouchMove).toBeCalled();
  });
});
