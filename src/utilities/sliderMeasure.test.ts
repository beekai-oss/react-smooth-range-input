import { calculateDragDistance, calculatePosition, getRangedPositionX } from './sliderMeasure';

describe('calculateDragDistance', () => {
  it('should calculate correctly', () => {
    expect(
      calculateDragDistance({
        dragDistance: 100,
        maxPositionX: 200,
        totalStepsNumber: 20,
        min: 20,
      }),
    ).toEqual(30);
  });

  it('should calculate correctly when dragDistance not set', () => {
    expect(
      calculateDragDistance({
        dragDistance: 0,
        maxPositionX: 200,
        totalStepsNumber: 20,
        min: 20,
      }),
    ).toEqual(20);
  });
});

describe('calculatePosition', () => {
  it('should calculate correctly', () => {
    expect(
      calculatePosition(20, 30, {
        width: 1000,
        value: 20,
        min: 0,
        totalStepsNumber: 40,
      }),
    ).toEqual(465);
  });

  it('should prevent position less than 0', () => {
    expect(
      calculatePosition(20, 30, {
        width: 1000,
        value: -20,
        min: 0,
        totalStepsNumber: 40,
      }),
    ).toEqual(0);
  });

  it('should return padding value if position less than padding', () => {
    expect(
      calculatePosition(1, 30, {
        width: 200,
        value: 0,
        min: 0,
        totalStepsNumber: 40,
      }),
    ).toEqual(1);
  });

  it('should stop at max position', () => {
    expect(
      calculatePosition(0, 30, {
        width: 100,
        value: 400,
        min: 0,
        totalStepsNumber: 10,
      }),
    ).toEqual(70);
  });
});

describe('getRangedPositionX', () => {
  it('should get the correct position', () => {
    expect(getRangedPositionX({
      dragX: 40,
      maxPositionX: 100,
      padding: 30,
    })).toEqual(40);

    expect(getRangedPositionX({
      dragX: 10,
      maxPositionX: 100,
      padding: 30,
    })).toEqual(30);

    expect(getRangedPositionX({
      dragX: -20,
      maxPositionX: 100,
      padding: 0,
    })).toEqual(0);

    expect(getRangedPositionX({
      dragX: 1220,
      maxPositionX: 100,
      padding: 30,
    })).toEqual(100);
  });
});
