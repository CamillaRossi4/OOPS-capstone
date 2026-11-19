function IdeaCard({ idea, onClick, t }) {
  return (
    <button className="idea-card idea-card-button" type="button" style={{ padding: "22px 24px" }} onClick={onClick}>
      <span>{t(idea.status || "Proposed")}{idea.revisionNumber > 1 ? ` / ${t("VERSION")} ${String(idea.revisionNumber).padStart(2, "0")}` : ""}</span>
      <h3>{idea.title}</h3>
      <p>{idea.description}</p>
      <small>{idea.project?.title || t("Project idea")}</small>
      {(idea.tags || []).length > 0 && <div className="idea-card-folders">{idea.tags.map((tag, index) => <span key={`${tag}-${index}`}>{tag}</span>)}</div>}
      <span className="idea-card-open">{t("OPEN IDEA ↗")}</span>
    </button>
  );
}

export default IdeaCard;
