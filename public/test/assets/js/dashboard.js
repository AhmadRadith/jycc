const initShell = () => {
  const THEME_STORAGE_KEY = 'mbg-theme';
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  const userMenuButton = document.querySelector('[data-user-menu-button]');
  const userMenu = document.getElementById('user-menu');
  const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
  const mobileMenu = document.getElementById('mobile-menu');

  const setTheme = (value, persist = true) => {
    const next = value === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', next === 'dark');
    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
    }
  };

  const storedTheme = (() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return null;
    }
  })();

  if (storedTheme) {
    setTheme(storedTheme, false);
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
    });
  });

  const closeMenuOnOutsideClick = (event) => {
    if (!userMenu || !userMenuButton) return;
    if (userMenu.contains(event.target) || userMenuButton.contains(event.target)) {
      return;
    }
    userMenu.classList.add('hidden');
    document.removeEventListener('click', closeMenuOnOutsideClick);
  };

  if (userMenuButton && userMenu) {
    userMenuButton.addEventListener('click', () => {
      userMenu.classList.toggle('hidden');
      if (!userMenu.classList.contains('hidden')) {
        setTimeout(() => document.addEventListener('click', closeMenuOnOutsideClick), 0);
      } else {
        document.removeEventListener('click', closeMenuOnOutsideClick);
      }
    });
  }

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShell, { once: true });
} else {
  initShell();
}
