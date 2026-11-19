function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="workspace-heading">
      <div>
        <span className="small-label">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export default PageHeading;
