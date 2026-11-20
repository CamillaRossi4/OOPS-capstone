import pinkFur from "./assets/pink-fur.jpg";
import pistachioFur from "./assets/pistachio-fur.jpg";
import blueFur from "./assets/blue-fur.jpg";
import lavenderFur from "./assets/lavender-fur.jpg";
import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { API_URL, api } from "./api";
import { themes } from "./utils/themes";
import { LanguageContext } from "./context/LanguageProviderContext";
import { Translate } from "./context/LanguageContext";
import { useLanguage } from "./context/useLanguage";
import Overview from "./pages/Overview";
import Projects from "./pages/Projects";
import ProjectDossier from "./pages/ProjectDossier";
import Ideas from "./pages/Ideas";
import Breakpoint from "./pages/Breakpoint";
import Rediscover from "./pages/Rediscover";
import Archive from "./pages/Archive";
import Appearance from "./pages/Appearance";
import Settings from "./pages/Settings";
const navigation = [
  { label: "Overview", path: "/app", number: "01" },
  { label: "Projects", path: "/app/projects", number: "02" },
  { label: "Idea Library", path: "/app/ideas", number: "03" },
  { label: "Rediscover", path: "/app/rediscover", number: "04" },
  { label: "The Archive", path: "/app/archive", number: "05" }
];
function getSession() {
  try {
    return JSON.parse(localStorage.getItem("oops-session"));
  } catch {
    return null;
  }
}
function App() {
  const [session, setSession] = useState(getSession);
  const [language, setLanguage] = useState(() => localStorage.getItem("oops-language") === "it" ? "it" : "en");
  useEffect(() => { localStorage.setItem("oops-language", language); document.documentElement.lang = language; }, [language]);
  function login(data) {
    localStorage.setItem("oops-session", JSON.stringify(data));
    setSession(data);
  }
  function logout() {
    localStorage.removeItem("oops-session");
    setSession(null);
  }
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome session={session} />} />
        <Route path="/login" element={session ? <Navigate to="/app" replace /> : <Auth type="login" onLogin={login} />} />
        <Route path="/register" element={session ? <Navigate to="/app" replace /> : <Auth type="register" onLogin={login} />} />
        <Route path="/forgot-password" element={<PasswordRecovery />} />
        <Route path="/reset-password" element={<PasswordRecovery reset />} />
        <Route path="/app/*" element={session ? <Workspace session={session} logout={logout} /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </LanguageContext.Provider>
  );
}
function Welcome({ session }) {
  return (
    <div className="welcome-page">
      <header className="welcome-header">
        <Link to="/" className="brand">oops!</Link>
        <span className="welcome-top-label"><Translate>A CREATIVE WORKSPACE / 2026</Translate></span>
      </header>
      <main className="welcome-main">
        <section className="welcome-content">
          <span className="welcome-eyebrow"><Translate>A HOME FOR UNFINISHED IDEAS</Translate></span>
          <div className="welcome-title">
            <h1><Translate>GOOD IDEAS.</Translate></h1>
            <h1 className="welcome-title-accent"><span><Translate>BAD TIMING.</Translate></span></h1>
          </div>
          <p><Translate>A little chaos never hurt anyone.</Translate></p>
          <div className="welcome-actions">
            <Link to={session ? "/app" : "/register"} className="welcome-button"><Translate>GET STARTED</Translate></Link>
            <Link to={session ? "/app" : "/login"} className="welcome-login"><Translate>LOG IN</Translate></Link>
          </div>
        </section>
      </main>
      <footer className="welcome-footer">
        <span>OOPS! © 2026</span>
        <span><Translate>WORK IN PROGRESS. ALWAYS.</Translate></span>
      </footer>
    </div>
  );
}
function Auth({ type, onLogin }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isRegister = type === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(() => new URLSearchParams(window.location.search).has("google") ? "Google sign-in was not completed. If you already registered with this email, use your password." : "");
  const [loading, setLoading] = useState(() => new URLSearchParams(window.location.search).has("google_code"));
  const googleExchangeStarted = useRef(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("google_code");
    const googleError = params.get("google");
    if (googleError) {
      window.history.replaceState({}, "", "/login");
      return;
    }
    if (!code || googleExchangeStarted.current) return;
    googleExchangeStarted.current = true;
    window.history.replaceState({}, "", "/login");
    api("/auth/google/exchange", null, {
      method: "POST",
      body: JSON.stringify({ code })
    }).then(data => {
      if (!data.token) throw new Error("The server did not return an access token.");
      onLogin(data);
      navigate("/app", { replace: true });
    }).catch(error => setError(error.message)).finally(() => setLoading(false));
  }, [navigate, onLogin]);
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api(`/auth/${isRegister ? "register" : "login"}`, null, {
        method: "POST",
        body: JSON.stringify(isRegister ? { name, email, password } : { email, password })
      });
      if (!data.token) throw new Error(t("The server did not return an access token."));
      onLogin(data);
      navigate("/app");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={`auth-page ${isRegister ? "register-page" : "login-page"}`}>
      <header className="auth-header">
        <Link to="/" className="brand">oops!</Link>
        <span><Translate>THE CREATIVE WORKSPACE / 2026</Translate></span>
      </header>
      <main className="auth-main">
        <section className="auth-card">
          <div className="auth-card-top">
            <span>{t(isRegister ? "NEW HERE? / 002" : "WELCOME BACK / 001")}</span>
            <span>✳</span>
          </div>
          <div className="auth-heading">
            <span className="auth-eyebrow">{t(isRegister ? "GOOD THINGS START HERE." : "A LITTLE DRAMA NEVER HURT.")}</span>
            <h1>{t(isRegister ? "Let's make it official." : "Oh, it's you.")}</h1>
            {!isRegister && <p><Translate>We've been expecting your next big idea.</Translate></p>}
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-field">
                <label htmlFor="name"><Translate>YOUR NAME</Translate></label>
                <input id="name" type="text" placeholder={t("Your name")} value={name} onChange={event => setName(event.target.value)} required />
              </div>
            )}
            <div className="form-field">
              <label htmlFor="email"><Translate>EMAIL ADDRESS</Translate></label>
              <input id="email" type="email" placeholder={t("you@example.com")} value={email} onChange={event => setEmail(event.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="password"><Translate>PASSWORD</Translate></label>
              <div className="password-field">
                <input id="password" type={showPassword ? "text" : "password"} placeholder={t("At least 8 characters")} value={password} onChange={event => setPassword(event.target.value)} minLength={8} required />
                <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={t(showPassword ? "Hide password" : "Show password")} aria-pressed={showPassword}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {!showPassword && <path d="M3 3 21 21" />}
                  </svg>
                </button>
              </div>
            </div>
            {!isRegister && <div className="auth-forgot"><Link to="/forgot-password">{t("FORGOT PASSWORD?")}</Link></div>}
            {error && <p className="form-error">{error}</p>}
            <button className="auth-submit" type="submit" disabled={loading}>
              {t(loading ? "PLEASE WAIT..." : isRegister ? "CREATE ACCOUNT" : "LOG IN")}
            </button>
          </form>
          <div className="auth-divider"><span />{t("OR")}<span /></div>
          <a className="auth-google" href={`${API_URL}/auth/google`}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.88 46.98 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.51 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>
            {t("CONTINUE WITH GOOGLE")} <span aria-hidden="true">↗</span>
          </a>
          <div className="auth-switch">
            <span>{t(isRegister ? "ALREADY ONE OF US?" : "NEW HERE?")}</span>
            <Link to={isRegister ? "/login" : "/register"}>{t(isRegister ? "LOG IN" : "CREATE AN ACCOUNT")}</Link>
          </div>
        </section>
      </main>
      <footer className="auth-footer">
        <span><Translate>GOOD IDEAS. BAD TIMING.</Translate></span>
        <span>OOPS! © 2026</span>
      </footer>
    </div>
  );
}
function PasswordRecovery({ reset = false }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const token = new URLSearchParams(window.location.search).get("token");
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (reset && password !== confirmPassword) {
      setError(t("Passwords do not match."));
      return;
    }
    setLoading(true);
    try {
      await api(reset ? "/auth/reset-password" : "/auth/forgot-password", null, {
        method: "POST",
        body: JSON.stringify(reset ? { token, password } : { email })
      });
      setSent(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="auth-page login-page auth-recovery-page">
      <header className="auth-header">
        <Link to="/" className="brand">oops!</Link>
        <span><Translate>THE CREATIVE WORKSPACE / 2026</Translate></span>
      </header>
      <main className="auth-main">
        <section className="auth-card">
          <div className="auth-card-top"><span>OOPS! / {reset ? "004" : "003"}</span><span>✳</span></div>
          <div className="auth-heading">
            <span className="auth-eyebrow">{t("A FRESH START")}</span>
            <h1>{t(sent ? reset ? "A fresh start." : "Check your inbox, darling." : reset ? "A fresh start." : "Oops! Forgot something?")}</h1>
            <p>{t(sent ? reset ? "Password reset. You can log in now." : "If the address is registered, a reset link will arrive shortly." : reset ? "A new password. Same brilliant ideas." : "Even the best minds forget a password.")}</p>
          </div>
          {!sent && (!reset || token) && <form className="auth-form" onSubmit={handleSubmit}>
            {!reset ? <div className="form-field"><label htmlFor="recovery-email">{t("EMAIL ADDRESS")}</label><input id="recovery-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></div> : <>
              <div className="form-field"><label htmlFor="new-password">{t("NEW PASSWORD")}</label><div className="password-field"><input id="new-password" type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} minLength={8} autoComplete="new-password" required /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={t(showPassword ? "Hide password" : "Show password")}>{showPassword ? "◉" : "◎"}</button></div></div>
              <div className="form-field"><label htmlFor="confirm-password">{t("CONFIRM PASSWORD")}</label><input id="confirm-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} minLength={8} autoComplete="new-password" required /></div>
            </>}
            {error && <p className="form-error">{error}</p>}
            <button className="auth-submit" type="submit" disabled={loading}>{t(loading ? "PLEASE WAIT..." : reset ? "RESET PASSWORD ↗" : "SEND THE LINK ↗")}</button>
          </form>}
          {reset && !token && <p className="form-error">{t("This reset link is missing or invalid.")}</p>}
          <div className="auth-switch"><Link to="/login">← {t("BACK TO LOG IN ↗").replace(" ↗", "")}</Link></div>
        </section>
      </main>
      <footer className="auth-footer"><span><Translate>GOOD IDEAS. BAD TIMING.</Translate></span><span>OOPS! © 2026</span></footer>
    </div>
  );
}
function Workspace({ session, logout }) {
  const { t } = useLanguage();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("oops-theme");
    return themes[saved] ? saved : "original";
  });
  const [sidebarTexture, setSidebarTexture] = useState(() => localStorage.getItem("oops-sidebar-texture") !== "false");
  function updateSessionUser(updatedUser) {
    const nextSession = { ...session, user: { ...session.user, ...updatedUser } };
    localStorage.setItem("oops-session", JSON.stringify(nextSession));
    window.location.reload();
  }
  const selected = themes[theme];
  useEffect(() => {
    localStorage.setItem("oops-theme", theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("oops-sidebar-texture", String(sidebarTexture));
  }, [sidebarTexture]);
  return (
    <div className="app-layout" style={{ "--accent": selected.accent, "--strong": selected.strong, "--soft": selected.soft, "--workspace-bg": selected.background, "--workspace-ink": selected.ink, "--sidebar-fur": sidebarTexture ? `url(${ { pink: pinkFur, pistachio: pistachioFur, blue: blueFur, lavender: lavenderFur }[selected.fur] })` : "none" }}>
      <aside className="sidebar">
        <Link to="/app" className="brand">oops!</Link>
        <div className="sidebar-content">
          <span className="sidebar-label"><Translate>YOUR WORKSPACE</Translate></span>
          <nav className="sidebar-nav">
            {navigation.map(item => (
              <NavLink key={item.path} to={item.path} end={item.path === "/app"}>
                <span>{item.number}</span>{t(item.label)}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <NavLink to="/app/appearance"><Translate>Appearance</Translate></NavLink>
          <NavLink to="/app/settings"><Translate>Settings</Translate></NavLink>
          <button onClick={logout}><Translate>LOG OUT</Translate> </button>
          <span><Translate>THE CREATIVE STUDIO / 2026</Translate></span>
        </div>
      </aside>
      <div className="workspace">
        <header className="workspace-topbar">
          <span><Translate>OOPS!</Translate> <i>/</i> <Translate>YOUR CREATIVE SPACE</Translate></span>
          <span>{session.user?.name || session.user?.email}</span>
        </header>
        <Routes>
          <Route index element={<Overview token={session.token} />} />
          <Route path="projects" element={<Projects token={session.token} />} />
          <Route path="projects/:projectId" element={<ProjectDossier token={session.token} />} />
          <Route path="ideas" element={<Ideas token={session.token} />} />
          <Route path="breakpoint" element={<Breakpoint token={session.token} />} />
          <Route path="rediscover" element={<Rediscover token={session.token} />} />
          <Route path="archive" element={<Archive token={session.token} />} />
          <Route path="appearance" element={<Appearance theme={theme} setTheme={setTheme} sidebarTexture={sidebarTexture} setSidebarTexture={setSidebarTexture} />} />
          <Route path="settings" element={<Settings user={session.user} token={session.token} logout={logout} onProfileSaved={updatedUser => updateSessionUser(updatedUser)} />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
