import * as React from 'react';
import { mount } from 'enzyme';
import Slider from './index';

jest.useFakeTimers();

describe('bounds changes while dragging', () => {
  it.each([
    { min: 0, max: 60, expected: 48 },
    { min: 40, max: 100, expected: 88 },
  ])('uses current bounds on release', ({ min, max, expected }) => {
    const onChange = jest.fn();
    const tree = mount(<Slider value={20} min={0} max={100} padding={0} onChange={onChange} />);
    const instance = tree.instance() as Slider;
    instance.maxScrollDistance = 100;
    tree.setState({ dragX: 80 });
    tree.setProps({ min, max });
    onChange.mockClear();
    instance.onInteractEnd({ stopPropagation: jest.fn() });
    expect(onChange).toHaveBeenLastCalledWith(expected);
    tree.unmount();
  });
});
