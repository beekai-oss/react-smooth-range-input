import * as React from 'react';
import { Animate } from 'react-simple-animate';
import debounce from './utilities/debounce';
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
import SliderIndicator from './sliderIndicator';
import Controller from './controller';
import isTouchDevice from './utilities/isTouchDevice';
import preventScrollOnMobile from './utilities/preventScrollOnMobile';
import colors from './constants/colors';

const delayMsForAnimation = 200;

interface Props {
  min: number;
  max: number;
  value?: number;
  hasTickMarks?: boolean;
  onChange?: (number) => void;
  disabled?: boolean;
  padding?: number;
  barColor?: string;
  textColor?: string;
  textBackgroundColor?: string;
  tickColor?: string;
  customController?: ({ ref: any, value: number }) => React.ReactNode;
  shouldAnimateOnTouch?: boolean;
  shouldDisplayValue?: boolean;
  shouldAnimateNumber?: boolean;
  controllerWidth?: number;
  controllerHeight?: number;
  barHeight?: number;
  barStyle: { string: number | string };
  focusStyle?: string,
}

interface State {
  dragX: number;
  showBubble: boolean;
  isFocusing: boolean,
}

export default class Slider extends React.PureComponent<Props, State> {
  static defaultProps = {
    value: 0,
    onChange: () => {},
    barColor: colors.blue,
    textColor: colors.blue,
    textBackgroundColor: colors.white,
    tickColor: colors.lightBlue,
    disabled: false,
    padding: 3,
    hasTickMarks: true,
    shouldAnimateOnTouch: true,
    shouldDisplayValue: true,
    shouldAnimateNumber: true,
    customController: null,
    controllerWidth: 34,
    controllerHeight: 34,
    barHeight: 40,
    barStyle: {},
  };

  state = {
    dragX: 0,
    showBubble: false,
    isFocusing: false,
  };

  isControlByKeyBoard = false;

  wrapperRef: any = React.createRef();

  touchDevice: boolean = isTouchDevice();

  controllerRef: any = React.createRef();

  maxScrollDistance = 0;

  arrowKeyPerClickDistance = 0;

  controllerHeight = this.props.controllerHeight || 0;

  controllerWidth = this.props.controllerWidth || 0;

  clientX = 0;

  value = 0;

  isTouching = false;

  timer: any;

  totalStepsNumber: number = this.props.max - this.props.min;

  calculatePositionWithOffset = calculatePosition.bind(null, this.props.padding!, this.controllerHeight);

  restoreTouchMove = () => {};

  componentDidMount(): void {
    const { width } = this.wrapperRef.current.getBoundingClientRect();
    const { value, min, padding = 0 } = this.props;

    if (this.controllerRef && this.controllerRef.current) {
      const { width: controllerWidth, height: controllerHeight } = this.controllerRef.current.getBoundingClientRect();
      this.controllerWidth = controllerWidth;
      this.controllerHeight = controllerHeight;
    }

    this.maxScrollDistance = getMaxScrollDistance(width, this.controllerWidth, padding!);
    this.arrowKeyPerClickDistance = getDistancePerMove(this.maxScrollDistance, this.totalStepsNumber);
    this.restoreTouchMove = preventScrollOnMobile.call(this);
    window.addEventListener('resize', this.onResize);

    this.setState({
      dragX: this.calculatePositionWithOffset({
        width,
        value: value!,
        min,
        totalStepsNumber: this.totalStepsNumber,
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
    const { min, padding } = this.props;
    this.maxScrollDistance = getMaxScrollDistance(width, this.controllerWidth, padding!);
    this.arrowKeyPerClickDistance = getDistancePerMove(this.maxScrollDistance, this.totalStepsNumber);

    this.setState({
      dragX: this.calculatePositionWithOffset({
        width,
        value: this.value,
        min,
        totalStepsNumber: this.totalStepsNumber,
      }),
    });
  }, 1000);

  commonOnStart: any = (e: Event) => {
    e.stopPropagation();
    this.isControlByKeyBoard = false;
    this.setState({
      showBubble: true,
    });
  };

  onTouchStart: any = (e: TouchEvent): void => {
    const { padding, disabled } = this.props;
    if (disabled) return;
    this.isTouching = true;
    this.restoreTouchMove = preventScrollOnMobile.call(this);
    const { left } = this.wrapperRef.current.getBoundingClientRect();

    this.commonOnStart(e);
    this.setState({
      dragX: getRangedPositionX({
        padding,
        dragX: getTouchPosition(e.targetTouches[0].pageX, left, this.controllerWidth),
        maxPositionX: this.maxScrollDistance,
      }),
    });
    document.addEventListener('touchend', this.onInteractEnd);
  };

  onMouseDown: any = (e: MouseEvent): void => {
    if (this.touchDevice) return;
    if (this.props.disabled) return;

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
    document.removeEventListener('touchend', this.onInteractEnd);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onInteractEnd);
    this.restoreTouchMove();
    this.calculateValueAndUpdateStore();
  };

  onTouchMove: any = (e: TouchEvent) => {
    e.stopPropagation();
    const { left } = this.wrapperRef.current.getBoundingClientRect();
    const { padding, disabled } = this.props;
    if (disabled) return;

    this.setState({
      dragX: getRangedPositionX({
        padding,
        dragX: getTouchPosition(e.targetTouches[0].pageX, left, this.controllerWidth),
        maxPositionX: this.maxScrollDistance,
      }),
    });
  };

  onMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    const { dragX } = this.state;
    const { padding, disabled } = this.props;
    if (disabled) return;

    this.setState({
      dragX: getRangedPositionX({
        padding,
        dragX: getMousePosition(dragX, this.clientX, e.clientX),
        maxPositionX: this.maxScrollDistance,
      }),
    });

    this.clientX = e.clientX;
  };

  onClick = (e: any) => {
    const { padding, disabled } = this.props;
    if (disabled) return;

    const { left } = e.target.getBoundingClientRect();
    const { x } = findElementXandY(e);
    this.isControlByKeyBoard = true;
    clearTimeout(this.timer);

    this.setState({
      dragX: getRangedPositionX({
        padding,
        dragX: getTouchPosition(x, left, this.controllerWidth),
        maxPositionX: this.maxScrollDistance,
      }),
    });

    this.timer = setTimeout(() => {
      this.calculateValueAndUpdateStore();
    }, delayMsForAnimation);
  };

  onKeyEvent = (e: KeyboardEvent) => {
    this.isControlByKeyBoard = true;
    const { dragX } = this.state;
    const { padding, disabled } = this.props;
    if (disabled || !['ArrowDown', 'ArrowLeft', 'ArrowUp', 'ArrowRight'].includes(e.key)) return;

    e.preventDefault();
    const isPressedLeft = ['ArrowUp', 'ArrowRight'].includes(e.key);
    this.setState({
      dragX: getRangedPositionX({
        padding,
        dragX: isPressedLeft ? dragX + this.arrowKeyPerClickDistance : dragX - this.arrowKeyPerClickDistance,
        maxPositionX: this.maxScrollDistance,
      }),
    });

    this.calculateValueAndUpdateStore();
  };

  calculateValueAndUpdateStore(shouldTriggerOnChange: boolean = true) {
    const { min, onChange, padding = 0 } = this.props;
    const { dragX } = this.state;

    this.value = calculateDragDistance({
      dragDistance: dragX - padding,
      maxPositionX: this.maxScrollDistance,
      totalStepsNumber: this.totalStepsNumber,
      min,
    });

    if (shouldTriggerOnChange && onChange) {
      onChange(this.value);
    }
  }

  render() {
    const { dragX, showBubble, isFocusing } = this.state;
    const {
      hasTickMarks,
      textBackgroundColor,
      barColor,
      textColor,
      tickColor,
      disabled,
      shouldAnimateOnTouch,
      shouldDisplayValue,
      customController,
      max,
      min,
      barHeight = 0,
      barStyle = {},
      shouldAnimateNumber,
      focusStyle,
    } = this.props;
    const isThin = barHeight < this.controllerHeight;
    this.calculateValueAndUpdateStore(false);

    return (
      <div
        style={{
          height: `${barHeight}px`,
          width: '100%',
          borderRadius: '4px',
          background: barColor,
          ...(isThin ? { marginTop: `${this.controllerHeight - barHeight}px` } : {}),
          position: 'relative',
          MozUserSelect: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
          ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : { cursor: 'pointer' }),
          ...barStyle,
        }}
        {...(this.touchDevice
          ? {
              onTouchStart: this.onTouchStart,
              onTouchMove: this.onTouchMove,
            }
          : {
              onClick: this.onClick,
            })}
        ref={this.wrapperRef}
      >
        <Controller
          isTouchDevice={this.touchDevice}
          focusStyle={focusStyle}
          onFocus={() => {
            this.setState({
              isFocusing: true,
            });
            document.addEventListener('keydown', this.onKeyEvent)
          }}
          onBlur={() => {
            this.setState({
              isFocusing: false,
            });
            document.removeEventListener('keydown', this.onKeyEvent)
          }}
          height={barHeight}
          isFocusing={isFocusing}
          controllerWidth={this.controllerWidth}
          controllerHeight={this.controllerHeight}
          dragX={dragX}
          showBubble={showBubble && !!shouldAnimateOnTouch}
          shouldAnimateNumber={shouldAnimateNumber}
          isControlByKeyBoard={this.isControlByKeyBoard}
          value={this.value}
          shouldDisplayValue={shouldDisplayValue}
          onMouseDown={this.onMouseDown}
          onInteractEnd={this.onInteractEnd}
          barColor={barColor}
          textBackgroundColor={textBackgroundColor}
          textColor={textColor}
          isThin={isThin}
          disabled={disabled}
          customController={customController}
          ref={this.controllerRef}
          max={max}
          min={min}
        />
        {(hasTickMarks || isThin) && (
          <SliderIndicator
            barColor={barColor}
            color={tickColor}
            amount={this.totalStepsNumber}
            isThin={isThin}
            hasTickMarks={hasTickMarks}
          />
        )}
      </div>
    );
  }
}
