
const breakpointCategories = ["Budget", "Style", "Timing", "Client request", "Other"];

function BreakpointAnalysis({ items, title = "Where did we get stuck?", overall = false, t }) {
  const counts = breakpointCategories.map(category => ({
    category,
    count: items.filter(item => (item.category || "Other") === category).length
  })).filter(item => item.count > 0).sort((a, b) => b.count - a.count);
  const recurring = counts.filter(item => item.count >= 2);
  return (
    <section className="breakpoint-analysis" aria-label={t("Breakpoint analysis")}>
      <span className="small-label">OOPS! / {overall ? t("STUDIO PATTERNS") : t("BREAKPOINT ANALYSIS")}</span>
      <h3>{t(title)}</h3>
      <p className="breakpoint-analysis-intro">{overall ? t("A look at the obstacles recorded across your creative projects.") : t("A closer look at the obstacles behind this project.")}</p>
      <div className="breakpoint-analysis-summary">
        <div><strong>{String(items.length).padStart(2, "0")}</strong><span>{t("RECORDED FEEDBACK")}</span></div>
        <div><strong>{String(counts.length).padStart(2, "0")}</strong><span>{t("CATEGORIES FOUND")}</span></div>
      </div>
      {counts.length > 0 ? (
        <div className="breakpoint-analysis-categories">
          {counts.map(item => (
            <div className="breakpoint-analysis-category" key={t(item.category)}>
              <div className="breakpoint-analysis-category-label"><strong>{t(item.category)}</strong><span>{item.count} {t("of")} {items.length}</span></div>
              <div className="breakpoint-analysis-track"><div style={{ width: `${item.count / items.length * 100}%` }} /></div>
            </div>
          ))}
        </div>
      ) : <p className="breakpoint-analysis-note">{t("No feedback recorded yet. The analysis will appear as you collect it.")}</p>}
      {recurring.length > 0 ? (
        <p className="breakpoint-analysis-note"><strong>{t("Worth another look.")}</strong> {recurring.map(item => `${t(item.category)} (${item.count})`).join(", ")} {t(recurring.length === 1 ? "appears more than once in the recorded feedback." : "appear more than once in the recorded feedback.")}</p>
      ) : items.length > 0 ? (
        <p className="breakpoint-analysis-note">{t("No recurring category yet. More feedback will help reveal patterns.")}</p>
      ) : null}
    </section>
  );
}

export default BreakpointAnalysis;
