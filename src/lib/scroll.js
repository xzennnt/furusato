export function scrollToMapSection() {
  const target = document.getElementById('map');

  if (!target) {
    return false;
  }

  const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
  const offset = headerHeight + 18;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
  return true;
}
