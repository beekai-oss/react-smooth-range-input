export default function preventScrollOnMobile() {
  let originalOnTouchMove;
  const preventDefault = (e) => e.preventDefault();

  const preventAction = (e?: any) => {
    // @ts-ignore
    if (!this.isTouching) return;
    if (e) preventDefault(e);
    document.addEventListener('touchmove', preventDefault, { passive: false });

    return false;
  };

  if (!preventAction()) {
    originalOnTouchMove = document.ontouchmove;
  }

  document.ontouchmove = preventAction;
  document.ontouchmove = preventAction; // no joke: only the second one (.ontouchmove) works on mobile safari :)

  return () => {
    document.ontouchmove = originalOnTouchMove;
    document.removeEventListener('touchmove', preventDefault);
  };
}
