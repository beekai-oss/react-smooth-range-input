// @flow
import * as React from 'react';
import { Animate } from 'react-simple-animate';
import debounce from 'lodash.debounce';
import findElementXandY from './utilities/findElementXandY';
import {
  calculateDragDistance,
  getRangedPositionX,
  calculatePosition,
  getMaxScrollDistance,
  getDistancePerMove,
  getTouchPosition,
  getMousePosition,
} from './utilities/sliderMeasure';
import SliderIndicator from './SliderIndicator';
import isTouchDevice from './utilities/isTouchDevice';
import preventScrollOnMobile from './utilities/preventScrollOnMobile';

const topBottomPadding = 8;
const delayMsForAnimation = 200;
const commonAnimationProps = {
  easeType: 'cubic-bezier(0.86, 0, 0.07, 1)',
  startStyle: {
    transform: 'translateY(0)',
  },
};
const bubbleWithTail = 'M38.8,19.9C38.8,30.4,19.9,63,19.9,63S1,30.4,1,19.9S9.5,1,19.9,1S38.8,9.5,38.8,19.9z';
const bubble = 'M38.8,43.9c0,10.4-8.5,18.9-18.9,18.9S1,54.4,1,43.9S9.5,24,19.9,24S38.8,33.5,38.8,43.9z';

type Props = {
  value?: number;
  onChange?: (any) => void;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  height: number;
  backgroundColor?: string;
  inputColor?: string;
  textColor?: string;
  disabled?: boolean;
  min: number;
  max: number;
  padding: number;
};

type State = {
  dragX: number;
  showBubble: boolean;
};

export default class Slider extends React.PureComponent<Props, State> {
  static defaultProps = {
    value: 0,
    onChange: () => {},
    header: null,
    footer: null,
    backgroundColor: '#244BA8',
    inputTextColor: '#244BA8',
    inputBackgroundColor: '#fff',
    disabled: false,
    height: 40,
    leftRightPadding: 2,
  };

  state = {
    dragX: 0,
    showBubble: false,
  };

  isControlByKeyBoard = false;

  wrapperRef: any = React.createRef();

  touchDevice: boolean = isTouchDevice();

  maxScrollDistance = 0;

  arrowKeyPerClickDistance = 0;

  clientX = 0;

  value = 0;

  isTouching = false;

  timer: any;

  buttonSize = this.props.height - topBottomPadding;

  calculatePositionWithOffset = calculatePosition.bind(null, this.props.padding, this.buttonSize);

  componentDidMount(): void {
    const { width } = this.wrapperRef.current.getBoundingClientRect();
    const { value, min, max, padding } = this.props;
    const totalStepsNumber = max - min;
    this.maxScrollDistance = getMaxScrollDistance(width, this.buttonSize, padding);
    this.arrowKeyPerClickDistance = getDistancePerMove(this.maxScrollDistance, totalStepsNumber);
    this.restoreTouchMove = preventScrollOnMobile.call(this);
    window.addEventListener('resize', this.onResize);

    this.setState({
      dragX: this.calculatePositionWithOffset({
        totalWidth: width,
        value,
        min,
        totalStepsNumber,
      }),
    });
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', this.onKeyEvent);
    document.removeEventListener('mouseup', this.onInteractEnd);
    document.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);

    clearTimeout(this.timer);
    this.restoreTouchMove();
  }

  onResize = debounce(() => {
    const { width } = this.wrapperRef.current.getBoundingClientRect();
    const { min, max, padding } = this.props;
    const totalStepsNumber = max - min;
    this.maxScrollDistance = getMaxScrollDistance(width, this.buttonSize, padding);
    this.arrowKeyPerClickDistance = getDistancePerMove(this.maxScrollDistance, totalStepsNumber);

    this.setState({
      dragX: this.calculatePositionWithOffset({
        totalWidth: width,
        value: this.value,
        min,
        totalStepsNumber,
      }),
    });
  }, 1000);

  restoreTouchMove = () => {};

  commonOnStart: any = (e: Event) => {
    e.stopPropagation();
    this.isControlByKeyBoard = false;
    this.setState({
      showBubble: true,
    });
  };

  onTouchStart: any = (e: TouchEvent): void => {
    e.stopPropagation();
    this.isTouching = true;
    const { left } = this.wrapperRef.current.getBoundingClientRect();

    this.commonOnStart(e);
    this.setState({
      dragX: getRangedPositionX(
        getTouchPosition(e.targetTouches[0].pageX, left, this.buttonSize),
        this.maxScrollDistance,
      ),
    });
  };

  onMouseDown: any = (e: MouseEvent): void => {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onInteractEnd);
    this.commonOnStart(e);
    this.clientX = e.clientX;
  };

  onInteractEnd: any = (e: Event): any => {
    e.stopPropagation();
    this.isTouching = false;
    this.setState({
      showBubble: false,
    });
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onInteractEnd);
    this.calculateValueAndUpdateStore();
  };

  onTouchMove: any = (e: TouchEvent) => {
    e.stopPropagation();
    const { left } = this.wrapperRef.current.getBoundingClientRect();

    this.setState({
      dragX: getRangedPositionX(
        getTouchPosition(e.targetTouches[0].pageX, left, this.buttonSize),
        this.maxScrollDistance,
      ),
    });
  };

  onMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    const { dragX } = this.state;

    this.setState({
      dragX: getRangedPositionX(getMousePosition(dragX, this.clientX, e.clientX), this.maxScrollDistance),
    });

    this.clientX = e.clientX;
  };

  slideTo = (e: any) => {
    if (this.touchDevice) return;
    const { left } = e.target.getBoundingClientRect();
    const { x } = findElementXandY(e);
    this.isControlByKeyBoard = true;
    clearTimeout(this.timer);

    this.setState({
      dragX: getRangedPositionX(getTouchPosition(x, left, this.buttonSize), this.maxScrollDistance),
    });

    this.timer = setTimeout(() => {
      this.calculateValueAndUpdateStore();
    }, delayMsForAnimation);
  };

  onKeyEvent = (e: KeyboardEvent) => {
    this.isControlByKeyBoard = true;
    const { dragX } = this.state;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        this.setState({
          dragX: getRangedPositionX(dragX - this.arrowKeyPerClickDistance, this.maxScrollDistance),
        });
        break;
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        this.setState({
          dragX: getRangedPositionX(dragX + this.arrowKeyPerClickDistance, this.maxScrollDistance),
        });
        break;
      default:
        break;
    }

    this.calculateValueAndUpdateStore();
  };

  onFocus = () => document.addEventListener('keydown', this.onKeyEvent);

  onBlur = () => document.removeEventListener('keydown', this.onKeyEvent);

  calculateValueAndUpdateStore(isUpdateStore: boolean = true) {
    const { max, min, onChange } = this.props;
    const totalStepsNumber = max - min;
    const { dragX } = this.state;

    this.value = calculateDragDistance({
      dragDistance: dragX,
      maxPositionX: this.maxScrollDistance,
      totalStepsNumber,
      min,
    });

    if (isUpdateStore) {
      onChange({
        athTotalTerm: this.value,
      });
    }
  }

  render() {
    const { dragX, showBubble } = this.state;
    const { footer, header, height } = this.props;

    this.calculateValueAndUpdateStore(false);

    return (
      <>
        <Animate
          durationSeconds={0.2}
          reverseDurationSeconds={0.3}
          play={this.isTouching}
          startStyle={{ opacity: 1 }}
          endStyle={{ opacity: 0 }}
        >
          {header}
        </Animate>
        <div
          style={{
            height: `${height}px`,
            borderRadius: '4px',
            background: 'red',
            position: 'relative',
            userSelect: 'none',
            cursor: 'pointer',
            marginBottom: '50px',
          }}
          ref={this.wrapperRef}
          onClick={this.slideTo}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onInteractEnd}
        >
          <div
            tabIndex={0}
            onClick={e => e.stopPropagation()}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            style={{
              borderRadius: '50%',
              width: `${this.buttonSize}px`,
              height: `${this.buttonSize}px`,
              fontSize: '12px',
              color: '#fff',
              position: 'absolute',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              top: '2px',
              cursor: '-webkit-grab',
              fontWeight: 600,
              leftRightPadding: '20px',
              background: 'none',
              border: 'none',
              transform: `translateX(${dragX}px)`,
              transition: this.isControlByKeyBoard ? '0.15s all ease-in' : '0s all',
            }}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onInteractEnd}
            role="slider"
            aria-valuenow={this.value}
            aria-valuemin={2}
            aria-valuemax={30}
            aria-valuetext="Years of loan"
          >
            <input
              type="range"
              defaultValue={this.value.toString()}
              style={{
                visibility: 'hidden',
                width: 0,
                height: 0,
                display: 'block',
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
              }}
              easeType="cubic-bezier(0.86, 0, 0.07, 1)"
              render={({ style }) => (
                <svg
                  style={{
                    position: 'absolute',
                    top: '-23px',
                    left: '1px',
                    ...style,
                  }}
                  x="0px"
                  y="0px"
                  width={`${this.buttonSize}px`}
                  height="64px"
                  viewBox="0 0 40 64"
                >
                  <path
                    style={{
                      transition: '0.3s all',
                      fill: 'red',
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
                    background: '#fff',
                    height: `${this.buttonSize - 2}px`,
                    width: `${this.buttonSize - 2}px`,
                    borderRadius: '50%',
                    left: '2px',
                    position: 'absolute',
                    ...style,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '-1px',
                      width: `${this.buttonSize}px`,
                      color: 'red',
                      textAlign: 'center',
                    }}
                  >
                    {this.value}
                  </span>
                </div>
              )}
            />
          </div>

          <SliderIndicator />

          <div
            style={{
              pointerEvents: 'none',
            }}
          >
            {footer}
          </div>
        </div>
      </>
    );
  }
}
