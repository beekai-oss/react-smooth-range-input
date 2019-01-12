export default function findElementXandY(e) {
  const rect = e.target.getBoundingClientRect();
  return { x: e.clientX || e.touches[0].clientX - rect.left, y: e.clientY || e.touches[0].clientY - rect.top };
}
