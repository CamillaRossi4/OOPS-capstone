
import { useEffect, useState } from "react";
import { api } from "../api";
import { Translate } from "../context/LanguageContext";
import { useLanguage } from "../context/useLanguage";

export default function DossierIdea({ idea, token, readOnly, onRevisionSaved }) {
  const { t, language } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ title: idea.title, description: idea.description });
  useEffect(() => {
    setDraft({ title: idea.title, description: idea.description });
    setShowForm(false);
    setShowHistory(false);
    setHistory([]);
    setError("");
  }, [idea._id]);
  async function loadHistory() {
    setLoadingHistory(true);
    setError("");
    try {
      const versions = await api(`/ideas/${idea._id}/revisions`, token);
      setHistory(versions);
      setShowHistory(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingHistory(false);
    }
  }
  async function saveRevision(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const revision = await api(`/ideas/${idea._id}/revisions`, token, {
        method: "POST",
        body: JSON.stringify({ title: draft.title, description: draft.description })
      });
      setShowForm(false);
      await onRevisionSaved();
      const versions = await api(`/ideas/${revision._id}/revisions`, token);
      setHistory(versions);
      setShowHistory(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <article className="dossier-idea">
      <span className="small-label">{t(idea.status || "Proposed")}{idea.originalIdea ? ` / ${t("SECOND LIFE")}` : ""} / {t("VERSION")} {String(idea.revisionNumber || 1).padStart(2, "0")}</span>
      <h3>{idea.title}</h3>
      <p>{idea.description}</p>
      <div className="idea-form-actions" style={{ marginTop: 18, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <button type="button" className="idea-text-button" onClick={() => showHistory ? setShowHistory(false) : loadHistory()} disabled={loadingHistory}>{t(loadingHistory ? "LOADING..." : showHistory ? "CLOSE HISTORY ↑" : "VERSION HISTORY ↗")}</button>
        {!readOnly && <button type="button" className="idea-text-button" onClick={() => { setShowForm(!showForm); setError(""); }}>{t(showForm ? "CANCEL" : "+ CREATE REVISION")}</button>}
      </div>
      {error && <p className="state-message" role="alert">{error}</p>}
      {showForm && <form className="create-form" onSubmit={saveRevision} style={{ marginTop: 18 }}>
        <span className="small-label">{t("THE NEXT CHAPTER")} / {t("VERSION")} {String((idea.revisionNumber || 1) + 1).padStart(2, "0")}</span>
        <h3><Translate>Give it another look.</Translate></h3>
        <input aria-label={t("Revision title")} placeholder={t("Revision title")} value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} required />
        <textarea aria-label={t("Revision description")} placeholder={t("What changes in this version?")} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} required />
        <button type="submit" className="solid-button" disabled={saving}>{t(saving ? "SAVING..." : "SAVE REVISION ↗")}</button>
      </form>}
      {showHistory && <section style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid currentColor" }} aria-label={t("Version history")}>
        <span className="small-label">{t("THE STORY SO FAR")} / {history.length} {t("VERSIONS")}</span>
        {history.map((version, index) => <div key={version._id} style={{ paddingTop: 18 }}>
          <span className="small-label">{t("VERSION")} {String(version.revisionNumber || 1).padStart(2, "0")}{index === history.length - 1 ? ` / ${t("LATEST")}` : ""} · {new Date(version.createdAt).toLocaleDateString(language === "it" ? "it-IT" : "en-GB")}</span>
          <h3>{version.title}</h3>
          <p>{version.description}</p>
        </div>)}
      </section>}
    </article>
  );
}
