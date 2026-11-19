
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { Translate } from "../context/LanguageContext";
import { useLanguage } from "../context/useLanguage";
import PageHeading from "../components/PageHeading";
export default function Settings({ user, token, logout, onProfileSaved }) {
  const { t, language, setLanguage } = useLanguage();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user?.name, user?.email]);
  async function saveProfile(event) {
    event.preventDefault();
    if (savingProfile) return;
    setSavingProfile(true);
    setProfileMessage("");
    try {
      const result = await api("/auth/profile", token, { method: "PUT", body: JSON.stringify({ name: name.trim(), email: email.trim() }) });
      const updatedUser = result.user || result;
      onProfileSaved(updatedUser);
      setProfileMessage(t("Profile updated."));
    } catch (error) {
      setProfileMessage(error.message);
    } finally {
      setSavingProfile(false);
    }
  }
  async function savePassword(event) {
    event.preventDefault();
    if (savingPassword) return;
    if (newPassword !== confirmPassword) {
      setPasswordMessage(t("The new passwords do not match."));
      return;
    }
    setSavingPassword(true);
    setPasswordMessage("");
    try {
      await api("/auth/password", token, { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage(t("Password updated."));
    } catch (error) {
      setPasswordMessage(error.message);
    } finally {
      setSavingPassword(false);
    }
  }
  return (
    <main className="workspace-page settings-page">
      <PageHeading eyebrow={t("YOUR ACCOUNT / SETTINGS")} title={t("Settings")} description={t("The details behind your creative universe.")} />
      <div className="settings-layout">
        <section className="settings-section">
          <span className="small-label"><Translate>01 / PERSONAL INFORMATION</Translate></span>
          <h2><Translate>Make it yours.</Translate></h2>
          <p><Translate>Keep your account details up to date.</Translate></p>
          <form className="settings-form" onSubmit={saveProfile}>
            <label htmlFor="profile-name"><Translate>YOUR NAME</Translate></label>
            <input id="profile-name" autoComplete="name" value={name} onChange={event => setName(event.target.value)} required />
            <label htmlFor="profile-email"><Translate>EMAIL ADDRESS</Translate></label>
            <input id="profile-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required />
            <button className="solid-button" type="submit" disabled={savingProfile}>{t(savingProfile ? "SAVING..." : "SAVE CHANGES ↗")}</button>
            {profileMessage && <p className="settings-message" role="status">{profileMessage}</p>}
          </form>
        </section>
        <section className="settings-section">
          <span className="small-label"><Translate>02 / PASSWORD & SECURITY</Translate></span>
          <h2><Translate>For your eyes only.</Translate></h2>
          <p><Translate>Choose a new password to protect your ideas.</Translate></p>
          <form className="settings-form" onSubmit={savePassword}>
            <label htmlFor="current-password"><Translate>CURRENT PASSWORD</Translate></label>
            <input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required />
            <label htmlFor="new-password"><Translate>NEW PASSWORD</Translate></label>
            <input id="new-password" type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={event => setNewPassword(event.target.value)} required />
            <label htmlFor="confirm-password"><Translate>CONFIRM NEW PASSWORD</Translate></label>
            <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required />
            <button className="solid-button" type="submit" disabled={savingPassword}>{t(savingPassword ? "SAVING..." : "UPDATE PASSWORD ↗")}</button>
            {passwordMessage && <p className="settings-message" role="status">{passwordMessage}</p>}
          </form>
        </section>
      </div>
      <section className="settings-section language-settings">
        <span className="small-label">03 / {t("LANGUAGE & REGION")}</span>
        <h2>{t("App language")}</h2>
        <p>{t("Choose the language of your workspace. Your ideas and projects stay in their original language.")}</p>
        <div className="language-options" role="group" aria-label={t("App language")}>
          <button type="button" className={language === "en" ? "language-option selected" : "language-option"} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>English <span>EN</span></button>
          <button type="button" className={language === "it" ? "language-option selected" : "language-option"} onClick={() => setLanguage("it")} aria-pressed={language === "it"}>Italiano <span>IT</span></button>
        </div>
      </section>
      <div className="settings-footer-actions"><Link to="/app/appearance"><Translate>EXPLORE APPEARANCE ↗</Translate></Link><button type="button" onClick={logout}><Translate>LOG OUT ↗</Translate></button></div>
    </main>
  );
}
