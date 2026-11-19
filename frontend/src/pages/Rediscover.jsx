
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useData } from "../hooks/useData";
import { Translate } from "../context/LanguageContext";
import { useLanguage } from "../context/useLanguage";
import PageHeading from "../components/PageHeading";
import Empty from "../components/Empty";
import IdeaCard from "../components/IdeaCard";
export default function Rediscover({ token }) {
  const { t } = useLanguage();
  const projects = useData("/projects", token);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [items, setItems] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const statuses = ["Proposed", "Approved", "In revision", "Rejected"];
  async function searchIdeas(event) {
    if (event) event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setSelected(null);
    setItems([]);
    setResultCount(0);
    setSearched(false);
    const params = new URLSearchParams();
    if (projectFilter) params.set("project", projectFilter);
    try {
      const data = await api(`/rediscover?${params.toString()}`, token);
      const all = Array.isArray(data) ? data : [];
      const byId = new Map(all.map(idea => [String(idea._id), idea]));
      const previousIds = new Set(all.map(idea => String(idea.previousRevision || "")).filter(Boolean));
      const latest = all.filter(idea => !previousIds.has(String(idea._id)));
      const keyword = search.trim().toLowerCase();
      const visible = latest.filter(idea => {
        if (statusFilter && idea.status !== statusFilter) return false;
        if (!keyword) return true;
        let version = idea;
        const visited = new Set();
        while (version && !visited.has(String(version._id))) {
          visited.add(String(version._id));
          const text = [version.title, version.description, ...(version.tags || []), version.project?.title, version.project?.client].join(" ").toLowerCase();
          if (text.includes(keyword)) return true;
          version = byId.get(String(version.previousRevision || ""));
        }
        return false;
      });
      setItems(visible);
      setResultCount(visible.length);
    } catch (error) {
      setError(error.message);
      setItems([]);
      setResultCount(0);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  }
  function resetSearch() {
    if (loading) return;
    setSearch("");
    setProjectFilter("");
    setStatusFilter("");
    setItems([]);
    setResultCount(0);
    setSelected(null);
    setSearched(false);
    setError("");
  }
  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("NOTHING GOOD IS REALLY LOST / 004")} title={t("Rediscover")} description={t("Find the ideas worth another look. Nothing good is really lost.")} />
      <form className="create-form" onSubmit={searchIdeas}>
        <span className="small-label">{t("THE CREATIVE SEARCH")}</span>
        <h2>{t("What are we looking for?")}</h2>
        <input placeholder={t("A word, an idea, a client...")} value={search} onChange={event => setSearch(event.target.value)} aria-label={t("Search by keyword")} />
        <div className="idea-filters">
          <select value={projectFilter} onChange={event => setProjectFilter(event.target.value)} aria-label={t("Filter by project")}>
            <option value=""><Translate>All projects</Translate></option>
            {projects.items.map(project => <option key={project._id} value={project._id}>{project.title}</option>)}
          </select>
          <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label={t("Filter by status")}>
            <option value=""><Translate>All statuses</Translate></option>
            {statuses.map(status => <option key={status} value={status}>{t(status)}</option>)}
          </select>
        </div>
        <div className="idea-form-actions">
          <button className="solid-button" type="submit" disabled={loading}>{t(loading ? "SEARCHING..." : "FIND IDEAS ↗")}</button>
          <button className="idea-text-button" type="button" onClick={resetSearch} disabled={loading}><Translate>CLEAR FILTERS</Translate></button>
        </div>
      </form>
      {projects.error && <p className="state-message">{t("Projects unavailable:")} {projects.error}</p>}
      {error && <p className="state-message" role="alert">{error}</p>}
      {searched && !loading && !error && (
        <div className="content-heading idea-heading">
          <div><span className="small-label">{t("BACK FROM THE ARCHIVE")}</span><h2>{t(items.length ? "Look what we found." : "No matches this time.")}</h2></div>
          <span className="small-label">{resultCount} {t(resultCount === 1 ? "IDEA" : "IDEAS")}</span>
        </div>
      )}
      {searched && !loading && !error && items.length === 0 && <Empty t={t} title={t("Nothing turned up.")} description={t("Try another keyword or clear the filters. Your ideas are still here.")} />}
      <div className="idea-list">
        {items.map(idea => <IdeaCard key={idea._id} idea={idea} t={t} onClick={() => setSelected(idea)} />)}
      </div>
      {selected && (
        <div className="idea-modal-backdrop" onClick={() => setSelected(null)}>
          <section className="idea-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={event => event.stopPropagation()}>
            <div className="idea-modal-top"><span className="small-label"><Translate>REDISCOVER / OOPS!</Translate></span><button className="idea-text-button" type="button" onClick={() => setSelected(null)}>{t("CLOSE ×")}</button></div>
            <span className="idea-modal-status">{t(selected.status || "Proposed")}</span>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <div className="idea-modal-meta"><strong>{t("PROJECT")}</strong><span>{selected.project?.title || t("Project idea")}</span></div>
            <div className="idea-modal-meta"><strong>{t("TAGS")}</strong><span>{selected.tags?.join(" · ") || t("No tags")}</span></div>
            {selected.project?._id && <div className="idea-modal-actions"><Link className="solid-button" to={`/app/projects/${selected.project._id}`}><Translate>OPEN DOSSIER ↗</Translate></Link></div>}
          </section>
        </div>
      )}
    </main>
  );
}
