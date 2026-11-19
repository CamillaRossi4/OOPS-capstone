import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL, api } from "../api";
import { useData } from "../hooks/useData";
import { isCompleted } from "../utils/projectUtils";
import { Translate } from "../context/LanguageContext";
import { useLanguage } from "../context/useLanguage";
import Empty from "../components/Empty";
import BreakpointAnalysis from "../components/BreakpointAnalysis";
import DossierIdea from "../components/DossierIdea";
export default function ProjectDossier({ token }) {
  const { t } = useLanguage();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const projects = useData("/projects", token);
  const ideas = useData("/ideas", token);
  const feedback = useData("/feedback", token);
  const [showFeedback, setShowFeedback] = useState(false);
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectImageBusy, setProjectImageBusy] = useState(false);
  const [projectImageError, setProjectImageError] = useState("");
  const [projectPreviewImage, setProjectPreviewImage] = useState(null);
  const [projectDeleteImage, setProjectDeleteImage] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ idea: "", comment: "", category: "Other" });
  const project = projects.items.find(item => item._id === projectId);
  const projectIdeas = ideas.items.filter(idea => (idea.project?._id || idea.project) === projectId);
  const revisedIds = new Set(projectIdeas.map(idea => String(idea.previousRevision || "")).filter(Boolean));
  const latestIdeas = projectIdeas.filter(idea => !revisedIds.has(String(idea._id)));
  const ideaIds = new Set(projectIdeas.map(idea => idea._id));
  const projectFeedback = feedback.items.filter(item => ideaIds.has(item.idea?._id || item.idea));
  async function addProjectImages(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length || projectImageBusy || !project) return;
    if (files.length > 5 || (project.images || []).length + files.length > 10) {
      setProjectImageError(t("You can upload up to 5 images at once and keep 10 per project."));
      return;
    }
    if (files.some(file => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setProjectImageError(t("Use JPG, PNG or WebP images under 5 MB."));
      return;
    }
    setProjectImageBusy(true);
    setProjectImageError("");
    try {
      const body = new FormData();
      files.forEach(file => body.append("images", file));
      const response = await fetch(`${API_URL}/projects/${projectId}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || t("Something went wrong."));
      await projects.reload();
    } catch (error) {
      setProjectImageError(error.message);
    } finally {
      setProjectImageBusy(false);
    }
  }
  async function removeProjectImage() {
    if (!projectDeleteImage || projectImageBusy) return;
    setProjectImageBusy(true);
    setProjectImageError("");
    try {
      await api(`/projects/${projectId}/images`, token, {
        method: "DELETE",
        body: JSON.stringify({ publicId: projectDeleteImage.publicId })
      });
      setProjectDeleteImage(null);
      setProjectPreviewImage(null);
      await projects.reload();
    } catch (error) {
      setProjectImageError(error.message);
    } finally {
      setProjectImageBusy(false);
    }
  }
  async function toggleCompleted() {
    setUpdatingStatus(true);
    setMessage("");
    try {
      const nextStatus = isCompleted(project) ? "In progress" : "Completed";
      await api(`/projects/${projectId}`, token, { method: "PUT", body: JSON.stringify({ status: nextStatus }) });
      await projects.reload();
      setMessage(nextStatus === "Completed" ? t("Project moved to The Archive.") : t("Project reopened."));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  }
  async function deleteProject() {
    if (deleting) return;
    setDeleting(true);
    setMessage("");
    try {
      await api(`/projects/${projectId}`, token, { method: "DELETE" });
      setShowDeleteConfirm(false);
      navigate("/app/projects");
    } catch (error) {
      setMessage(error.message);
      setShowDeleteConfirm(false);
      setDeleting(false);
    }
  }
  async function saveFeedback(event) {
    event.preventDefault();
    if (savingFeedback) return;
    setSavingFeedback(true);
    setMessage("");
    try {
      await api("/feedback", token, { method: "POST", body: JSON.stringify(form) });
      setForm({ idea: "", comment: "", category: "Other" });
      setShowFeedback(false);
      setMessage(t("Breakpoint saved."));
      await feedback.reload();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSavingFeedback(false);
    }
  }
  if (projects.loading) return <main className="workspace-page"><p className="state-message"><Translate>Loading dossier...</Translate></p></main>;
  if (!project) return <main className="workspace-page"><Link to="/app/projects"><Translate>← BACK TO PROJECTS</Translate></Link><Empty t={t} title={t("Project not found.")} description={projects.error || t("This dossier is unavailable.")} /></main>;
  return (
    <main className="workspace-page dossier-page">
      <Link className="dossier-back" to={isCompleted(project) ? "/app/archive" : "/app/projects"}>← {t("BACK TO")} {t(isCompleted(project) ? "THE ARCHIVE" : "PROJECTS")}</Link>
      <header className="dossier-header"><span className="small-label"><Translate>OOPS! / PROJECT DOSSIER</Translate></span><h1>{project.title}</h1><p>{project.client || project.category}</p><span className="dossier-status">{t(project.status || "In progress")}</span></header>
      <div className="dossier-status-actions"><button className="workspace-action" type="button" onClick={toggleCompleted} disabled={updatingStatus || deleting}>{t(updatingStatus ? "SAVING..." : isCompleted(project) ? "REOPEN PROJECT ↗" : "MARK AS COMPLETED ↗")}</button><button className="dossier-delete-button" type="button" onClick={() => setShowDeleteConfirm(true)} disabled={deleting || updatingStatus}>{t(deleting ? "PLEASE WAIT..." : "DELETE PROJECT")}</button></div>
      {showDeleteConfirm && <div className="oops-delete-backdrop" onClick={() => !deleting && setShowDeleteConfirm(false)}>
        <section className="oops-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="oops-delete-title" aria-describedby="oops-delete-description" onClick={event => event.stopPropagation()}>
          <div className="oops-delete-top"><span>OOPS! / {t("ONE LAST THING")}</span><button type="button" aria-label={t("CLOSE")} onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>×</button></div>
          <h2 id="oops-delete-title">{t("Are we really saying goodbye?")}</h2>
          <p id="oops-delete-description">{t("You're about to delete")} <strong>“{project.title}”</strong>. {t("This action cannot be undone.")} {t("Projects containing ideas cannot be deleted.")}</p>
          <div className="oops-delete-actions"><button type="button" className="oops-delete-cancel" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>{t("KEEP PROJECT")}</button><button type="button" className="oops-delete-confirm" onClick={deleteProject} disabled={deleting}>{t(deleting ? "PLEASE WAIT..." : "YES, DELETE IT ↗")}</button></div>
        </section>
      </div>}
      <style>{`
        .dossier-delete-button{min-height:42px;padding:0 22px;border:1px solid var(--strong,#E31837);border-radius:999px;background:transparent;color:var(--strong,#E31837);font:inherit;font-size:11px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:background .2s,color .2s}
        .dossier-delete-button:hover{background:var(--strong,#E31837);color:#fff}
        .dossier-delete-button:disabled{opacity:.5;cursor:not-allowed}
        .dossier-status-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .oops-delete-backdrop{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(30,20,24,.55)}
        .oops-delete-modal{box-sizing:border-box;width:min(100%,520px);padding:36px;background:var(--soft,#FFF0F3);color:var(--workspace-ink,#241B1D);box-shadow:0 24px 70px rgba(25,12,18,.2)}
        .oops-delete-top{display:flex;align-items:center;justify-content:space-between;gap:16px;color:var(--strong,#E31837);font-size:10px;font-weight:700;letter-spacing:.12em}
        .oops-delete-top button{border:0;background:transparent;color:inherit;font-size:27px;line-height:1;cursor:pointer}
        .oops-delete-modal h2{margin:32px 0 16px;font-size:clamp(28px,4vw,39px);font-weight:700;line-height:1.1;letter-spacing:-.04em}
        .oops-delete-modal p{margin:0;color:var(--workspace-ink,#241B1D);font-size:14px;line-height:1.7}
        .oops-delete-actions{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:34px}
        .oops-delete-actions button{min-height:43px;padding:0 20px;border-radius:999px;font:inherit;font-size:10px;font-weight:700;letter-spacing:.06em;cursor:pointer}
        .oops-delete-cancel{border:1px solid var(--strong,#E31837);background:transparent;color:var(--strong,#E31837)}
        .oops-delete-confirm{border:1px solid var(--strong,#E31837);background:var(--strong,#E31837);color:#fff}
        .oops-delete-actions button:disabled{opacity:.55;cursor:not-allowed}
        @media(max-width:520px){.oops-delete-modal{padding:26px}.oops-delete-actions{flex-direction:column}.oops-delete-actions button{width:100%}}
      `}</style>
      {project.description && <section className="dossier-intro"><span className="small-label"><Translate>THE BRIEF</Translate></span><p>{project.description}</p></section>}
      <section className="visual-file project-visual-file">
        <div className="project-visual-heading">
          <div><span className="small-label">OOPS! / {t("THE CONTACT SHEET")}</span><h2>{t("THE CONTACT SHEET")}</h2><p>{t("Images and references from this project.")}</p></div>
          <span className="small-label">{String((project.images || []).length).padStart(2, "0")} {t("IMAGES")}</span>
        </div>
        <div className="visual-file-grid">
          {(project.images || []).map((image, index) => (
            <div className="visual-file-item" key={image.publicId}>
              <button className="visual-file-thumbnail" type="button" onClick={() => setProjectPreviewImage({ ...image, index })} aria-label={`${t("VIEW IMAGE")} ${index + 1}`}>
                <img src={image.url} alt={`${project.title} ${index + 1}`} />
              </button>
              <button className="visual-file-remove" type="button" disabled={projectImageBusy} onClick={() => { setProjectImageError(""); setProjectDeleteImage(image); }} aria-label={`${t("REMOVE IMAGE ↗")} ${index + 1}`} title={t("REMOVE IMAGE ↗")}>×</button>
              <span className="visual-file-index">{String(index + 1).padStart(2, "0")}</span>
            </div>
          ))}
          <label className="visual-file-add">
            <span className="visual-file-add-copy"><strong>{t(projectImageBusy ? "UPLOADING..." : "+ ADD IMAGE")}</strong><small>{t("UPLOAD FROM YOUR COMPUTER · JPG, PNG, WEBP")}</small></span>
            <span className="visual-file-add-arrow" aria-hidden="true">↗</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={projectImageBusy || (project.images || []).length >= 10} onChange={addProjectImages} />
          </label>
        </div>
        {projectImageError && <p className="state-message" role="alert">{projectImageError}</p>}
        <p className="project-visual-limit">{t("You can upload up to 5 images at once and keep 10 per project.")}</p>
      </section>
      {projectPreviewImage && <div className="project-image-overlay" onClick={() => setProjectPreviewImage(null)}>
        <div className="project-image-preview" role="dialog" aria-modal="true" aria-label={t("IMAGE PREVIEW")} onClick={event => event.stopPropagation()}>
          <div className="project-image-preview-top"><span>OOPS! / {t("THE CONTACT SHEET")} · {String(projectPreviewImage.index + 1).padStart(2, "0")} / {String((project.images || []).length).padStart(2, "0")}</span><button type="button" onClick={() => setProjectPreviewImage(null)}>{t("CLOSE ×")}</button></div>
          <img src={projectPreviewImage.url} alt={project.title} />
          <button className="project-image-preview-remove" type="button" onClick={() => { setProjectDeleteImage(projectPreviewImage); setProjectPreviewImage(null); }}>{t("REMOVE IMAGE ↗")}</button>
        </div>
      </div>}
      {projectDeleteImage && <div className="oops-delete-backdrop" onClick={() => !projectImageBusy && setProjectDeleteImage(null)}>
        <section className="oops-delete-modal" role="alertdialog" aria-modal="true" aria-label={t("ONE LAST THING")} onClick={event => event.stopPropagation()}>
          <div className="oops-delete-top"><span>OOPS! / {t("ONE LAST THING")}</span><button type="button" disabled={projectImageBusy} onClick={() => setProjectDeleteImage(null)}>×</button></div>
          <h2>{t("Are we really saying goodbye?")}</h2>
          <p>{t("Remove this image from the contact sheet? This action cannot be undone.")}</p>
          {projectImageError && <p className="state-message" role="alert">{projectImageError}</p>}
          <div className="oops-delete-actions"><button type="button" className="oops-delete-cancel" disabled={projectImageBusy} onClick={() => setProjectDeleteImage(null)}>{t("KEEP IMAGE")}</button><button type="button" className="oops-delete-confirm" disabled={projectImageBusy} onClick={removeProjectImage}>{t(projectImageBusy ? "PLEASE WAIT..." : "YES, DELETE IT ↗")}</button></div>
        </section>
      </div>}
      <div className="dossier-numbers"><div><strong>{latestIdeas.length.toString().padStart(2, "0")}</strong><span><Translate>IDEAS</Translate></span></div><div><strong>{projectFeedback.length.toString().padStart(2, "0")}</strong><span><Translate>BREAKPOINTS</Translate></span></div><div><strong>{t(isCompleted(project) ? "DONE" : "LIVE")}</strong><span><Translate>STATUS</Translate></span></div></div>
      <div className="content-heading"><div><span className="small-label"><Translate>THE CREATIVE PROCESS / 01</Translate></span><h2><Translate>Ideas</Translate></h2></div><Link to="/app/ideas"><Translate>IDEA LIBRARY ↗</Translate></Link></div>
      {ideas.error && <p className="state-message">{ideas.error}</p>}
      {!ideas.loading && !ideas.error && projectIdeas.length === 0 && <Empty t={t} title={t("No ideas yet.")} description={t("Add an idea from the Idea Library and select this project.")} />}
      <div className="dossier-ideas dossier-ideas-index">{latestIdeas.map(idea => <DossierIdea key={`${idea._id}:${idea.title}:${idea.description}`} idea={idea} token={token} readOnly={isCompleted(project)} onRevisionSaved={ideas.reload} />)}</div>
      <div className="content-heading dossier-breakpoint-heading"><div><span className="small-label"><Translate>THE CREATIVE PROCESS / 02</Translate></span><h2><Translate>Breakpoint</Translate></h2></div>{!isCompleted(project) && <button className="workspace-action" onClick={() => setShowFeedback(!showFeedback)}><Translate>+ ADD BREAKPOINT</Translate></button>}</div>
      {message && <p className="state-message">{message}</p>}
      {feedback.error && <p className="state-message">{t("Feedback unavailable:")} {feedback.error}</p>}
      {showFeedback && <form className="create-form" onSubmit={saveFeedback}><h2><Translate>What got in the way?</Translate></h2><select value={form.idea} onChange={event => setForm({ ...form, idea: event.target.value })} required><option value=""><Translate>Choose an idea</Translate></option>{projectIdeas.map(idea => <option key={idea._id} value={idea._id}>{idea.title}</option>)}</select><select value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{["Budget", "Style", "Timing", "Client request", "Other"].map(category => <option key={category} value={category}>{t(category)}</option>)}</select><textarea placeholder={t("Feedback or revision notes")} value={form.comment} onChange={event => setForm({ ...form, comment: event.target.value })} required /><button className="solid-button" disabled={!projectIdeas.length || savingFeedback}>{t(savingFeedback ? "SAVING..." : "SAVE BREAKPOINT ↗")}</button></form>}
      {!feedback.loading && !feedback.error && <BreakpointAnalysis items={projectFeedback} t={t} />}
      <div className="dossier-ideas">{projectFeedback.map(item => <article className="dossier-idea" key={item._id}><span className="small-label">{t(item.category)}</span><h3>{item.idea?.title || projectIdeas.find(idea => idea._id === item.idea)?.title || t("Idea feedback")}</h3><p>{item.comment}</p></article>)}</div>
    </main>
  );
}
