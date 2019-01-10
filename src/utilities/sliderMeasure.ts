// @flow
export const calculateDragDistance = ({
  dragDistance,
  maxPositionX,
  totalStepsNumber,
  min,
}: {
  dragDistance: number,
  maxPositionX: number,
  totalStepsNumber: number,
  min: number,
}) => {
  const result = dragDistance ? dragDistance / (maxPositionX / totalStepsNumber) : 0;
  return Math.ceil(result + min);
};

export const calculatePosition = (
  wrapperOffset: number,
  buttonSize: number,
  {
    totalWidth,
    value,
    min,
    totalStepsNumber,
  }: {
    totalWidth: number,
    value: number,
    min: number,
    totalStepsNumber: number,
  },
) => {
  const maxPositionX = totalWidth - buttonSize - wrapperOffset;
  const arrowKeyPerClickDistance = maxPositionX / totalStepsNumber;
  const position = (value - min) * arrowKeyPerClickDistance;

  return position > maxPositionX ? maxPositionX : position;
};

export function getRangedPositionX(dragX: number, maxPositionX: number) {
  if (dragX <= 0) {
    return 0;
  }

  if (dragX >= maxPositionX) {
    return maxPositionX;
  }

  return dragX;
}

export const getMaxScrollDistance = (width: number, buttonSize: number, wrapperOffset: number) =>
  width - buttonSize - wrapperOffset;

export const getDistancePerMove = (width: number, numberSteps: number) => width / numberSteps;

export const getTouchPosition = (touchX: number, left: number, buttonSize: number) => touchX - left - buttonSize / 2;

export const getMousePosition = (dragX: number, previousClientX: number, clientX: number) =>
  dragX - (previousClientX - clientX);
