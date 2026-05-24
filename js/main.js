const storageKey = 'theme-preference';
const root = document.documentElement;
const body = document.body;
let themeToggleBtn = null;

function themeToggle() {
  if (!themeToggleBtn) {
    themeToggleBtn = document.querySelector('.theme-toggle');
  }
  return themeToggleBtn;
}

function setTheme(theme) {
  root.dataset.theme = theme;
  body.dataset.theme = theme;
  localStorage.setItem(storageKey, theme);
  // Re-render Mermaid diagrams on theme change
  if (typeof mermaid !== 'undefined') {
    document.querySelectorAll('.mermaid').forEach(function(el) {
      el.removeAttribute('data-processed');
    });
    mermaid.initialize({startOnLoad: false, theme: theme === 'dark' ? 'dark' : 'default'});
    mermaid.run();
  }
  const button = themeToggle();
  if (button) {
    button.setAttribute('aria-pressed', theme === 'dark');
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

function getInitialTheme() {
  const saved = localStorage.getItem(storageKey);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

window.addEventListener('DOMContentLoaded', () => {
  const button = themeToggle();
  const initialTheme = getInitialTheme();
  setTheme(initialTheme);

  if (button) {
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  const hamburger = document.getElementById('hamburger');
  const header = document.querySelector('.site__header');
  const nav = document.getElementById('site-nav');
  if (hamburger && header) {
    hamburger.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    if (nav) {
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          header.classList.remove('nav-open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    document.addEventListener('click', (e) => {
      if (header.classList.contains('nav-open') &&
          !header.contains(e.target)) {
        header.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Code block processing
  document.querySelectorAll('.page__content pre, .post__content pre').forEach(pre => {
    // Read data-highlight marker before any DOM changes
    var highlightData = null;
    var marker = pre.previousElementSibling;
    if (marker && marker.hasAttribute('data-highlight')) {
      highlightData = marker.getAttribute('data-highlight');
      marker.remove();
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const code = pre.querySelector('code');
    const lang = code ? code.getAttribute('data-lang') : '';

    if (lang) {
      const label = document.createElement('span');
      label.className = 'code-lang';
      label.textContent = lang;
      wrapper.appendChild(label);
    }

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    wrapper.appendChild(copyBtn);

    copyBtn.addEventListener('click', () => {
      const text = code ? (code.getAttribute('data-original') || code.textContent) : (pre.textContent || '');
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(() => {});
    });

    if (code) {
      code.setAttribute('data-original', code.textContent);
      const lines = code.innerHTML.split('\n');
      while (lines.length > 0 && lines[0].trim() === '') lines.shift();
      while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();

      code.innerHTML = lines.map((line, i) =>
        '<span class="code-line" data-line="' + (i + 1) + '"><span class="line-num">' + (i + 1) + '</span><span class="line-text">' + line + '</span></span>'
      ).join('');

      if (highlightData) {
        var ranges = highlightData.split(',');
        ranges.forEach(function(r) {
          r = r.trim();
          if (r.indexOf('-') > -1) {
            var parts = r.split('-');
            var start = parseInt(parts[0], 10);
            var end = parseInt(parts[1], 10);
            for (var li = start; li <= end; li++) {
              var lineEl = pre.querySelector('.code-line[data-line="' + li + '"]');
              if (lineEl) lineEl.classList.add('code-line--highlighted');
            }
          } else {
            var ln = parseInt(r, 10);
            var lineEl = pre.querySelector('.code-line[data-line="' + ln + '"]');
            if (lineEl) lineEl.classList.add('code-line--highlighted');
          }
        });
      }

      pre.classList.add('has-line-numbers');
    }
  });

  // Nav active state detection
  (function(){
    const normalize = s => s.replace(/\/+$/, '/');
    const path = normalize(window.location.pathname || '/');
    document.querySelectorAll('.site__header-nav-list-item-link').forEach(link => {
      const href = link.getAttribute('href') || '/';
      try {
        const url = new URL(href, window.location.origin);
        const linkPath = normalize(url.pathname);
        if (linkPath === path || (linkPath !== '/' && path.startsWith(linkPath))) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        }
      } catch (e) {}
    });
  })();

  // Tag click handling (spans inside post list links)
  document.addEventListener('click', function(e) {
    var tag = e.target.closest('.post__list-item-tags .tag');
    if (tag && tag.hasAttribute('data-href')) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = tag.getAttribute('data-href');
    }
  });

  // Press / to jump to search from anywhere
  document.addEventListener('keydown', function(e) {
    if (e.key !== '/') return;
    var active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
    if (window.location.pathname.replace(/\/+$/, '') === '/search') return;
    e.preventDefault();
    window.location.href = '/search/';
  });

  // Email obfuscation decoding
  document.querySelectorAll('.email-obfuscated').forEach(el => {
    const user = el.getAttribute('data-user');
    const domain = el.getAttribute('data-domain');
    if (user && domain) {
      const email = user + '@' + domain;
      el.innerHTML = '<a href="mailto:' + email + '">' + email + '</a>';
      el.classList.add('email-obfuscated--decoded');
    }
  });

  // TOC active heading tracking
  (function() {
    var tocLinks = document.querySelectorAll('.page__toc a');
    if (!tocLinks.length) return;

    var headings = [];
    tocLinks.forEach(function(link) {
      var id = link.getAttribute('href');
      if (id && id.startsWith('#')) {
        var el = document.getElementById(id.substring(1));
        if (el) headings.push({id: id, el: el, link: link});
      }
    });
    if (!headings.length) return;

    var tocEl = document.querySelector('.page__toc');
    var topOffsetRaw = getComputedStyle(tocEl).getPropertyValue('--toc-top-offset').trim();
    var topOffsetPx = 80;
    if (topOffsetRaw) {
      if (topOffsetRaw.endsWith('rem')) {
        topOffsetPx = parseFloat(topOffsetRaw) * parseFloat(getComputedStyle(document.documentElement).fontSize);
      } else if (topOffsetRaw.endsWith('px')) {
        topOffsetPx = parseFloat(topOffsetRaw);
      } else {
        topOffsetPx = parseInt(topOffsetRaw, 10) || 80;
      }
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function(l) { l.classList.remove('toc-active'); });
          var match = headings.find(function(h) { return h.id === '#' + entry.target.id; });
          if (match) match.link.classList.add('toc-active');
        }
      });
    }, {rootMargin: '-' + topOffsetPx + 'px 0px -80% 0px'});

    headings.forEach(function(h) { observer.observe(h.el); });
  })();
});
