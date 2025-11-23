import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import translations from "@/locales/login.json";
import { getSessionUserFromCookies } from "@/lib/session";
import { sanitizeNextPath, DEFAULT_NEXT_PATH } from "@/shared/navigation";
import { getDashboardPathForRole } from "@/shared/roles";

type SupportedLocale = keyof typeof translations;
type LocaleCopy = (typeof translations)[SupportedLocale];
type StatusKey = keyof LocaleCopy["statusMessages"] | null;

const LOCALE_ENTRIES = Object.entries(translations) as Array<
  [SupportedLocale, LocaleCopy]
>;
const DEFAULT_LOCALE: SupportedLocale = "id";
const LOCALE_STORAGE_KEY = "mbg_login_locale";
const USERNAME_PATTERN = /^[a-zA-Z0-9._@-]+$/;

const isSupportedLocale = (value: string): value is SupportedLocale =>
  LOCALE_ENTRIES.some(([locale]) => locale === value);

type Props = { nextPath?: string; initialLocale?: SupportedLocale };

export default function MBGsecureLoginPage({
  nextPath = "/dashboard",
  initialLocale,
}: Props) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusKey, setStatusKey] = useState<StatusKey>(null);
  const [errors, setErrors] = useState({ username: false, password: false });
  const [locale, setLocale] = useState<SupportedLocale>(
    initialLocale ?? DEFAULT_LOCALE
  );

  const copy = translations[locale] ?? translations[DEFAULT_LOCALE];
  const statusMessage = statusKey ? copy.statusMessages[statusKey] : "";
  const localeOptions = LOCALE_ENTRIES;
  const safeNextPath = useMemo(
    () => sanitizeNextPath(nextPath, DEFAULT_NEXT_PATH),
    [nextPath]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRemember(true);
    }

    try {
      const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (
        savedLocale &&
        isSupportedLocale(savedLocale) &&
        savedLocale !== locale
      ) {
        setLocale(savedLocale);
      }
    } catch(e) {
      console.error("Failed to lod lang", e)
    }
  }, [locale]);

  const usernameHasError = errors.username;
  const passwordHasError = errors.password;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusKey(null);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const isUsernameValid =
      trimmedUsername !== "" && USERNAME_PATTERN.test(trimmedUsername);
    const nextErrors = {
      username: !isUsernameValid,
      password: trimmedPassword === "",
    };
    setErrors(nextErrors);
    if (nextErrors.username || nextErrors.password) {
      return;
    }

    setLoading(true);

    try {
      if (remember) {
        try {
          localStorage.setItem("rememberedUsername", trimmedUsername);
        } catch {}
      } else {
        try {
          localStorage.removeItem("rememberedUsername");
        } catch {}
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword,
          remember,
          next: safeNextPath,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setStatusKey(
          data?.error === "INVALID_CREDENTIALS"
            ? "invalidCredentials"
            : "genericError"
        );
        return;
      }

      const redirectTarget = sanitizeNextPath(data?.redirect, safeNextPath);
      router.push(redirectTarget);
    } catch (err) {
      setStatusKey("networkError");
    } finally {
      setLoading(false);
    }
  }

  function handleLocaleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    if (isSupportedLocale(nextLocale)) {
      setLocale(nextLocale);
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      } catch {
      }
    }
  }

  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { 
      width: 100%; 
      height: 100%; 
      overscroll-behavior: none; 
    }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background: linear-gradient(135deg, #002366 0%, #0F52BA 50%, #002366 100%); 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      padding: 20px; 
      position: relative; 
      overflow: hidden; 
    }
    #__next {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    body::before { 
      content: ''; 
      position: absolute; 
      top: 0; left: 0; width: 100%; height: 100%; 
      background-image: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="3" fill="%23C0B2A0" opacity="0.15"/><circle cx="25" cy="25" r="2" fill="%23C0B2A0" opacity="0.1"/><circle cx="75" cy="75" r="2" fill="%23C0B2A0" opacity="0.1"/><circle cx="25" cy="75" r="1.5" fill="%23C0B2A0" opacity="0.12"/><circle cx="75" cy="25" r="1.5" fill="%23C0B2A0" opacity="0.12"/><path d="M 30 50 Q 40 40, 50 50 T 70 50" stroke="%23C0B2A0" stroke-width="0.5" fill="none" opacity="0.08"/><path d="M 50 30 Q 40 40, 50 50 T 50 70" stroke="%23C0B2A0" stroke-width="0.5" fill="none" opacity="0.08"/></svg>'); 
      background-size: 100px 100px; 
      animation: batikScroll 60s linear infinite; 
      pointer-events: none; 
    }
    @keyframes batikScroll { 0% { background-position: 0 0; } 100% { background-position: 100px 100px; } }

    .container { 
      display: flex; 
      max-width: 950px; 
      width: 100%; 
      background: transparent; 
      backdrop-filter: blur(20px); 
      border-radius: 24px; 
      overflow: hidden; 
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4); 
      animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
    }
    @keyframes slideIn { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

    .left-panel { 
      flex: 1; 
      background: linear-gradient(135deg, #0F52BA 0%, #002366 100%); 
      padding: 70px 50px; 
      position: relative; 
      overflow: hidden; 
      display: flex; 
      flex-direction: column; 
      align-items: flex-start; 
      justify-content: center; 
    }
    .batik-kawung { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.08; background-image: radial-gradient(circle at 50% 50%, transparent 30%, #C0B2A0 30%, #C0B2A0 32%, transparent 32%), radial-gradient(circle at 0% 0%, transparent 30%, #C0B2A0 30%, #C0B2A0 32%, transparent 32%), radial-gradient(circle at 100% 0%, transparent 30%, #C0B2A0 30%, #C0B2A0 32%, transparent 32%), radial-gradient(circle at 0% 100%, transparent 30%, #C0B2A0 30%, #C0B2A0 32%, transparent 32%), radial-gradient(circle at 100% 100%, transparent 30%, #C0B2A0 30%, #C0B2A0 32%, transparent 32%); background-size: 80px 80px; animation: kawungMove 25s ease-in-out infinite; }
    .batik-parang { position: absolute; bottom: 0; right: 0; width: 100%; height: 100%; opacity: 0.06; background-image: repeating-linear-gradient(45deg, transparent, transparent 20px, #C0B2A0 20px, #C0B2A0 22px), repeating-linear-gradient(-45deg, transparent, transparent 20px, #C0B2A0 20px, #C0B2A0 22px); animation: parangMove 20s linear infinite; }
    .batik-dots { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.12; background-image: radial-gradient(circle, #C0B2A0 1px, transparent 1px), radial-gradient(circle, #F7F5F0 0.5px, transparent 0.5px); background-size: 50px 50px, 25px 25px; animation: dotsFloat 15s ease-in-out infinite; }
    
    @keyframes kawungMove { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, 20px); } }
    @keyframes parangMove { 0% { background-position: 0 0, 0 0; } 100% { background-position: 40px 40px, -40px -40px; } }
    @keyframes dotsFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

    .logo-container { display: flex; gap: 20px; align-items: center; margin-bottom: 50px; position: relative; z-index: 2; }
    .logo-box { width: 70px; height: 70px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15); font-weight: 700; color: #0F52BA; font-size: 20px; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); border: 2px solid rgba(255, 255, 255, 0.3); }
    .logo-box:hover { transform: translateY(-5px) rotate(5deg); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25); }
    .logo-box:nth-child(2):hover { transform: translateY(-5px) rotate(-5deg); }

    .welcome-text { position: relative; z-index: 2; }
    .welcome-text h1 { color: #fff; font-size: 42px; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.5px; line-height: 1.2; animation: fadeInLeft 1s ease-out; }
    @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
    .welcome-text p { color: rgba(247,245,240,0.9); font-size: 16px; line-height: 1.7; font-weight: 300; animation: fadeInLeft 1s ease-out 0.2s both; }

    .right-panel { 
      flex: 1; 
      padding: 70px 60px; 
      background: #fff;
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      position: relative; 
      color-scheme: light; 
    }
    
    .locale-switcher { display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-bottom: 24px; color: #64748b; font-size: 13px; }
    .locale-switcher select { 
      border: 1px solid #cbd5e1; 
      border-radius: 8px; 
      padding: 10px 14px; 
      background: #ffffff; 
      color: #1e293b; 
      font-size: 14px; 
      cursor: pointer; 
      transition: all 0.2s ease; 
      appearance: none; 
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 40px; 
    }
    .locale-switcher select:focus { outline: none; border-color: #0F52BA; box-shadow: 0 0 0 4px rgba(15, 82, 186, 0.1); }

    .login-header { margin-bottom: 24px; position: relative; z-index: 1; }
    .login-header h2 { color: #002366; font-size: 32px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
    .login-header p { color: #64748b; font-size: 15px; font-weight: 400; }

    .form-group { margin-bottom: 20px; position: relative; }
    .form-group label { display: block; color: #1e293b; margin-bottom: 8px; font-weight: 600; font-size: 14px; transition: color 0.3s ease; }
    .form-group:focus-within label { color: #0F52BA; }
    .form-group input { width: 100%; padding: 14px 16px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; transition: all 0.2s ease; background: #ffffff; color: #1e293b; }
    .form-group input::placeholder { color: #94a3b8; }
    .form-group input:focus { outline: none; border-color: #0F52BA; box-shadow: 0 0 0 4px rgba(15, 82, 186, 0.1); }
    .form-group input.error { border-color: #ef4444; }
    
    .error-message { color: #ef4444; font-size: 12px; margin-top: 6px; display: none; font-weight: 500; }
    .error-message.show { display: block; animation: fadeInUp 0.3s ease; }

    .password-toggle { position: absolute; right: 16px; top: 40px; cursor: pointer; font-size: 18px; color: #94a3b8; transition: color 0.2s ease; }
    .password-toggle:hover { color: #475569; }

    .form-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; margin-top: 8px; }
    .remember-me { display: flex; align-items: center; gap: 8px; }
    .remember-me input[type="checkbox"] { width: 16px; height: 16px; accent-color: #0F52BA; cursor: pointer; }
    .remember-me label { color: #475569; font-size: 14px; cursor: pointer; }
    .forgot-password { color: #0F52BA; text-decoration: none; font-size: 14px; font-weight: 600; transition: opacity 0.2s ease; }
    .forgot-password:hover { opacity: 0.8; }

    .login-button { width: 100%; padding: 14px; background: #0F52BA; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(15, 82, 186, 0.2); }
    .login-button:hover { background: #0a3c8c; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15, 82, 186, 0.3); }
    .login-button:active { transform: translateY(0); }
    .login-button:disabled { opacity: 0.7; cursor: not-allowed; }
    .login-button.loading { position: relative; color: transparent; }
    .login-button.loading::after { content: ''; position: absolute; width: 20px; height: 20px; top: 50%; left: 50%; margin-left: -10px; margin-top: -10px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .signup-link { 
      text-align: center; 
      margin-top: 32px; 
      color: #64748b; 
      font-size: 15px; 
    }
    .signup-link a { 
      color: #0F52BA; 
      text-decoration: none; 
      font-weight: 600; 
      margin-left: 4px;
      transition: all 0.2s ease; 
    }
    .signup-link a:hover { 
      text-decoration: underline; 
    }

    .status-message { background: #fee2e2; color: #b91c1c; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; display: none; border: 1px solid #fecaca; }
    .status-message.show { display: block; }

    @media (max-width: 768px) { 
      html, body {
        overflow-y: auto; 
      }
      body {
        padding: 0;
        align-items: flex-start; 
      }
      .container { 
        flex-direction: column; 
        border-radius: 0; 
        height: auto; 
        min-height: 100vh; 
        overflow-y: visible; 
        box-shadow: none;
      } 
      .left-panel { 
        padding: 40px 30px; 
        min-height: 220px; 
        flex: 0 0 auto; 
      } 
      .right-panel { 
        padding: 40px 30px 80px 30px;
        flex: 1 0 auto; 
        border-radius: 24px 24px 0 0; 
        margin-top: -24px; 
      } 
    }
  `;

  return (
    <>
      <Head>
        <title>{copy.pageTitle}</title>
        <meta name="description" content={copy.metaDescription} />
      </Head>

      <style suppressHydrationWarning>{css}</style>

      <div className="container">
        <div className="left-panel">
          <div className="batik-kawung" />
          <div className="batik-parang" />
          <div className="batik-dots" />

          <div className="logo-container">
            <div className="logo-box">
              <img
                src="/assets/images/logo/BGN.jpeg"
                alt="Badan Gizi Nasional"
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: 12 }}
              />
            </div>
            <div className="logo-box">
              <img
                src="/assets/images/logo/Kemendiknas.jpeg"
                alt="Kemendiknas"
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: 12 }}
              />
            </div>
          </div>

          <div className="welcome-text">
            <h1>
              {copy.welcomeLine1}
              <br />
              {copy.welcomeLine2}
            </h1>
            <p>{copy.welcomeDescription}</p>
          </div>
        </div>

        <div className="right-panel">
          <div className="locale-switcher">
            <label htmlFor="localeSelect">{copy.languageLabel}</label>
            <select
              id="localeSelect"
              value={locale}
              onChange={handleLocaleChange}
            >
              {localeOptions.map(([value, data]) => (
                <option key={value} value={value}>
                  {data.languageName}
                </option>
              ))}
            </select>
          </div>
          <div className="login-header">
            <h2>{copy.loginTitle}</h2>
            <p>{copy.loginSubtitle}</p>
          </div>

          <div
            className={`status-message ${statusMessage ? "show" : ""}`}
            role="status"
            aria-live="polite"
          >
            {statusMessage}
          </div>

          <form id="loginForm" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">{copy.usernameLabel}</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder={copy.usernamePlaceholder}
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  const value = e.target.value;
                  setUsername(value);
                  if (errors.username) {
                    const trimmed = value.trim();
                    if (trimmed !== "" && USERNAME_PATTERN.test(trimmed)) {
                      setErrors((prev) => ({ ...prev, username: false }));
                    }
                  }
                }}
                className={usernameHasError ? "error" : undefined}
              />
              <div
                id="usernameError"
                className={`error-message ${usernameHasError ? "show" : ""}`}
              >
                {copy.usernameError}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">{copy.passwordLabel}</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={copy.passwordPlaceholder}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password && e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, password: false }));
                  }
                }}
                className={passwordHasError ? "error" : undefined}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                role="button"
                aria-label={
                  showPassword
                    ? copy.passwordToggleHide
                    : copy.passwordToggleShow
                }
                title={
                  showPassword
                    ? copy.passwordToggleHide
                    : copy.passwordToggleShow
                }
              >
                {showPassword ? "🔒" : "👁️"}
              </span>
              <div
                id="passwordError"
                className={`error-message ${passwordHasError ? "show" : ""}`}
              >
                {copy.passwordError}
              </div>
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember">{copy.rememberMe}</label>
              </div>
              <a
                href="#"
                className="forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  setStatusKey("forgotPassword");
                }}
              >
                {copy.forgotPassword}
              </a>
            </div>

            <button
              type="submit"
              id="loginButton"
              className={`login-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              <span id="buttonText">{loading ? "" : copy.loginButton}</span>
            </button>

            <div className="signup-link">
              {copy.signupPrompt}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setStatusKey("signup");
                }}
              >
                {copy.signupAction}
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> {
  const user = getSessionUserFromCookies(context.req?.headers?.cookie);
  if (user) {
    return {
      redirect: {
        destination: getDashboardPathForRole(user.role),
        permanent: false,
      },
    };
  }
  const { next } = context.query || {};
  const nextPath = sanitizeNextPath(
    typeof next === "string" ? next : undefined,
    DEFAULT_NEXT_PATH
  );

  const acceptLanguage = context.req?.headers?.["accept-language"];
  const rawHeader = Array.isArray(acceptLanguage)
    ? acceptLanguage[0]
    : acceptLanguage;
  let initialLocale: SupportedLocale = DEFAULT_LOCALE;

  if (rawHeader) {
    const candidates = rawHeader.split(",");
    for (const part of candidates) {
      const [langTag] = part.split(";");
      const base = langTag.trim().split("-")[0]?.toLowerCase();
      if (base && isSupportedLocale(base)) {
        initialLocale = base;
        break;
      }
    }
  }

  return { props: { nextPath, initialLocale } };
}
