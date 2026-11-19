function Empty({ title, description, t }) {
  return (
    <div className="empty-state">
      <span>OOPS! / {t("A FRESH START")}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default Empty;
