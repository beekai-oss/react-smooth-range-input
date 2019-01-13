import * as React from 'react';
import { Animate } from 'react-simple-animate';

const commonAnimationProps = {
  easeType: 'cubic-bezier(0.86, 0, 0.07, 1)',
  startStyle: {
    transform: 'translateY(0)',
  },
};
const bubbleWithTail = 'M38.8,19.9C38.8,30.4,19.9,63,19.9,63S1,30.4,1,19.9S9.5,1,19.9,1S38.8,9.5,38.8,19.9z';
const bubble = 'M38.8,43.9c0,10.4-8.5,18.9-18.9,18.9S1,54.4,1,43.9S9.5,24,19.9,24S38.8,33.5,38.8,43.9z';

interface Props {
  onFocus: () => void;
  onBlur: () => void;
  buttonSize: number;
  height: number;
  value: number;
  dragX: number;
  showBubble: boolean;
  isControlByKeyBoard: boolean;
  onMouseDown: (MouseEvent) => void;
  onInteractEnd: (Event) => void;
  backgroundColor?: string;
  inputBackgroundColor?: string;
  inputTextColor?: string;
}

export default function Controller({
  onFocus,
  onBlur,
  buttonSize,
  height,
  dragX,
  showBubble,
  isControlByKeyBoard,
  value,
  onMouseDown,
  onInteractEnd,
  backgroundColor,
  inputBackgroundColor,
  inputTextColor,
}: Props) {
  return (
    <div
      tabIndex={0}
      onClick={e => e.stopPropagation()}
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        borderRadius: '50%',
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        fontSize: '12px',
        color: '#fff',
        top: `${(height - buttonSize) / 2}px`,
        position: 'absolute',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        cursor: '-webkit-grab',
        fontWeight: 600,
        background: 'none',
        border: 'none',
        transform: `translateX(${dragX}px)`,
        transition: isControlByKeyBoard ? '0.15s all ease-in' : '0s all',
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onInteractEnd}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={2}
      aria-valuemax={30}
      aria-valuetext="Years of loan"
    >
      <input
        type="range"
        defaultValue={value.toString()}
        style={{
          visibility: 'hidden',
          width: 0,
          height: 0,
          display: 'block',
          position: 'absolute',
        }}
      />
      <Animate
        play={showBubble}
        {...commonAnimationProps}
        reverseDurationSeconds={0.3}
        durationSeconds={0.2}
        startStyle={{
          transform: 'translateY(0)',
        }}
        endStyle={{
          transform: 'translateY(-22px) scale(1.65)',
          filter: 'drop-shadow( 0 0 2px rgba(0, 0, 0, .2))',
        }}
        easeType="cubic-bezier(0.86, 0, 0.07, 1)"
        render={({ style }) => (
          <svg
            style={{
              position: 'absolute',
              top: '-23px',
              left: 0,
              ...style,
            }}
            x="0px"
            y="0px"
            width={`${buttonSize}px`}
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

      <Animate
        play={showBubble}
        {...commonAnimationProps}
        endStyle={{
          transform: 'translateY(-46px) scale(1.3)',
        }}
        durationSeconds={0.3}
        reverseDurationSeconds={0.1}
        render={({ style }) => (
          <div
            style={{
              background: inputBackgroundColor,
              height: `${buttonSize}px`,
              width: `${buttonSize}px`,
              borderRadius: '50%',
              position: 'absolute',
              ...style,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '10px',
                left: 0,
                width: `${buttonSize}px`,
                color: inputTextColor,
                textAlign: 'center',
              }}
            >
              {value}
            </span>
          </div>
        )}
      />
    </div>
  );
}
