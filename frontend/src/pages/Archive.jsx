import { useData } from "../hooks/useData";
import { Translate } from "../context/LanguageContext";
import { useLanguage } from "../context/useLanguage";
import { isCompleted } from "../utils/projectUtils";
import PageHeading from "../components/PageHeading";
import ProjectGrid from "../components/ProjectGrid";
import Empty from "../components/Empty";

export default function Archive({ token }) {
  const { t } = useLanguage();
  const data = useData("/projects", token);
  const archived = data.items.filter(isCompleted);
  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("THE CREATIVE LEGACY / 005")} title={t("The Archive")} description={t("Some things are too good to forget. A showcase of completed projects.")} />
      {data.loading && <p className="state-message"><Translate>Loading archive...</Translate></p>}
      {data.error && <p className="state-message">{data.error}</p>}
      {!data.loading && !data.error && archived.length === 0 && <Empty t={t} title={t("Nothing archived yet.")} description={t("Completed projects will find their place here.")} />}
      <ProjectGrid t={t} projects={archived} />
    </main>
  );
}
