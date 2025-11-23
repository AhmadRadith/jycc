import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { sanitizeNextPath } from "@/shared/navigation";

const THEME_STORAGE_KEY = "mbg-theme";

type ThemeMode = "dark" | "light";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const root = document.documentElement;
    const getStoredTheme = (): ThemeMode | null => {
      try {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
        return stored === "dark" || stored === "light" ? stored : null;
      } catch {
        return null;
      }
    };

    const persistTheme = (theme: ThemeMode) => {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {}
    };

    const updateButtonLabels = (theme: ThemeMode) => {
      const nextLabel =
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
        btn.setAttribute("aria-label", nextLabel);
        btn.setAttribute("title", nextLabel);
      });
    };

    const applyTheme = (theme: ThemeMode, persist = true) => {
      const isDark = theme === "dark";
      root.classList.toggle("dark", isDark);
      if (persist) {
        persistTheme(theme);
      }
      updateButtonLabels(theme);
    };

    const prefersDark =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: ThemeMode =
      getStoredTheme() || (prefersDark ? "dark" : "light");
    applyTheme(initialTheme, false);

    const performLogout = async () => {
      const currentPath = sanitizeNextPath(
        `${window.location.pathname}${window.location.search}`,
        "/"
      );
      const nextParam = encodeURIComponent(currentPath ?? "/");

      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch {
      }

      window.location.href = `/login?next=${nextParam}`;
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (window.location.pathname === "/404") {
        return;
      }

      const logout = target?.closest('[data-action="logout"]');
      if (logout) {
        event.preventDefault();
        void performLogout();
        return;
      }

      const toggle = target?.closest("[data-theme-toggle]");
      if (toggle) {
        event.preventDefault();
        applyTheme(root.classList.contains("dark") ? "light" : "dark");
      }
    };

    document.addEventListener("click", handleClick);

    const mediaQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme()) return;
      applyTheme(event.matches ? "dark" : "light", false);
    };

    mediaQuery?.addEventListener("change", handleMediaChange);

    const mutationObserver = new MutationObserver(() => {
      updateButtonLabels(root.classList.contains("dark") ? "dark" : "light");
    });

    if (document.body) {
      mutationObserver.observe(document.body, {
        subtree: true,
        childList: true,
      });
    }

    return () => {
      document.removeEventListener("click", handleClick);
      mediaQuery?.removeEventListener("change", handleMediaChange);
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        {}
        <title>MBGsecure</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
