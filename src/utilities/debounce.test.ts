import debounce from './debounce';

describe('debounce', () => {
  it('should debounced function invoke', () => {
    const testFunction = jest.fn();
    const what = debounce(testFunction, 2000);
    what();
    what();
    what();
    what();
    expect(testFunction.mock.calls.length).toBe(1);
  });
});
