import * as React from 'react';
import { Animate } from 'react-simple-animate';
import FlipNumbers from 'react-flip-numbers';
import { bubbleWithTail, bubble } from './constants/svgPath';

const commonAnimationProps = {
  easeType: 'cubic-bezier(0.86, 0, 0.07, 1)',
  startStyle: {
    transform: 'translateY(0)',
  },
};

interface Props {
  onFocus: () => void;
  onBlur: () => void;
  buttonHeight: number;
  height: number;
  value: number;
  dragX: number;
  showBubble: boolean;
  isControlByKeyBoard: boolean;
  isThin: boolean;
  onMouseDown: (MouseEvent) => void;
  onInteractEnd: (Event) => void;
  backgroundColor?: string;
  textBackgroundColor?: string;
  textColor?: string;
  isTouchDevice: boolean;
  disabled?: boolean;
  shouldDisplayValue?: boolean;
  controller?: any;
  max: number,
  min: number,
}

const flipNumberProps = {
  height: 14,
  width: 9,
  color: 'black',
  background: 'white',
  perspective: 370,
  durationSeconds: 0.4,
  play: true,
  numberStyle: { outline: '1px solid transparent' },
  disabled: false,
};

export default React.forwardRef(function Controller(
  {
    onFocus,
    onBlur,
    buttonHeight,
    height,
    dragX,
    showBubble,
    isControlByKeyBoard,
    value,
    onMouseDown,
    onInteractEnd,
    backgroundColor,
    textBackgroundColor,
    textColor,
    isThin,
    isTouchDevice,
    disabled,
    shouldDisplayValue,
    controller,
    max,
    min,
  }: Props,
  ref: any,
) {
  let top = (isThin ? height - buttonHeight : height - buttonHeight) / 2;

  if (controller) {
    top = isThin ? (height - buttonHeight) / 2 : height - buttonHeight;
  }

  return (
    <div
      tabIndex={0}
      {...(isTouchDevice
        ? {}
        : {
            onClick: e => e.stopPropagation(),
            onFocus: onFocus,
            onBlur: onBlur,
            onMouseDown: onMouseDown,
            onMouseUp: onInteractEnd,
          })}
      style={{
        top: `${top}px`,
        position: 'absolute',
        cursor: disabled ? 'not-allowed' : '-webkit-grab',
        fontWeight: 600,
        transform: `translateX(${dragX}px)`,
        transition: isControlByKeyBoard ? '0.15s all ease-in' : '0s all',
      }}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={value.toString()}
    >
      {!controller && (
        <Animate
          play={showBubble}
          {...commonAnimationProps}
          reverseDurationSeconds={0.3}
          durationSeconds={0.2}
          startStyle={{
            transform: 'translateY(0)',
          }}
          endStyle={{
            transform: `translateY(-${isThin ? 32 : 22}px) scale(1.65)`,
          }}
          easeType="cubic-bezier(0.86, 0, 0.07, 1)"
          render={({ style }) => (
            <svg
              style={{
                position: 'absolute',
                top: '-25px',
                left: 0,
                ...style,
              }}
              x="0px"
              y="0px"
              width={`${buttonHeight}px`}
              height="64px"
              viewBox="0 0 40 64"
            >
              <path
                style={{
                  transition: '0.3s all',
                  fill: backgroundColor,
                }}
                d={showBubble ? bubbleWithTail : bubble}
              />
            </svg>
          )}
        />
      )}

      <Animate
        play={showBubble}
        {...commonAnimationProps}
        endStyle={{
          transform: `translateY(-${isThin ? 58 : 48}px) scale(1.3)`,
        }}
        durationSeconds={0.3}
        reverseDurationSeconds={0.1}
        render={({ style }) => {
          return controller ? (
            controller({
              ref,
              value,
            })
          ) : (
            <div
              style={{
                background: textBackgroundColor,
                height: `${buttonHeight}px`,
                width: `${buttonHeight}px`,
                borderRadius: '50%',
                position: 'absolute',
                ...style,
              }}
            >
              {shouldDisplayValue && (
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: 0,
                    width: `${buttonHeight}px`,
                    color: textColor,
                  }}
                >
                  <FlipNumbers {...flipNumberProps} numbers={value.toString()} />
                </span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
});
