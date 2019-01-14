export const calculateDragDistance = ({
  dragDistance,
  maxPositionX,
  totalStepsNumber,
  min,
}: {
  dragDistance: number;
  maxPositionX: number;
  totalStepsNumber: number;
  min: number;
}) => {
  const result = dragDistance ? dragDistance / (maxPositionX / totalStepsNumber) : 0;
  return Math.ceil(result + min);
};

export const calculatePosition = (
  padding: number,
  buttonSize: number,
  {
    width,
    value,
    min,
    totalStepsNumber,
  }: {
    width: number;
    value: number;
    min: number;
    totalStepsNumber: number;
  },
) => {
  const maxPositionX = width - buttonSize - padding * 2;
  const arrowKeyPerClickDistance = maxPositionX / totalStepsNumber;
  const position = (value - min) * arrowKeyPerClickDistance;

  if (position < 0) return 0;
  if (position < padding) return padding;

  return position > maxPositionX ? maxPositionX : position;
};

export function getRangedPositionX({
  dragX,
  maxPositionX,
  padding,
}: {
  dragX: number;
  maxPositionX: number;
  padding?: number;
}) {
  if (padding && dragX <= padding) {
    return padding;
  }

  if (dragX <= 0) {
    return 0;
  }

  if (dragX >= maxPositionX) {
    return maxPositionX;
  }

  return dragX;
}

export const getMaxScrollDistance = (width: number, buttonSize: number, padding: number) =>
  width - buttonSize - padding;

export const getDistancePerMove = (width: number, numberSteps: number) => width / numberSteps;

export const getTouchPosition = (touchX: number, left: number, buttonSize: number) => touchX - left - buttonSize / 2;

export const getMousePosition = (dragX: number, previousClientX: number, clientX: number) =>
  dragX - (previousClientX - clientX);
