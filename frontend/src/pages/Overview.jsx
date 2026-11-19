
import { Link } from "react-router-dom";
import PageHeading from "../components/PageHeading";
import ProjectGrid from "../components/ProjectGrid";
import Empty from "../components/Empty";
import BreakpointAnalysis from "../components/BreakpointAnalysis";
import { useData } from "../hooks/useData";
import { Translate } from "../context/LanguageContext";
import { useLanguage } from "../context/useLanguage";

export default function Overview({ token }) {
  const { t } = useLanguage();
  const projects = useData("/projects", token);
  const ideas = useData("/ideas", token);
  const feedback = useData("/feedback", token);
  const activeProjects = projects.items.filter(project => !["Completed", "Archived"].includes(project.status));
  const revisedIds = new Set(ideas.items.map(idea => String(idea.previousRevision || "")).filter(Boolean));
  const latestIdeas = ideas.items.filter(idea => !revisedIds.has(String(idea._id)));
  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("YOUR CREATIVE STUDIO / 001")} title={t("Good afternoon.")} description={t("A little order for all those ideas.")} action={<Link to="/app/projects" className="workspace-action"><Translate>ALL PROJECTS</Translate> </Link>} />
      <div className="overview-stats">
        <div><strong>{projects.items.length}</strong><span><Translate>PROJECTS</Translate></span></div>
        <div><strong>{latestIdeas.length}</strong><span><Translate>IDEAS SAVED</Translate></span></div>
        <div><strong>{activeProjects.length}</strong><span><Translate>IN PROGRESS</Translate></span></div>
      </div>
      <div className="content-heading">
        <div><span className="small-label"><Translate>THE WORK IN PROGRESS</Translate></span><h2><Translate>Your projects</Translate></h2></div>
        <Link to="/app/projects"><Translate>VIEW ALL</Translate> </Link>
      </div>
      {projects.loading && <p className="state-message"><Translate>Loading your projects...</Translate></p>}
      {projects.error && <p className="state-message">{projects.error}</p>}
      {!projects.loading && !projects.error && projects.items.length === 0 && <Empty t={t} title={t("A blank page. For now.")} description={t("Your first project is waiting to happen.")} />}
      <ProjectGrid t={t} projects={activeProjects.slice(0, 3)} />
      <div className="content-heading idea-heading">
        <div><span className="small-label"><Translate>NOTES FROM THE STUDIO</Translate></span><h2><Translate>Recently saved ideas</Translate></h2></div>
        <Link to="/app/ideas"><Translate>EXPLORE</Translate> </Link>
      </div>
      <div className="editorial-recent-list">
        {latestIdeas.slice(0, 4).map((idea, index) => (
          <div className="idea-row" key={idea._id}>
            <span className="editorial-row-index">{String(index + 1).padStart(2, "0")}</span>
            <span>{idea.title}</span>
            <small>{t(idea.status)}</small>
          </div>
        ))}
      </div>
      {feedback.error && <p className="state-message">{t("Feedback unavailable:")} {feedback.error}</p>}
      <BreakpointAnalysis items={feedback.items} title={t("The usual suspects.")} overall t={t} />
      <section className="thought-panel">
        <span><Translate>OOPS! / NOTES FROM THE EDITOR</Translate></span>
        <h2><Translate>Not every good idea happens on schedule.</Translate></h2>
        <p><Translate>Keep the interesting ones. We'll find a place for them.</Translate></p>
      </section>
    </main>
  );
}
