import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Controller from './Controller';

describe('Controller', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <Controller
        buttonSize={20}
        dragX={2}
        height={20}
        isControlByKeyBoard={false}
        isThin={false}
        onBlur={() => {}}
        onFocus={() => {}}
        onInteractEnd={() => {}}
        onMouseDown={() => {}}
        showBubble={false}
        value={20}
      />,
    );
    expect(tree).toMatchSnapshot();
  });
});
