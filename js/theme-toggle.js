(function () {
  var THEME_KEY = 'portfolio-theme';

  function setStoredTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (e) {}
  }

  function applyTheme(isDark) {
    var html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  function toggleTheme() {
    var html = document.documentElement;
    var isDark = html.classList.contains('dark');
    isDark = !isDark;
    applyTheme(isDark);
    setStoredTheme(isDark ? 'dark' : 'light');
  }

  // Initial theme is applied by the inline script in the document head (same key and logic).
  // This script only attaches the toggle button once the DOM is ready.
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggleTheme);
  });
})();
