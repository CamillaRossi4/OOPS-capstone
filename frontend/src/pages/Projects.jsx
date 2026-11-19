
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useData } from "../hooks/useData";
import { Translate } from "../context/LanguageContext";
import { useLanguage } from "../context/useLanguage";
import { isCompleted, suggestIdeas } from "../utils/projectUtils";
import PageHeading from "../components/PageHeading";
import ProjectGrid from "../components/ProjectGrid";
import Empty from "../components/Empty";

export default function Projects({ token }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const data = useData("/projects", token);
  const ideas = useData("/ideas", token);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", client: "", description: "", category: "Creative" });
  const [suggestions, setSuggestions] = useState(null);
  const [revisit, setRevisit] = useState(null);
  const [reviving, setReviving] = useState(null);
  const [reviveError, setReviveError] = useState("");
  const [reviveSaving, setReviveSaving] = useState(false);
  const filtered = data.items.filter(project => !isCompleted(project) && `${project.title} ${project.client} ${project.category}`.toLowerCase().includes(search.toLowerCase()));

  async function createProject(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      const created = await api("/projects", token, { method: "POST", body: JSON.stringify(form) });
      const project = created.project || created;
      setForm({ title: "", client: "", description: "", category: "Creative" });
      setShowForm(false);
      await data.reload();
      if (project._id) {
        const matches = suggestIdeas(project, ideas.items);
        if (matches.length) setSuggestions({ project, matches });
        else navigate(`/app/projects/${project._id}`);
      } else setMessage(t("Project created. Open it from the cards below."));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function giveSecondLife(idea) {
    if (!suggestions || reviveSaving) return;
    setReviveSaving(true);
    setReviveError("");
    try {
      const newIdea = {
        title: idea.title,
        description: idea.description,
        project: suggestions.project._id,
        tags: idea.tags || [],
        status: "Proposed",
        originalIdea: idea._id
      };
      await api("/ideas", token, { method: "POST", body: JSON.stringify(newIdea) });
      navigate(`/app/projects/${suggestions.project._id}`);
      setSuggestions(null);
      setRevisit(null);
      setReviving(null);
    } catch (error) {
      setReviveError(error.message);
    } finally {
      setReviveSaving(false);
    }
  }

  function closeSuggestions() {
    if (reviveSaving) return;
    navigate(`/app/projects/${suggestions.project._id}`);
    setSuggestions(null);
    setRevisit(null);
    setReviving(null);
  }

  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("THE CREATIVE LIBRARY / 002")} title={t("Projects")} description={t("Every project has a story. Open yours.")} action={<button type="button" className="workspace-action" onClick={() => setShowForm(!showForm)} disabled={saving}><Translate>+ NEW PROJECT</Translate></button>} />
      {showForm && (
        <form className="create-form" onSubmit={createProject}>
          <h2><Translate>Start something good.</Translate></h2>
          <input placeholder={t("Project title")} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} required />
          <input placeholder={t("Client or team")} value={form.client} onChange={event => setForm({ ...form, client: event.target.value })} required />
          <input placeholder={t("Category")} value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} required />
          <textarea placeholder={t("A short project description")} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} required />
          <button type="submit" className="solid-button" disabled={saving}>{t(saving ? "SAVING..." : "SAVE PROJECT ↗")}</button>
        </form>
      )}
      {message && <p className="state-message">{message}</p>}
      <div className="projects-toolbar"><input placeholder={t("Search your projects...")} value={search} onChange={event => setSearch(event.target.value)} /><span>{filtered.length} {t("ACTIVE PROJECTS")}</span></div>
      {data.loading && <p className="state-message"><Translate>Loading projects...</Translate></p>}
      {data.error && <p className="state-message">{data.error}</p>}
      {!data.loading && !data.error && filtered.length === 0 && <Empty t={t} title={t("Nothing here. Yet.")} description={t("Create a project or explore The Archive.")} />}
      <ProjectGrid t={t} projects={filtered} />
      {suggestions && <div className="idea-modal-backdrop" onClick={closeSuggestions}>
        <section className="idea-modal comeback-modal" role="dialog" aria-modal="true" aria-label={t("This rings a bell")} onClick={event => event.stopPropagation()}>
          <div className="idea-modal-top"><span className="small-label"><Translate>OOPS! / CREATIVE DÉJÀ VU — Nº 001</Translate></span><button type="button" className="idea-close-button" aria-label={t("Close")} onClick={closeSuggestions} disabled={reviveSaving}>×</button></div>
          <div className="comeback-heading"><span><Translate>THE COMEBACK FILES</Translate></span><h2><Translate>This rings a bell.</Translate></h2><em><Translate>Good ideas have a habit of coming back.</Translate></em><p><Translate>We went digging. Look what we found.</Translate></p></div>
          <div className="comeback-list">{suggestions.matches.map(({ idea, shared }, index) => <article className="comeback-card" key={idea._id}>
            <div className="comeback-card-top"><span>{String(index + 1).padStart(2, "0")} / {t("THE COMEBACK FILES")}</span><span>↗</span></div>
            <h3>{idea.title}</h3><p>{idea.project?.title || t("Previous project")}</p>
            <div className="comeback-tags">{shared.map(word => <span key={word}>{word}</span>)}</div>
            <button type="button" className="comeback-link" disabled={reviveSaving} onClick={() => { setRevisit(idea); setReviving(null); setReviveError(""); }}><Translate>REVISIT THIS IDEA ↗</Translate></button>
          </article>)}</div>
          {revisit && <div className="comeback-detail"><span className="small-label"><Translate>THE ORIGINAL / STILL HERE</Translate></span><h3>{revisit.title}</h3><p>{revisit.description}</p><small>{t("ORIGINAL DOSSIER")}: {revisit.project?.title || t("Previous project")}</small><div className="comeback-detail-actions"><button type="button" className="solid-button" disabled={reviveSaving} onClick={() => { setReviving(revisit); setReviveError(""); }}><Translate>GIVE IT A SECOND LIFE ↗</Translate></button><button type="button" className="idea-text-button" disabled={reviveSaving} onClick={() => { setRevisit(null); setReviving(null); }}><Translate>BACK TO IDEAS</Translate></button></div></div>}
          {reviving && <div className="comeback-confirm"><strong><Translate>Same spark. New chapter.</Translate></strong><p>{t("A new proposed idea will be created in")} {suggestions.project.title}. {t("The original stays untouched.")}</p><button type="button" className="solid-button" disabled={reviveSaving} onClick={() => giveSecondLife(reviving)}>{t(reviveSaving ? "SAVING..." : "CREATE NEW VERSION ↗")}</button><button type="button" className="idea-text-button" disabled={reviveSaving} onClick={() => setReviving(null)}><Translate>CANCEL</Translate></button></div>}
          {reviveError && <p className="state-message" role="alert">{reviveError}</p>}
          <div className="comeback-footer"><div><strong><Translate>Too good to leave behind?</Translate></strong><span><Translate>Give an old idea a new chapter.</Translate></span></div><button type="button" className="comeback-finish" disabled={reviveSaving} onClick={closeSuggestions}><Translate>OPEN NEW DOSSIER ↗</Translate></button></div>
        </section>
      </div>}
    </main>
  );
}
