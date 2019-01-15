import * as React from 'react';
import { mount } from 'enzyme';
import Slider from './index';

jest.mock('lodash.debounce', () => data => data);
jest.mock('./utilities/findElementXandY', () => ({
  default: () => ({
    x: 2,
  }),
}));

describe('Slider', () => {
  it('should update dragX position when click on the bar', () => {
    const tree = mount(<Slider value={20} min={2} max={20} onChange={() => {}} />);

    tree
      .find('div')
      .at(0)
      .simulate('click');

    expect(tree.state()).toEqual({
      dragX: 3,
      showBubble: false,
    });
  });

  it('should update dragX position when user touch on the bar', () => {
    const tree = mount(<Slider value={20} min={2} max={20} onChange={() => {}} />);

    tree
      .find('div')
      .at(0)
      .simulate('touchstart', {
        targetTouches: [{
          pageX: 0,
        }]
      });

    expect(tree.state()).toEqual({
      dragX: 3,
      showBubble: true,
    });
  });
});
