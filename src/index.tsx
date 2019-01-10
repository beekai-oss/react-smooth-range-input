// @flow
import * as React from 'react';
import styled from 'styled-components';
import { Animate } from 'react-simple-animate';
import debounce from 'lodash/debounce';
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

const colors = {
  primary: '',
  white: '',
};
const buttonSize = 33;
const wrapperOffset = 3;
const delayMsForAnimation = 200;
const commonAnimationProps = {
  easeType: 'cubic-bezier(0.86, 0, 0.07, 1)',
  startStyle: {
    transform: 'translateY(0)',
  },
};
const calculatePositionWithOffset = calculatePosition.bind(null, wrapperOffset, buttonSize);
const bubbleWithTail = 'M38.8,19.9C38.8,30.4,19.9,63,19.9,63S1,30.4,1,19.9S9.5,1,19.9,1S38.8,9.5,38.8,19.9z';
const bubble = 'M38.8,43.9c0,10.4-8.5,18.9-18.9,18.9S1,54.4,1,43.9S9.5,24,19.9,24S38.8,33.5,38.8,43.9z';

export const Root = styled.div`
  height: 40px;
  border-radius: 4px;
  background: ${colors.primary};
  position: relative;
  user-select: none;
  cursor: pointer;
  max-width: 459px;
  margin-bottom: 50px;
`;
Root.displayName = 'Root';

const Background = styled.div`
  background: ${colors.white};
  height: buttonSize - 2px;
  width: buttonSize - 2px;
  border-radius: 50%;
  left: 2px;
  position: absolute;
`;

const RoundButton = styled.div`
  border-radius: 50%;
  width: buttonSizepx;
  height: buttonSizepx;
  font-size: 12px;
  color: ${colors.white};
  position: absolute;
  white-space: nowrap;
  text-align: center;
  top: 2px;
  cursor: move;
  cursor: -webkit-grab;
  font-weight: 600;
  padding: 2)} 0px;
  background: none;
  border: none;
`;

const CircleSvg = styled.svg`
  position: absolute;
  top: -23px;
  left: 1px;

  & > path {
    transition: 0.3s all;
    fill: ${colors.primary};
  }
`;

const Text = styled.span`
  position: absolute;
  top: 10px;
  left: -1px;
  width: buttonSizepx;
  color: ${colors.primary};
  text-align: center;
`;

type Props = {
  value: number;
  totalStepsNumber: number;
  onChange: (any) => void;
  valueOffset: number;
  footer: React.ReactNode;
  heading: React.ReactNode;
};

type State = {
  dragX: number;
  showBubble: boolean;
};

export default class Slider extends React.PureComponent<Props, State> {
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

  componentDidMount(): void {
    const { width } = this.wrapperRef.current.getBoundingClientRect();
    const { value, valueOffset, totalStepsNumber } = this.props;
    this.maxScrollDistance = getMaxScrollDistance(width, buttonSize, wrapperOffset);
    this.arrowKeyPerClickDistance = getDistancePerMove(this.maxScrollDistance, totalStepsNumber);
    this.restoreTouchMove = preventScrollOnMobile.call(this);
    window.addEventListener('resize', this.onResize);

    this.setState({
      dragX: calculatePositionWithOffset({
        totalWidth: width,
        value,
        valueOffset,
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
    const { valueOffset, totalStepsNumber } = this.props;
    this.maxScrollDistance = getMaxScrollDistance(width, buttonSize, wrapperOffset);
    this.arrowKeyPerClickDistance = getDistancePerMove(this.maxScrollDistance, totalStepsNumber);

    this.setState({
      dragX: calculatePositionWithOffset({
        totalWidth: width,
        value: this.value,
        valueOffset,
        totalStepsNumber,
      }),
    });
  }, 1000);

  restoreTouchMove = () => {};

  commonOnStart = (e: Event) => {
    e.stopPropagation();
    this.isControlByKeyBoard = false;
    this.setState({
      showBubble: true,
    });
  };

  onTouchStart = (e: TouchEvent) => {
    e.stopPropagation();
    this.isTouching = true;
    const { left } = this.wrapperRef.current.getBoundingClientRect();

    this.commonOnStart(e);
    this.setState({
      dragX: getRangedPositionX(getTouchPosition(e.targetTouches[0].pageX, left, buttonSize), this.maxScrollDistance),
    });
  };

  onMouseDown = (e: MouseEvent) => {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onInteractEnd);
    this.commonOnStart(e);
    this.clientX = e.clientX;
  };

  onInteractEnd = (e: Event) => {
    e.stopPropagation();
    this.isTouching = false;
    this.setState({
      showBubble: false,
    });
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onInteractEnd);
    this.calculateValueAndUpdateStore();
  };

  onTouchMove = (e: TouchEvent) => {
    e.stopPropagation();
    const { left } = this.wrapperRef.current.getBoundingClientRect();

    this.setState({
      dragX: getRangedPositionX(getTouchPosition(e.targetTouches[0].pageX, left, buttonSize), this.maxScrollDistance),
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
      dragX: getRangedPositionX(getTouchPosition(x, left, buttonSize), this.maxScrollDistance),
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
    const { totalStepsNumber, valueOffset, onChange } = this.props;
    const { dragX } = this.state;

    this.value = calculateDragDistance({
      dragDistance: dragX,
      maxPositionX: this.maxScrollDistance,
      totalStepsNumber,
      valueOffset,
    });

    if (isUpdateStore) {
      onChange({
        athTotalTerm: this.value,
      });
    }
  }

  render() {
    const { dragX, showBubble } = this.state;
    const { footer, heading } = this.props;

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
          {heading}
        </Animate>
        <Root
          ref={this.wrapperRef}
          onClick={this.slideTo}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onInteractEnd}
        >
          <RoundButton
            tabIndex={0}
            onClick={e => e.stopPropagation()}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            style={{
              transform: `translateX(${dragX}px)`,
              transition: this.isControlByKeyBoard ? '0.15s all ease-in' : '0s all',
            }}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onInteractEnd}
            role="slider"
            aria-valuenow={this.value}
            aria-valuemin="2"
            aria-valuemax="30"
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
                <CircleSvg style={style} x="0px" y="0px" width={`${buttonSize}px`} height="64px" viewBox="0 0 40 64">
                  <path d={showBubble ? bubbleWithTail : bubble} />
                </CircleSvg>
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
                <Background style={style}>
                  <Text>{this.value}</Text>
                </Background>
              )}
            />
          </RoundButton>

          <SliderIndicator />

          {footer}
        </Root>
      </>
    );
  }
}
