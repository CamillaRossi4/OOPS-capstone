import { useState } from "react";
import { api } from "../api";
import { useData } from "../hooks/useData";
import { Translate } from "../context/LanguageContext";
import { useLanguage } from "../context/useLanguage";
import PageHeading from "../components/PageHeading";

export default function Breakpoint({ token }) {
  const { t } = useLanguage();
  const ideas = useData("/ideas", token);
  const feedback = useData("/feedback", token);
  const emptyForm = { idea: "", comment: "", category: "Other" };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  async function saveFeedback(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      await api(editingId ? `/feedback/${editingId}` : "/feedback", token, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(form)
      });
      setForm(emptyForm);
      setEditingId(null);
      setMessage(t(editingId ? "Breakpoint updated." : "Breakpoint saved."));
      await feedback.reload();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }
  function editFeedback(item) {
    setEditingId(item._id);
    setForm({
      idea: item.idea?._id || item.idea || "",
      comment: item.comment,
      category: item.category
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }
  async function deleteFeedback(id) {
    if (!window.confirm(t("Delete this breakpoint?"))) return;
    setSaving(true);
    setMessage("");
    try {
      await api(`/feedback/${id}`, token, { method: "DELETE" });
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      setMessage(t("Breakpoint deleted."));
      await feedback.reload();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("WHEN THINGS GET STUCK / 004")} title={t("Breakpoint")} description={t("Name the obstacle. Make room for another way.")} />
      <form className="create-form" onSubmit={saveFeedback}>
        <h2>{editingId ? t("Edit breakpoint") : <Translate>What got in the way?</Translate>}</h2>
        <select aria-label={t("Choose an idea")} value={form.idea} onChange={event => setForm({ ...form, idea: event.target.value })} required>
          <option value="">{t("Choose an idea")}</option>
          {ideas.items.map(idea => <option key={idea._id} value={idea._id}>{idea.title}</option>)}
        </select>
        <select aria-label={t("Category")} value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>
          {["Budget", "Style", "Timing", "Client request", "Other"].map(category => <option key={category} value={category}>{t(category)}</option>)}
        </select>
        <textarea aria-label={t("Feedback or revision notes")} placeholder={t("Describe the block and what you tried...")} value={form.comment} onChange={event => setForm({ ...form, comment: event.target.value })} required />
        <button type="submit" className="solid-button" disabled={!ideas.items.length || saving}>
          {t(saving ? "PLEASE WAIT..." : editingId ? "SAVE CHANGES" : "SAVE BREAKPOINT")}
        </button>
        {editingId && <button type="button" onClick={cancelEdit} disabled={saving}>{t("CANCEL")}</button>}
      </form>
      {message && <p className="state-message" role="status">{message}</p>}
      {ideas.error && <p className="state-message" role="alert">{ideas.error}</p>}
      {feedback.loading && <p className="state-message">{t("LOADING...")}</p>}
      {feedback.error && <p className="state-message" role="alert">{feedback.error}</p>}
      <div className="idea-list">
        {feedback.items.map(item => (
          <article className="idea-card" key={item._id}>
            <span>{t(item.category)}</span>
            <p>{item.comment}</p>
            <small>{item.idea?.title || t("IDEA")}</small>
            <div className="breakpoint-actions">
              <button type="button" onClick={() => editFeedback(item)} disabled={saving}>{t("EDIT")}</button>
              <button type="button" onClick={() => deleteFeedback(item._id)} disabled={saving}>{t("DELETE")}</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
