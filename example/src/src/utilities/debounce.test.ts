import debounce from './debounce';

jest.useFakeTimers();

describe('debounce', () => {
  it('should debounced function invoke', () => {
    const testFunction = jest.fn();
    const debounceFunction = debounce(testFunction, 2000);
    debounceFunction();
    debounceFunction();
    debounceFunction();
    debounceFunction();
    expect(testFunction.mock.calls.length).toBe(1);

    jest.runAllTimers();
    expect(testFunction.mock.calls.length).toBe(2);
  });
});
