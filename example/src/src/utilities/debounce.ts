export default function debounce(func, wait) {
  let timeout;

  return function() {
    // @ts-ignore
    const context = this;
    const args = arguments;

    const later = function() {
      timeout = null;
      func.apply(context, args);
    };

    const callNow = !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}
