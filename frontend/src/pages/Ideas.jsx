import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { API_URL, api } from "../api";
import { useData } from "../hooks/useData";
import { Translate } from "../context/LanguageContext";
import { useLanguage } from "../context/useLanguage";
import PageHeading from "../components/PageHeading";
import Empty from "../components/Empty";
export default function Ideas({ token }) {
  const { t } = useLanguage();
  const data = useData("/ideas", token);
  const projects = useData("/projects", token);
  const folders = useData("/folders", token);
  const emptyForm = { title: "", description: "", project: "", tags: "", status: "Proposed", folders: [] };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFolders, setShowFolders] = useState(false);
  const [collection, setCollection] = useState("all");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [expandedVersion, setExpandedVersion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(null);
  const [deleteIdeaConfirm, setDeleteIdeaConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [folderName, setFolderName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const statuses = ["Proposed", "Approved", "In revision", "Rejected"];
  const previousIds = new Set(data.items.map(idea => String(idea.previousRevision || "")).filter(Boolean));
  const latestIdeas = data.items.filter(idea => !previousIds.has(String(idea._id)));
  const collections = [
    { id: "all", title: "All Ideas", caption: "The complete collection", number: "01" },
    { id: "making", title: "In the Making", caption: "Proposed & in revision", number: "02" },
    { id: "approved", title: "The Chosen Ones", caption: "Approved ideas", number: "03" },
    { id: "rejected", title: "Not This Time", caption: "Rejected, not forgotten", number: "04" },
    { id: "second", title: "Second Chances", caption: "Ideas given a new life", number: "05" },
    { id: "personal", title: "My Collections", caption: "Your creative categories", number: "06" }
  ];
  const topics = ["Fashion", "Advertising", "Photography", "Branding", "Wild Ideas"];
  function matchesTopic(idea, topic) {
    const words = [idea.title, idea.description, ...(idea.tags || [])].join(" ").toLowerCase();
    const terms = {
      Fashion: ["fashion", "clothes", "style", "outfit", "dress", "wardrobe"],
      Advertising: ["campaign", "advertising", "ad", "poster", "billboard"],
      Photography: ["photo", "photography", "photograph", "cinematic", "visual"],
      Branding: ["brand", "identity", "logo", "branding"],
      "Wild Ideas": ["wild", "unexpected", "provocative", "playful", "bold"]
    };
    return terms[topic].some(term => words.split(/[^a-z]+/).includes(term));
  }
  function inCollection(idea, id) {
    if (id === "all" || id === "personal") return true;
    if (id === "making") return ["Proposed", "In revision"].includes(idea.status);
    if (id === "approved") return idea.status === "Approved";
    if (id === "rejected") return idea.status === "Rejected";
    if (id === "second") return Boolean(idea.originalIdea);
    if (id.startsWith("topic:")) return matchesTopic(idea, id.slice(6));
    if (id.startsWith("folder:")) return (idea.folders || []).some(folder => (folder._id || folder) === id.slice(7));
    return true;
  }
  const filtered = latestIdeas.filter(idea => {
    const term = `${idea.title} ${idea.description} ${idea.project?.title || ""} ${idea.project?.client || ""} ${(idea.tags || []).join(" ")}`.toLowerCase();
    return inCollection(idea, collection) && term.includes(search.trim().toLowerCase()) &&
      (!projectFilter || idea.project?._id === projectFilter) &&
      (!statusFilter || idea.status === statusFilter);
  });
  const activeTitle = collections.find(item => item.id === collection)?.title || (collection.startsWith("topic:") ? collection.slice(6) : folders.items.find(item => item._id === collection.slice(7))?.name || "My Collections");
  async function loadHistory(idea) {
    setHistoryLoading(true);
    setHistoryError("");
    setHistory([]);
    try {
      const versions = await api(`/ideas/${idea._id}/revisions`, token);
      setHistory(Array.isArray(versions) ? versions : []);
      setExpandedVersion(null);
    } catch (error) {
      setHistoryError(error.message);
    } finally {
      setHistoryLoading(false);
    }
  }
  function toggleFolder(id) {
    setForm(current => ({
      ...current,
      folders: current.folders.includes(id) ? current.folders.filter(item => item !== id) : [...current.folders, id]
    }));
  }
  function openIdea(idea) {
    setSelected(idea);
    setImageError("");
    setPreviewImage(null);
    setDeleteImage(null);
    setDeleteIdeaConfirm(null);
    setHistory([]);
    setHistoryOpen(false);
    setExpandedVersion(null);
    setHistoryError("");
    setEditingId(null);
    setMessage("");
  }
  function startEdit(idea) {
    setForm({
      title: idea.title,
      description: idea.description,
      project: idea.project?._id || "",
      tags: (idea.tags || []).join(", "),
      status: idea.status || "Proposed",
      folders: (idea.folders || []).map(folder => folder._id || folder)
    });
    setEditingId(idea._id);
    setShowForm(true);
    setSelected(null);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  }
  async function saveIdea(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      };
      await api(editingId ? `/ideas/${editingId}` : "/ideas", token, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      setMessage(t(editingId ? "Idea updated successfully." : "Idea saved successfully."));
      cancelEdit();
      await data.reload();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }
  async function deleteIdea(idea) {
    if (imageBusy) return;
    setImageBusy(true);
    setImageError("");
    try {
      await api(`/ideas/${idea._id}`, token, { method: "DELETE" });
      setSelected(null);
      setDeleteIdeaConfirm(null);
      if (editingId === idea._id) cancelEdit();
      setMessage(t("Idea deleted."));
      await data.reload();
    } catch (error) {
      setImageError(error.message);
    } finally {
      setImageBusy(false);
    }
  }
  async function addIdeaImages(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selected || !files.length || imageBusy) return;
    if (files.length > 5 || (selected.images || []).length + files.length > 10) {
      setImageError(t("You can upload up to 5 images at once and keep 10 per idea."));
      return;
    }
    if (files.some(file => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      setImageError(t("Use JPG, PNG or WebP images under 5 MB."));
      return;
    }
    setImageBusy(true);
    setImageError("");
    try {
      const body = new FormData();
      files.forEach(file => body.append("images", file));
      const response = await fetch(`${API_URL}/ideas/${selected._id}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });
      const updated = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(updated.message || t("Something went wrong."));
      setSelected(updated);
      await data.reload();
    } catch (error) {
      setImageError(error.message);
    } finally {
      setImageBusy(false);
    }
  }
  async function removeIdeaImage() {
    if (!selected || !deleteImage || imageBusy) return;
    setImageBusy(true);
    setImageError("");
    try {
      const updated = await api(`/ideas/${selected._id}/images`, token, {
        method: "DELETE",
        body: JSON.stringify({ publicId: deleteImage.publicId })
      });
      setSelected(updated);
      setPreviewImage(null);
      setDeleteImage(null);
      await data.reload();
    } catch (error) {
      setImageError(error.message);
    } finally {
      setImageBusy(false);
    }
  }
  async function createFolder(event) {
    event.preventDefault();
    if (!folderName.trim()) return;
    try {
      await api("/folders", token, { method: "POST", body: JSON.stringify({ name: folderName.trim() }) });
      setFolderName("");
      setMessage(t("Folder created."));
      await folders.reload();
    } catch (error) {
      setMessage(error.message);
    }
  }
  async function renameFolder(folder) {
    const name = window.prompt(t("Rename folder"), folder.name);
    if (name === null || !name.trim() || name.trim() === folder.name) return;
    try {
      await api(`/folders/${folder._id}`, token, { method: "PUT", body: JSON.stringify({ name: name.trim() }) });
      setMessage(t("Folder renamed."));
      await folders.reload();
      await data.reload();
    } catch (error) {
      setMessage(error.message);
    }
  }
  async function deleteFolder(folder) {
    if (!window.confirm(`${t("Delete folder")}: "${folder.name}"? ${t("The ideas will be kept.")}`)) return;
    try {
      await api(`/folders/${folder._id}`, token, { method: "DELETE" });
      setForm(current => ({ ...current, folders: current.folders.filter(id => id !== folder._id) }));
      if (collection === `folder:${folder._id}`) setCollection("personal");
      setMessage(t("Folder deleted. Your ideas are safe."));
      await folders.reload();
      await data.reload();
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("COLLECT THE GOOD ONES / 003")} title={t("Idea Library")} description={t("A place for the thoughts that deserve to stick around.")} action={<button className="workspace-action" type="button" onClick={() => { if (showForm) cancelEdit(); else { setForm(emptyForm); setEditingId(null); setShowForm(true); } }}>{t(showForm ? "CLOSE ↑" : "+ NEW IDEA")}</button>} />
      {showForm && <form className="create-form idea-library-create" onSubmit={saveIdea}>
        <h2>{t(editingId ? "Give this idea another look." : "Save a new idea.")}</h2>
        <input placeholder={t("Idea title")} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} required />
        <select value={form.project} onChange={event => setForm({ ...form, project: event.target.value })} required>
          <option value=""><Translate>Choose a project</Translate></option>
          {projects.items.map(project => <option key={project._id} value={project._id}>{project.title}</option>)}
        </select>
        <textarea placeholder={t("What's the thought?")} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} required />
        <input placeholder={t("Tags, separated by commas")} value={form.tags} onChange={event => setForm({ ...form, tags: event.target.value })} />
        <select value={form.status} onChange={event => setForm({ ...form, status: event.target.value })} aria-label={t("Idea status")}>
          {statuses.map(status => <option key={status} value={status}>{t(status)}</option>)}
        </select>
        <fieldset className="idea-folder-choices">
          <legend><Translate>CREATIVE FOLDERS / OPTIONAL</Translate></legend>
          {folders.items.length === 0 && <span><Translate>No folders yet. Create one below.</Translate></span>}
          {folders.items.map(folder => (
            <label key={folder._id}>
              <input type="checkbox" checked={form.folders.includes(folder._id)} onChange={() => toggleFolder(folder._id)} />
              {folder.name}
            </label>
          ))}
        </fieldset>
        <div className="idea-form-actions">
          <button className="solid-button" disabled={saving || !projects.items.length}>{t(saving ? "SAVING..." : editingId ? "SAVE CHANGES ↗" : "SAVE IDEA ↗")}</button>
          {editingId && <button type="button" className="idea-text-button" onClick={cancelEdit}><Translate>CANCEL</Translate></button>}
        </div>
      </form>}
      {message && <p className="state-message" role="status">{message}</p>}
      <section className="library-collections" aria-label={t("Idea collections")}>
        <div className="content-heading"><div><span className="small-label"><Translate>THE FILING SYSTEM / ALWAYS IN ORDER</Translate></span><h2><Translate>The collections</Translate></h2></div></div>
        <div className="library-collection-grid">
          {collections.map(item => (
            <button key={item.id} type="button" className={`library-collection ${collection === item.id ? "is-active" : ""}`} onClick={() => { setCollection(item.id); setSearch(""); setProjectFilter(""); setStatusFilter(""); }}>
              <span className="library-collection-number">{item.number} /</span>
              <strong>{t(item.title)}</strong>
              <small>{t(item.caption)}</small>
              <span className="library-collection-count">{latestIdeas.filter(idea => inCollection(idea, item.id)).length.toString().padStart(2, "0")} ↗</span>
            </button>
          ))}
        </div>
      </section>
      {collection === "personal" && <section className="library-personal">
        <div className="content-heading"><div><span className="small-label"><Translate>THE CREATIVE CATEGORIES</Translate></span><h2><Translate>Filed by instinct.</Translate></h2></div><button type="button" className="idea-text-button" onClick={() => setShowFolders(!showFolders)}>{t(showFolders ? "CLOSE ↑" : "+ MANAGE FOLDERS")}</button></div>
        <p className="library-helper"><Translate>Starter categories find matching ideas automatically. Your own folders are optional.</Translate></p>
        <div className="library-topic-list">
          {topics.map(topic => <button key={topic} type="button" className="library-topic" onClick={() => setCollection(`topic:${topic}`)}>{t(topic)}<span>{latestIdeas.filter(idea => matchesTopic(idea, topic)).length} ↗</span></button>)}
          {folders.items.map(folder => <button key={folder._id} type="button" className="library-topic" onClick={() => setCollection(`folder:${folder._id}`)}>{folder.name}<span>{latestIdeas.filter(idea => inCollection(idea, `folder:${folder._id}`)).length} ↗</span></button>)}
        </div>
        {showFolders && <div className="library-folder-manager">
          <form className="folder-create" onSubmit={createFolder}>
            <input placeholder={t("Name a new folder...")} value={folderName} onChange={event => setFolderName(event.target.value)} aria-label={t("New folder name")} required />
            <button className="solid-button"><Translate>+ NEW FOLDER</Translate></button>
          </form>
          {folders.items.map(folder => <div className="library-folder-edit" key={folder._id}><span>{folder.name}</span><button type="button" className="idea-text-button" onClick={() => renameFolder(folder)}><Translate>RENAME</Translate></button><button type="button" className="idea-text-button danger" onClick={() => deleteFolder(folder)}><Translate>DELETE</Translate></button></div>)}
        </div>}
        {folders.error && <p className="state-message">{folders.error}</p>}
      </section>}
      {(collection.startsWith("topic:") || collection.startsWith("folder:")) && <nav className="library-breadcrumb" aria-label={t("Collection navigation")}>
        <button type="button" onClick={() => setCollection("all")}><Translate>IDEA LIBRARY</Translate></button>
        <span>/</span>
        <button type="button" onClick={() => { setCollection("personal"); setSearch(""); setProjectFilter(""); setStatusFilter(""); }}><Translate>MY COLLECTIONS</Translate></button>
        <span>/</span>
        <strong>{t(activeTitle).toUpperCase()}</strong>
      </nav>}
      <section className="library-index">
        <div className="content-heading idea-heading"><div><span className="small-label"><Translate>THE IDEA INDEX / LATEST VERSIONS</Translate></span><h2>{t(activeTitle)}</h2></div><span className="small-label">{filtered.length} {t(filtered.length === 1 ? "IDEA" : "IDEAS")}</span></div>
        <div className="library-index-toolbar">
          <input placeholder={t("Search title, client or keyword...")} value={search} onChange={event => setSearch(event.target.value)} aria-label={t("Search ideas")} />
          <select value={projectFilter} onChange={event => setProjectFilter(event.target.value)} aria-label={t("Filter by project")}>
            <option value=""><Translate>All projects</Translate></option>
            {projects.items.map(project => <option key={project._id} value={project._id}>{project.title}</option>)}
          </select>
          <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label={t("Filter by status")}>
            <option value=""><Translate>All statuses</Translate></option>
            {statuses.map(status => <option key={status} value={status}>{t(status)}</option>)}
          </select>
        </div>
        {data.loading && <p className="state-message"><Translate>Loading ideas...</Translate></p>}
        {data.error && <p className="state-message">{data.error}</p>}
        {!data.loading && !data.error && filtered.length === 0 && <Empty t={t} title={t("Nothing filed here. Yet.")} description={t("Try another collection or change the filters.")} />}
        <div className="library-index-list">
          {filtered.map((idea, index) => <button key={idea._id} className="library-index-row" type="button" onClick={() => openIdea(idea)}>
            <span className="library-row-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="library-row-main"><strong>{idea.title}</strong><small>{idea.project?.title || t("Project idea")}</small></span>
            <span className="library-row-status">{t(idea.status || "Proposed")}{idea.revisionNumber > 1 ? ` · V${String(idea.revisionNumber).padStart(2, "0")}` : ""}</span>
            <span className="library-row-arrow">↗</span>
          </button>)}
        </div>
      </section>
      {selected && createPortal(
        <div className="idea-modal-backdrop" onClick={() => setSelected(null)}>
          <section className="idea-modal editorial-dossier-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={event => event.stopPropagation()}>
            <div className="idea-modal-top"><span className="small-label"><Translate>OOPS! / THE IDEA DOSSIER</Translate></span><button className="idea-text-button" type="button" onClick={() => setSelected(null)} aria-label={t("Close idea")}>{t("CLOSE ×")}</button></div>
            <div className="editorial-dossier-grid">
              <div className="editorial-dossier-main">
                <span className="idea-modal-status">{t(selected.status)} / {t("CURRENT EDITION")} V{String(selected.revisionNumber || 1).padStart(2, "0")}</span>
                <h2>{selected.title}</h2>
                <p className="editorial-dossier-description">{selected.description}</p>
                <div className="idea-modal-meta"><strong>{t("PROJECT")}</strong><span>{selected.project?.title || t("Project idea")}</span></div>
                <div className="idea-modal-meta"><strong>{t("TAGS")}</strong><span>{selected.tags?.join(" · ") || t("No tags")}</span></div>
                <div className="idea-modal-meta"><strong><Translate>COLLECTIONS</Translate></strong><span>{selected.folders?.map(folder => folder.name).join(" · ") || t("No personal folders")}</span></div>
                <section className="visual-file" style={{ marginTop: 30, borderTop: "1px solid #e7dce0", paddingTop: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
                    <span className="small-label">OOPS! / {t("THE VISUAL FILE")} / 01</span>
                    <span className="small-label">{String((selected.images || []).length).padStart(2, "0")} {t("IMAGES")}</span>
                  </div>
                  <div className="visual-file-grid">
                    {(selected.images || []).map((image, index) => (
                      <div className="visual-file-item" key={image.publicId}>
                        <button className="visual-file-thumbnail" type="button" onClick={() => setPreviewImage({ ...image, index })} aria-label={`${t("VIEW IMAGE")} ${index + 1}`}>
                          <img src={image.url} alt={`${selected.title} — ${index + 1}`} loading="lazy" />
                        </button>
                        <button className="visual-file-remove" type="button" disabled={imageBusy} onClick={() => { setImageError(""); setDeleteImage(image); }} aria-label={`${t("REMOVE IMAGE ↗")} ${index + 1}`} title={t("REMOVE IMAGE ↗")}>
                          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M10 4h4M6 7l1 13h10l1-13M10 11v5M14 11v5" /></svg>
                        </button>
                        <span className="visual-file-index">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                    ))}
                  </div>
                  {(selected.images || []).length === 0 && <p className="visual-file-empty">{t("A place for the images behind the idea.")}</p>}
                  <label className="visual-file-add">
                    <span className="visual-file-add-copy"><strong>{t(imageBusy ? "UPLOADING..." : "+ ADD IMAGE")}</strong><small>{t("UPLOAD FROM YOUR COMPUTER · JPG, PNG, WEBP")}</small></span>
                    
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={imageBusy || (selected.images || []).length >= 10} onChange={addIdeaImages} />
                  </label>
                  {imageError && <p className="state-message" role="alert">{imageError}</p>}
                </section>
                <div className="idea-modal-actions">
                  {selected.project?._id && <Link className="idea-text-button" to={`/app/projects/${selected.project._id}`} onClick={() => setSelected(null)}><Translate>OPEN PROJECT</Translate></Link>}
                  <button type="button" className="idea-text-button" disabled={historyLoading} onClick={() => { if (historyOpen) { setHistoryOpen(false); setExpandedVersion(null); } else { setHistoryOpen(true); loadHistory(selected); } }}>{t(historyLoading ? "LOADING..." : historyOpen ? "HIDE HISTORY ↑" : "VERSION HISTORY")}</button>
                  {(selected.revisionNumber || 1) === 1 && !previousIds.has(String(selected._id)) && <button className="idea-text-button" onClick={() => startEdit(selected)}><Translate>EDIT</Translate></button>}
                  {<button className="idea-text-button danger" onClick={() => { setImageError(""); setDeleteIdeaConfirm(selected); }}><Translate>DELETE</Translate></button>}
                </div>
              </div>
              <aside className="editorial-dossier-aside">
                <div className="editorial-aside-top"><span className="small-label"><Translate>THE REVISION ARCHIVE</Translate></span><span className="small-label">{historyOpen ? `${history.length} ${t("EDITIONS")}` : t("THE STORY SO FAR")}</span></div>
                {!historyOpen && <div className="editorial-history-intro"><h3><Translate>Every idea has a backstory.</Translate></h3><p><Translate>Explore earlier editions, notes and the changes that brought this idea here.</Translate></p><button type="button" className="idea-text-button" onClick={() => { setHistoryOpen(true); loadHistory(selected); }}><Translate>EXPLORE THE EDITIONS</Translate></button></div>}
                {historyError && <p className="state-message" role="alert">{historyError}</p>}
                {historyOpen && historyLoading && <p className="state-message"><Translate>Loading editions...</Translate></p>}
                {historyOpen && !historyLoading && history.length === 0 && !historyError && <p className="state-message"><Translate>No revisions available.</Translate></p>}
                {historyOpen && history.length > 0 && <div className="editorial-editions">
                  {[...history].sort((a, b) => (b.revisionNumber || 1) - (a.revisionNumber || 1)).map(version => {
                    const isExpanded = expandedVersion === version._id;
                    const isCurrent = version._id === selected._id;
                    return <div className={`editorial-edition ${isExpanded ? "is-expanded" : ""}`} key={version._id}>
                      <button type="button" className="editorial-edition-button" aria-expanded={isExpanded} onClick={() => setExpandedVersion(isExpanded ? null : version._id)}>
                        <span className="editorial-edition-number">V{String(version.revisionNumber || 1).padStart(2, "0")}</span>
                        <span className="editorial-edition-label"><strong>{t(isCurrent ? "Current edition" : version.revisionNumber === 1 ? "The original" : "Previous edition")}</strong><small>{version.title}</small></span>
                        <span className="editorial-edition-symbol">{isExpanded ? "−" : "+"}</span>
                      </button>
                      {isExpanded && <div className="editorial-edition-content"><p>{version.description}</p></div>}
                    </div>;
                  })}
                </div>}
              </aside>
            </div>
          </section>
          {previewImage && <div role="presentation" onClick={event => { event.stopPropagation(); setPreviewImage(null); }} style={{ position: "fixed", inset: 0, zIndex: 1001, background: "rgba(20, 15, 18, 0.92)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 24 }}>
            <div role="dialog" aria-modal="true" aria-label={t("IMAGE PREVIEW")} onClick={event => event.stopPropagation()} style={{ maxWidth: "min(900px, 95vw)", width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "white", fontSize: 12 }}><span>OOPS! / THE VISUAL FILE · {String(previewImage.index + 1).padStart(2, "0")} / {String((selected.images || []).length).padStart(2, "0")}</span><button type="button" onClick={() => setPreviewImage(null)} style={{ background: "none", border: 0, color: "white", cursor: "pointer" }}>{t("CLOSE ×")}</button></div>
              <img src={previewImage.url} alt={selected.title} style={{ display: "block", maxHeight: "75vh", maxWidth: "100%", objectFit: "contain", margin: "auto" }} />
              <button type="button" onClick={() => { setDeleteImage(previewImage); setPreviewImage(null); }} style={{ alignSelf: "flex-end", background: "none", border: 0, color: "#ffb4c5", cursor: "pointer", fontSize: 12 }}>{t("REMOVE IMAGE ↗")}</button>
            </div>
          </div>}
          {(deleteImage || deleteIdeaConfirm) && <div role="presentation" onClick={event => { event.stopPropagation(); if (!imageBusy) { setDeleteImage(null); setDeleteIdeaConfirm(null); setImageError(""); } }} style={{ position: "fixed", inset: 0, zIndex: 1002, display: "grid", placeItems: "center", padding: 20, background: "rgba(35, 18, 25, 0.58)" }}>
            <section role="alertdialog" aria-modal="true" aria-label={t("ONE LAST THING")} onClick={event => event.stopPropagation()} style={{ width: "min(430px, 100%)", background: "#f8dde6", padding: "35px 30px", borderRadius: 18, boxShadow: "0 20px 70px #0003", color: "#241b1d" }}>
              <span className="small-label">OOPS! / {t("ONE LAST THING")}</span>
              <h3 style={{ fontSize: 30, lineHeight: 1.1, margin: "18px 0" }}>{t("Are we really saying goodbye?")}</h3>
              <p style={{ marginBottom: 24 }}>{deleteIdeaConfirm ? `${t("You're about to delete")} “${deleteIdeaConfirm.title}” ${t("and all its revisions.")} ${t("This action cannot be undone.")}` : t("Remove this image from the visual file? This action cannot be undone.")}</p>
              {imageError && <p className="state-message" role="alert">{imageError}</p>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <button type="button" disabled={imageBusy} onClick={() => { setDeleteImage(null); setDeleteIdeaConfirm(null); setImageError(""); }} style={{ padding: "13px 17px", border: "1px solid #241b1d", borderRadius: 999, background: "transparent", cursor: "pointer" }}>{t(deleteIdeaConfirm ? "KEEP IDEA" : "KEEP IMAGE")}</button>
                <button type="button" disabled={imageBusy} onClick={() => deleteIdeaConfirm ? deleteIdea(deleteIdeaConfirm) : removeIdeaImage()} style={{ padding: "13px 17px", border: 0, borderRadius: 999, background: "#e31837", color: "white", cursor: "pointer" }}>{imageBusy ? t("PLEASE WAIT...") : t("YES, DELETE IT ↗")}</button>
              </div>
            </section>
          </div>}
        </div>,
        document.body
      )}
    </main>
  );
}
