(function () {
  var idx = null;
  var docs = {};
  var meta = {};
  var currentTerm = '';
  var currentResults = [];
  var activeTag = null;

  var sectionLabels = {
    posts: 'post',
    projects: 'project',
    bookshelf: 'book'
  };

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function highlight(text, term) {
    if (!term) return text;
    var escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('(' + escaped + ')', 'gi');
    return text.replace(re, '<mark class="search-highlight">$1</mark>');
  }

  function snippet(content, term) {
    if (!content) return '';
    var lower = content.toLowerCase();
    var pos = term ? lower.indexOf(term.toLowerCase()) : -1;
    if (pos === -1) return content.substring(0, 200) + (content.length > 200 ? '...' : '');
    var start = Math.max(0, pos - 80);
    var end = Math.min(content.length, pos + term.length + 80);
    return (start > 0 ? '...' : '') + content.substring(start, end) + (end < content.length ? '...' : '');
  }

  function getMeta(ref) {
    return meta[ref] || null;
  }

  function sectionLabel(section) {
    return sectionLabels[section] || '';
  }

  function collectTags(results) {
    var tags = [];
    var seen = {};
    results.forEach(function (r) {
      var m = getMeta(r.ref);
      if (m && m.tags) {
        m.tags.forEach(function (t) {
          if (!seen[t]) {
            seen[t] = true;
            tags.push(t);
          }
        });
      }
    });
    tags.sort();
    return tags;
  }

  function renderTagFilter(tags) {
    var filterEl = document.getElementById('search-tag-filter');
    if (!filterEl) return;
    if (!tags.length) {
      filterEl.innerHTML = '';
      return;
    }
    var html = '';
    tags.forEach(function (t) {
      var cls = 'search-tag-filter-btn' + (t === activeTag ? ' search-tag-filter-btn--active' : '');
      html += '<button class="' + cls + '" data-tag="' + t + '">#' + t + '</button>';
    });
    if (activeTag) {
      html += '<button class="search-tag-filter-clear" data-tag="">Clear filter</button>';
    }
    filterEl.innerHTML = html;
  }

  function filterResults(results) {
    if (!activeTag) return results;
    return results.filter(function (r) {
      var m = getMeta(r.ref);
      return m && m.tags && m.tags.indexOf(activeTag) !== -1;
    });
  }

  function renderResults(results, term) {
    var container = document.getElementById('search-results');
    if (!container) return;

    var filtered = filterResults(results);

    var tags = collectTags(results);
    renderTagFilter(tags);

    if (!filtered || filtered.length === 0) {
      var msg;
      if (!results || results.length === 0) {
        msg = '<p class="search-results-empty">No results found for <strong>' + term + '</strong>.</p>';
      } else if (activeTag) {
        msg = '<p class="search-results-empty">No results for <strong>' + term + '</strong> in <strong>#' + activeTag + '</strong>.</p>';
      } else {
        msg = '<p class="search-results-empty">No results found.</p>';
      }
      container.innerHTML = msg;
      return;
    }

    var html = '';
    html += '<p class="search-result-count">' + filtered.length + ' result' + (filtered.length !== 1 ? 's' : '') + ' for <strong>' + term + '</strong>' + (activeTag ? ' in <strong>#' + activeTag + '</strong>' : '') + '</p>';
    html += '<ul class="search-results-list">';
    filtered.forEach(function (r) {
      var doc = docs[r.ref];
      if (!doc) return;
      var m = getMeta(r.ref);
      var title = doc.title || 'Untitled';
      var date = (m && m.date) ? formatDate(m.date) : '';
      var body = doc.body || '';
      var snip = highlight(snippet(body, term), term);
      var link = r.ref;

      html += '<li class="search-result-item">';
      html += '<a class="search-result-title" href="' + link + '">' + highlight(title, term) + '</a>';
      html += '<div class="search-result-meta">';
      if (date) html += '<span class="search-result-date">' + date + '</span>';
      if (m && m.section) html += '<span class="search-result-section" data-section="' + m.section + '">' + sectionLabel(m.section) + '</span>';
      if (m && m.tags && m.tags.length) {
        html += '<span class="search-result-tags">';
        m.tags.forEach(function (t) {
          html += '<span class="search-result-tag">#' + t + '</span>';
        });
        html += '</span>';
      }
      html += '</div>';
      html += '<p class="search-result-snippet">' + snip + '</p>';
      html += '</li>';
    });
    html += '</ul>';
    container.innerHTML = html;
  }

  function search(term) {
    if (!idx) return;
    if (!term || term.trim().length === 0) {
      document.getElementById('search-results').innerHTML = '';
      document.getElementById('search-tag-filter').innerHTML = '';
      currentTerm = '';
      currentResults = [];
      activeTag = null;
      return;
    }
    currentTerm = term;
    currentResults = idx.search(term, { expand: true });
    activeTag = null;
    renderResults(currentResults, term);
  }

  function init() {
    var input = document.getElementById('search-input');
    if (!input) return;

    meta = window.searchMeta || {};

    var script = document.createElement('script');
    script.src = window.searchIndexUrl || '/search_index.en.js';
    script.onload = function () {
      if (!window.searchIndex) {
        document.getElementById('search-results').innerHTML =
          '<p class="search-results-empty">Search index not found. Run <code>zola build</code>.</p>';
        return;
      }
      idx = elasticlunr.Index.load(window.searchIndex);

      docs = {};
      var store = (window.searchIndex.documentStore && window.searchIndex.documentStore.docs) || {};
      Object.keys(store).forEach(function (key) {
        docs[key] = store[key];
      });

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        input.value = q;
        search(q);
      }
    };
    script.onerror = function () {
      document.getElementById('search-results').innerHTML =
        '<p class="search-results-empty">Search index not found. Run <code>zola build</code>.</p>';
    };
    document.head.appendChild(script);

    var timer = null;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var term = this.value;
      timer = setTimeout(function () {
        var url = new URL(window.location);
        if (term) {
          url.searchParams.set('q', term);
        } else {
          url.searchParams.delete('q');
        }
        window.history.replaceState({}, '', url);
        search(term);
      }, 200);
    });

    var filterEl = document.getElementById('search-tag-filter');
    filterEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var tag = btn.getAttribute('data-tag');
      activeTag = (tag === activeTag) ? null : tag;
      if (!activeTag) activeTag = null;
      renderResults(currentResults, currentTerm);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== '/') return;
      if (document.activeElement === input || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      e.preventDefault();
      input.focus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
