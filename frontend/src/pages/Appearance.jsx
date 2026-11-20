
import { useLanguage } from "../context/useLanguage";
import { themes } from "../utils/themes";
import PageHeading from "../components/PageHeading";

export default function Appearance({ theme, setTheme, sidebarTexture, setSidebarTexture }) {
  const { t } = useLanguage();

  return (
    <main className="workspace-page">
      <PageHeading
        eyebrow={t("MAKE YOUR SPACE YOURS / SETTINGS")}
        title={t("Appearance")}
        description={t("Choose the colours that make this studio feel like yours.")}
      />
      <div className="theme-grid">
        {Object.entries(themes).map(([key, item]) => (
          <button
            className={`theme-card ${theme === key ? "selected" : ""}`}
            key={key}
            onClick={() => setTheme(key)}
          >
            <div className="theme-swatches">
              <i style={{ background: item.accent }} />
              <i style={{ background: item.strong }} />
              <i style={{ background: item.soft }} />
            </div>
            <strong>{item.name}</strong>
            <span>{t(theme === key ? "SELECTED" : "PREVIEW THEME")}</span>
          </button>
        ))}
      </div>
      <div className="language-settings">
        <span className="small-label">SIDEBAR / BACKGROUND</span>
        <div className="language-options">
          <button
            className={`language-option ${sidebarTexture ? "selected" : ""}`}
            onClick={() => setSidebarTexture(true)}
            aria-pressed={sidebarTexture}
          >
            WITH TEXTURE
            <span>{sidebarTexture ? "✓" : "↗"}</span>
          </button>
          <button
            className={`language-option ${!sidebarTexture ? "selected" : ""}`}
            onClick={() => setSidebarTexture(false)}
            aria-pressed={!sidebarTexture}
          >
            WITHOUT TEXTURE
            <span>{!sidebarTexture ? "✓" : "↗"}</span>
          </button>
        </div>
      </div>
    </main>
  );
}
