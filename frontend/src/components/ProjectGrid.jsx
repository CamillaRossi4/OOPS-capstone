import { Link } from "react-router-dom";

function ProjectGrid({ projects, t }) {
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <Link className="project-card project-card-link" key={project._id} to={`/app/projects/${project._id}`}>
          <div className={`project-cover cover-${index % 4}`}>
            {project.cover ? <img src={project.cover} alt={project.title} /> : <span>{String(index + 1).padStart(2, "0")} / OOPS! STUDIO</span>}
            {["Completed", "Archived"].includes(project.status) && <span className="project-completed-stamp">{t("COMPLETED")} ✳</span>}
          </div>
          <div className="project-info">
            <div><h3>{project.title}</h3><p>{project.client || project.category}</p></div>
            <span>{t(["Completed", "Archived"].includes(project.status) ? "COMPLETED ↗" : "OPEN DOSSIER ↗")}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProjectGrid;
