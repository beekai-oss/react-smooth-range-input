import * as React from 'react';
import * as renderer from 'react-test-renderer';
import SliderIndicator from './SliderIndicator';

describe('SliderIndicator', () => {
  it('should render correctly', () => {
    const tree = renderer.create(<SliderIndicator amount={30} isThin={false} hasTickMarks />);
    expect(tree).toMatchSnapshot();
  });

  it('should render the correct background', () => {
    const tree = renderer.create(<SliderIndicator amount={30} isThin />);
    expect(tree).toMatchSnapshot();
  });
});
