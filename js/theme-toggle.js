(function () {
  var THEME_KEY = 'portfolio-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (e) {}
  }

  function prefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(isDark) {
    var html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    var isDark;
    if (stored === 'dark' || stored === 'light') {
      isDark = stored === 'dark';
    } else {
      isDark = prefersDark();
      setStoredTheme(isDark ? 'dark' : 'light');
    }
    applyTheme(isDark);
  }

  function toggleTheme() {
    var html = document.documentElement;
    var isDark = html.classList.contains('dark');
    isDark = !isDark;
    applyTheme(isDark);
    setStoredTheme(isDark ? 'dark' : 'light');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggleTheme);
  });

  initTheme();
})();
