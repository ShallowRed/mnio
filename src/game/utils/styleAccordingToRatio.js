export default function styleAccordingToRatio({ domEl, styles }) {

  const ratio = isWidthLarger();

  for (const [key, value] of Object.entries(styles)) {
    domEl.style[key] = value[ratio ? 0 : 1];
  }
}

const isWidthLarger = () => {
  return window.innerWidth >= window.innerHeight;
};
