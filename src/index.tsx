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
import Controller from './Controller';
import isTouchDevice from './utilities/isTouchDevice';
import preventScrollOnMobile from './utilities/preventScrollOnMobile';
import colors from './constants/colors';

const topBottomPadding = 6;
const delayMsForAnimation = 200;

interface Props {
  value?: number;
  onChange?: (number) => void;
  disabled?: boolean;
  padding?: number;
  backgroundColor?: string;
  textColor?: string;
  textBackgroundColor?: string;
  hasTickMarks: boolean;
  tickColor?: string;
  type?: 'thick' | 'thin';
  min: number;
  max: number;
}

interface State {
  dragX: number;
  showBubble: boolean;
}

const height = 40;

export class Slider extends React.PureComponent<Props, State> {
  static defaultProps = {
    value: 0,
    onChange: () => {},
    backgroundColor: colors.blue,
    textColor: colors.blue,
    textBackgroundColor: colors.white,
    tickColor: colors.lightBlue,
    disabled: false,
    padding: 3,
    hasTickMarks: true,
    type: 'thick',
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

  buttonSize = height - topBottomPadding;

  totalStepsNumber: number = this.props.max - this.props.min;

  calculatePositionWithOffset = calculatePosition.bind(null, this.props.padding!, this.buttonSize);

  restoreTouchMove = () => {};

  componentDidMount(): void {
    const { width } = this.wrapperRef.current.getBoundingClientRect();
    const { value, min, padding } = this.props;
    this.maxScrollDistance = getMaxScrollDistance(width, this.buttonSize, padding!);
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
    this.maxScrollDistance = getMaxScrollDistance(width, this.buttonSize, padding!);
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
    e.stopPropagation();
    this.isTouching = true;
    const { left } = this.wrapperRef.current.getBoundingClientRect();
    const { padding } = this.props;

    this.commonOnStart(e);
    this.setState({
      dragX: getRangedPositionX({
        padding,
        dragX: getTouchPosition(e.targetTouches[0].pageX, left, this.buttonSize),
        maxPositionX: this.maxScrollDistance,
      }),
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
    const { padding } = this.props;

    this.setState({
      dragX: getRangedPositionX({
        padding,
        dragX: getTouchPosition(e.targetTouches[0].pageX, left, this.buttonSize),
        maxPositionX: this.maxScrollDistance,
      }),
    });
  };

  onMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    const { dragX } = this.state;
    const { padding } = this.props;

    this.setState({
      dragX: getRangedPositionX({
        padding,
        dragX: getMousePosition(dragX, this.clientX, e.clientX),
        maxPositionX: this.maxScrollDistance,
      }),
    });

    this.clientX = e.clientX;
  };

  slideTo = (e: any) => {
    if (this.touchDevice) return;
    const { left } = e.target.getBoundingClientRect();
    const { x } = findElementXandY(e);
    const { padding } = this.props;
    this.isControlByKeyBoard = true;
    clearTimeout(this.timer);

    this.setState({
      dragX: getRangedPositionX({
        padding,
        dragX: getTouchPosition(x, left, this.buttonSize),
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
    const { padding } = this.props;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        this.setState({
          dragX: getRangedPositionX({
            padding,
            dragX: dragX - this.arrowKeyPerClickDistance,
            maxPositionX: this.maxScrollDistance,
          }),
        });
        break;
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        this.setState({
          dragX: getRangedPositionX({
            padding,
            dragX: dragX + this.arrowKeyPerClickDistance,
            maxPositionX: this.maxScrollDistance,
          }),
        });
        break;
      default:
        break;
    }

    this.calculateValueAndUpdateStore();
  };

  calculateValueAndUpdateStore(isUpdateStore: boolean = true) {
    const { min, onChange, padding = 0 } = this.props;
    const { dragX } = this.state;

    this.value = calculateDragDistance({
      dragDistance: dragX - padding,
      maxPositionX: this.maxScrollDistance,
      totalStepsNumber: this.totalStepsNumber,
      min,
    });

    if (isUpdateStore && onChange) {
      onChange(this.value);
    }
  }

  render() {
    const { dragX, showBubble } = this.state;
    const { hasTickMarks, textBackgroundColor, backgroundColor, textColor, tickColor, type } = this.props;
    const isThin = type === 'thin';

    this.calculateValueAndUpdateStore(false);
    console.log(hasTickMarks)

    return (
      <div
        style={{
          height: `${height}px`,
          width: '100%',
          borderRadius: '4px',
          ...(isThin ? { paddingTop: '15px' } : { background: backgroundColor }),
          position: 'relative',
          userSelect: 'none',
          cursor: 'pointer',
        }}
        ref={this.wrapperRef}
        onClick={this.slideTo}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onInteractEnd}
      >
        <Controller
          onFocus={() => document.addEventListener('keydown', this.onKeyEvent)}
          onBlur={() => document.removeEventListener('keydown', this.onKeyEvent)}
          buttonSize={this.buttonSize}
          height={height}
          dragX={dragX}
          showBubble={showBubble}
          isControlByKeyBoard={this.isControlByKeyBoard}
          value={this.value}
          onMouseDown={this.onMouseDown}
          onInteractEnd={this.onInteractEnd}
          backgroundColor={backgroundColor}
          textBackgroundColor={textBackgroundColor}
          textColor={textColor}
          isThin={isThin}
        />
        {(hasTickMarks || isThin) && (
          <SliderIndicator
            backgroundColor={backgroundColor}
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
