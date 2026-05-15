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

export function scrollToHashTarget(hash, options = {}) {
  const selector = hash?.startsWith('#') ? hash : `#${hash || ''}`;
  const targetId = selector.replace('#', '');
  const maxAttempts = options.maxAttempts || 12;
  const delayMs = options.delayMs || 50;
  const headerSelector = options.headerSelector || '.site-header';
  const extraOffset = options.extraOffset ?? 24;

  let attempt = 0;

  const tryScroll = () => {
    const target = document.getElementById(targetId) || document.querySelector(selector);

    if (!target) {
      attempt += 1;

      if (attempt < maxAttempts) {
        window.setTimeout(tryScroll, delayMs);
      }

      return false;
    }

    const headerHeight = document.querySelector(headerSelector)?.offsetHeight || 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - (headerHeight + extraOffset);

    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    return true;
  };

  return tryScroll();
}
