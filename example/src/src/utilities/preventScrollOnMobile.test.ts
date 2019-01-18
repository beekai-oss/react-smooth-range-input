import preventScrollOnMobile from './preventScrollOnMobile';

let originalTouchMove;

describe('preventScrollOnMobile', () => {
  beforeEach(() => {
    originalTouchMove = document.ontouchmove;
  });

  afterEach(() => {
    document.ontouchmove = originalTouchMove;
  });

  it('should not invoke preventDefault on none touch device', () => {
    const unsubscribe = preventScrollOnMobile.bind({ isTouching: false })();
    unsubscribe();
    expect(document.ontouchmove).toBeUndefined();
  });

  it('should invoke preventDefault on touch device', () => {
    const unsubscribe = preventScrollOnMobile.bind({ isTouching: true })();
    const preventDefault = jest.fn();
    // @ts-ignore
    document.ontouchmove({ preventDefault  });
    unsubscribe();
    expect(document.ontouchmove).toBeUndefined();
    expect(preventDefault).toBeCalled();
  });
});
