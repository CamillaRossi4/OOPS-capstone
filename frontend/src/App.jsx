import { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import "./App.css";
const LanguageContext = createContext({ language: "en", setLanguage: () => {} });
const translations = {
  "Overview": "Panoramica",
  "Projects": "Progetti",
  "Idea Library": "Biblioteca delle idee",
  "Rediscover": "Riscopri",
  "The Archive": "Archivio",
  "Appearance": "Aspetto",
  "Settings": "Impostazioni",
  "YOUR WORKSPACE": "IL TUO SPAZIO",
  "YOUR CREATIVE SPACE": "IL TUO SPAZIO CREATIVO",
  "LOG OUT": "ESCI",
  "LOG OUT ↗": "ESCI ↗",
  "Good afternoon.": "Buon pomeriggio.",
  "A little order for all those ideas.": "Un po’ di ordine per tutte quelle idee.",
  "ALL PROJECTS": "TUTTI I PROGETTI",
  "PROJECTS": "PROGETTI",
  "IDEAS SAVED": "IDEE SALVATE",
  "IN PROGRESS": "IN CORSO",
  "Your projects": "I tuoi progetti",
  "VIEW ALL": "VEDI TUTTI",
  "Recently saved ideas": "Idee salvate di recente",
  "EXPLORE": "ESPLORA",
  "The usual suspects.": "I soliti sospetti.",
  "Not every good idea happens on schedule.": "Non tutte le buone idee arrivano al momento giusto.",
  "Keep the interesting ones. We'll find a place for them.": "Conserva quelle interessanti. Troveremo loro un posto.",
  "Every project has a story. Open yours.": "Ogni progetto ha una storia. Apri la tua.",
  "+ NEW PROJECT": "+ NUOVO PROGETTO",
  "Start something good.": "Inizia qualcosa di bello.",
  "SAVE PROJECT ↗": "SALVA PROGETTO ↗",
  "ACTIVE PROJECTS": "PROGETTI ATTIVI",
  "OPEN DOSSIER ↗": "APRI DOSSIER ↗",
  "COMPLETED": "COMPLETATO",
  "Nothing here. Yet.": "Qui non c’è ancora nulla.",
  "Create a project or explore The Archive.": "Crea un progetto o esplora l’archivio.",
  "All Ideas": "Tutte le idee",
  "In the Making": "Work in Progress",
  "The Chosen Ones": "The Chosen Ones",
  "Not This Time": "Not This Time",
  "Second Chances": "Second Chances",
  "My Collections": "Le tue collezioni",
  "The complete collection": "La raccolta completa",
  "Proposed & in revision": "Proposte e in revisione",
  "Approved ideas": "Idee approvate",
  "Rejected, not forgotten": "Scartate, non dimenticate",
  "Ideas given a new life": "Idee con una nuova vita",
  "Your creative categories": "Le tue collezioni creative",
  "Proposed": "Proposta",
  "Approved": "Approvata",
  "In revision": "In revisione",
  "Rejected": "Scartata",
  "All projects": "Tutti i progetti",
  "All statuses": "Tutti gli stati",
  "All folders": "Tutte le cartelle",
  "Find Ideas": "Trova idee",
  "FIND IDEAS ↗": "TROVA IDEE ↗",
  "CLEAR FILTERS": "AZZERA FILTRI",
  "SAVE CHANGES ↗": "SALVA MODIFICHE ↗",
  "SAVING...": "SALVATAGGIO...",
  "UPDATE PASSWORD ↗": "AGGIORNA PASSWORD ↗",
  "YOUR NAME": "IL TUO NOME",
  "EMAIL ADDRESS": "INDIRIZZO EMAIL",
  "CURRENT PASSWORD": "PASSWORD ATTUALE",
  "NEW PASSWORD": "NUOVA PASSWORD",
  "CONFIRM NEW PASSWORD": "CONFERMA NUOVA PASSWORD",
  "Make it yours.": "Rendilo tuo.",
  "Keep your account details up to date.": "Mantieni aggiornati i dati del tuo account.",
  "For your eyes only.": "Solo per i tuoi occhi.",
  "Choose a new password to protect your ideas.": "Scegli una nuova password per proteggere le tue idee.",
  "The details behind your creative universe.": "I dettagli del tuo universo creativo.",
  "EXPLORE APPEARANCE ↗": "PERSONALIZZA ASPETTO ↗",
  "SELECTED": "SELEZIONATO",
  "PREVIEW THEME": "SCEGLI TEMA",
  "Choose the colours that make this studio feel like yours.": "Scegli i colori che rendono tuo questo studio.",
  "Nothing archived yet.": "Ancora nessun progetto archiviato.",
  "Completed projects will find their place here.": "I progetti completati troveranno posto qui.",
  "Loading archive...": "Caricamento archivio...",
  "Loading projects...": "Caricamento progetti...",
  "Loading your projects...": "Caricamento dei tuoi progetti...",
  "Loading ideas...": "Caricamento idee...",
  "A blank page. For now.": "Una pagina bianca. Per ora.",
  "Your first project is waiting to happen.": "Il tuo primo progetto aspetta di nascere.",
  "Where did we get stuck?": "Dove ci siamo fermati?",
  "RECORDED FEEDBACK": "FEEDBACK REGISTRATI",
  "CATEGORIES FOUND": "CATEGORIE TROVATE",
  "No feedback recorded yet. The analysis will appear as you collect it.": "Nessun feedback registrato. L’analisi apparirà man mano.",
  "No recurring category yet. More feedback will help reveal patterns.": "Nessuna categoria ricorrente. Altri feedback aiuteranno a individuare schemi.",
  "Worth another look.": "Vale la pena riguardare.",
  "A look at the obstacles recorded across your creative projects.": "Uno sguardo agli ostacoli dei tuoi progetti creativi.",
  "A closer look at the obstacles behind this project.": "Uno sguardo agli ostacoli di questo progetto.",
  "ADD BREAKPOINT": "AGGIUNGI BREAKPOINT",
  "+ ADD BREAKPOINT": "+ AGGIUNGI BREAKPOINT",
  "Budget": "Budget",
  "Style": "Stile",
  "Timing": "Tempistiche",
  "Client request": "Richiesta cliente",
  "Other": "Altro",
  "SAVE": "SALVA",
  "CANCEL": "ANNULLA",
  "CLOSE": "CHIUDI",
  "CREATE": "CREA",
  "Search": "Cerca",
  "Search your projects...": "Cerca tra i progetti...",
  "Search ideas...": "Cerca idee...",
  "Project title": "Titolo del progetto",
  "Client or team": "Cliente o team",
  "Category": "Categoria",
  "A short project description": "Breve descrizione del progetto",
  "THE WORK IN PROGRESS": "LAVORI IN CORSO",
  "NOTES FROM THE STUDIO": "APPUNTI DI REDAZIONE",
  "NOTES FROM THE EDITOR": "NOTE DALLA REDAZIONE",
  "THE CREATIVE LIBRARY": "L’ARCHIVIO DELLE IDEE",
  "THE CREATIVE LEGACY": "L’EREDITÀ CREATIVA",
  "THE CREATIVE STUDIO": "LO STUDIO CREATIVO",
  "PERSONAL INFORMATION": "INFORMAZIONI PERSONALI",
  "PASSWORD & SECURITY": "PASSWORD E SICUREZZA",
  "YOUR ACCOUNT": "IL TUO ACCOUNT",
  "Some things are too good to forget. A showcase of completed projects.": "Alcune cose sono troppo belle per essere dimenticate. Una raccolta di progetti conclusi.",
  "THE CREATIVE WORKSPACE": "LO SPAZIO CREATIVO",
  "A HOME FOR UNFINISHED IDEAS": "UNA CASA PER LE IDEE IN SOSPESO",
  "GOOD IDEAS.": "BUONE IDEE.",
  "BAD TIMING.": "TEMPI SBAGLIATI.",
  "A little chaos never hurt anyone.": "Un po’ di caos non ha mai fatto male.",
  "GET STARTED": "INIZIA",
  "LOG IN": "ACCEDI",
  "CREATE ACCOUNT": "CREA ACCOUNT",
  "CREATE AN ACCOUNT": "CREA UN ACCOUNT",
  "Oh, it's you.": "Oh, sei tu.",
  "Let's make it official.": "Rendiamolo ufficiale.",
  "We've been expecting your next big idea.": "Aspettavamo la tua prossima grande idea.",
  "NEW HERE?": "SEI NUOVO?",
  "WELCOME BACK": "BENTORNATO",
  "ALREADY ONE OF US?": "SEI GIÀ DEI NOSTRI?",
  "PASSWORD": "PASSWORD",
  "PLEASE WAIT...": "ATTENDI...",
  "At least 8 characters": "Almeno 8 caratteri",
  "Your name": "Il tuo nome",
  "A FRESH START": "UN NUOVO INIZIO",
  "Profile updated.": "Profilo aggiornato.",
  "Password updated.": "Password aggiornata.",
  "The new passwords do not match.": "Le nuove password non coincidono.",
  "LANGUAGE & REGION": "LINGUA E REGIONE",
  "Find the ideas worth another look. Nothing good is really lost.": "Ritrova le idee che meritano una seconda possibilità. Nulla di buono va davvero perduto.",
  "THE CREATIVE SEARCH": "LA RICERCA CREATIVA",
  "What are we looking for?": "Che cosa stiamo cercando?",
  "A word, an idea, a client...": "Una parola, un’idea, un cliente...",
  "NOTHING GOOD IS REALLY LOST": "NULLA DI BUONO VA DAVVERO PERDUTO",
  "STUDIO PATTERNS": "SOTTO LA LENTE",
  "BREAKPOINT ANALYSIS": "BREAKPOINT ANALYSIS",
  "appears more than once in the recorded feedback.": "compare più volte nei feedback registrati.",
  "appear more than once in the recorded feedback.": "compaiono più volte nei feedback registrati.",
  "of": "su",
  "SEARCHING...": "RICERCA IN CORSO...",
  "BACK FROM THE ARCHIVE": "RITROVATE NELL’ARCHIVIO",
  "Look what we found.": "Guarda cosa abbiamo trovato.",
  "No matches this time.": "Nessuna corrispondenza questa volta.",
  "IDEA": "IDEA",
  "IDEAS": "IDEE",
  "Nothing turned up.": "Nessun risultato.",
  "Try another keyword or clear the filters. Your ideas are still here.": "Prova un’altra parola chiave o azzera i filtri. Le tue idee sono ancora qui.",
  "OPEN IDEA ↗": "APRI IDEA ↗",
  "Project idea": "Idea del progetto",
  "PROJECT": "PROGETTO",
  "TAGS": "TAG",
  "No tags": "Nessun tag",
  "CLOSE ×": "CHIUDI ×",
  "Projects unavailable:": "Progetti non disponibili:",
  "YOUR CREATIVE STUDIO": "IL TUO STUDIO CREATIVO",
  "REDISCOVER": "RISCOPRI",
  "ALL IDEAS": "TUTTE LE IDEE",
  "IN THE MAKING": "WORK IN PROGRESS",
  "THE CHOSEN ONES": "THE CHOSEN ONES",
  "NOT THIS TIME": "NOT THIS TIME",
  "SECOND CHANCES": "SECOND CHANCES",
  "MY COLLECTIONS": "LE TUE COLLEZIONI",
  "Filter by project": "Filtra per progetto",
  "Filter by status": "Filtra per stato",
  "Search by keyword": "Cerca per parola chiave",
  "OPEN DOSSIER": "APRI DOSSIER",
  "VERSION": "VERSIONE",
  "App language": "Lingua dell’app",
  "Choose the language of your workspace. Your ideas and projects stay in their original language.": "Scegli la lingua dello spazio di lavoro. Idee e progetti restano nella lingua originale.", 
  "YOUR CREATIVE STUDIO / 001": "IL TUO STUDIO CREATIVO / 001",
  "THE CREATIVE LEGACY / 005": "L’EREDITÀ CREATIVA / 005",
  "THE CREATIVE PROCESS / 01": "IL PROCESSO CREATIVO / 01",
  "THE CREATIVE PROCESS / 02": "IL PROCESSO CREATIVO / 02",
  "THE BRIEF": "IL BRIEF",
  "BREAKPOINTS": "BREAKPOINT",
  "STATUS": "STATO",
  "LIVE": "ATTIVO",
  "DONE": "CONCLUSO",
  "Ideas": "Idee",
  "IDEA LIBRARY ↗": "BIBLIOTECA DELLE IDEE ↗",
  "OOPS! / PROJECT DOSSIER": "OOPS! / DOSSIER PROGETTO",
  "OOPS! / THE IDEA DOSSIER": "OOPS! / DOSSIER IDEA",
  "THE REVISION ARCHIVE": "LE VERSIONI PRECEDENTI",
  "THE STORY SO FAR": "COME SIAMO ARRIVATI FIN QUI",
  "Every idea has a backstory.": "Ogni idea ha una storia.",
  "Explore earlier editions, notes and the changes that brought this idea here.": "Esplora le versioni precedenti, le note e le modifiche che hanno portato fin qui.",
  "EXPLORE THE EDITIONS ↗": "ESPLORA LE VERSIONI ↗",
  "Current edition": "Versione attuale",
  "Previous edition": "Versione precedente",
  "The original": "L’originale",
  "COLLECTIONS": "RACCOLTE",
  "No personal folders": "Nessuna collezione personale",
  "OPEN PROJECT ↗": "APRI PROGETTO ↗",
  "VERSION HISTORY ↗": "CRONOLOGIA VERSIONI ↗",
  "OPEN PROJECT": "APRI PROGETTO",
  "THE CREATIVE PROCESS": "IL PROCESSO CREATIVO",
  "MARK AS COMPLETED ↗": "SEGNA COME COMPLETATO ↗",
  "REOPEN PROJECT ↗": "RIAPRI PROGETTO ↗",
  "THE CREATIVE STUDIO / 2026": "LO STUDIO CREATIVO / 2026",
  "THE CREATIVE WORKSPACE / 2026": "LO SPAZIO CREATIVO / 2026",
  "A CREATIVE WORKSPACE / 2026": "UNO SPAZIO CREATIVO / 2026",
  "WORK IN PROGRESS. ALWAYS.": "SEMPRE IN EVOLUZIONE.",
  "GOOD IDEAS. BAD TIMING.": "BUONE IDEE. TEMPI SBAGLIATI.",
  "OOPS! / NOTES FROM THE EDITOR": "OOPS! / NOTE DALLA REDAZIONE",
  "Loading dossier...": "Caricamento dossier...",
  "Loading editions...": "Caricamento versioni...",
  "No revisions available.": "Nessuna revisione disponibile.",
  "Choose a project": "Scegli un progetto",
  "Choose an idea": "Scegli un’idea",
  "What got in the way?": "Che cosa ha ostacolato il progetto?",
  "SAVE BREAKPOINT": "SALVA BREAKPOINT",
  "SAVE BREAKPOINT ↗": "SALVA BREAKPOINT ↗",
  "Feedback or revision notes": "Feedback o note di revisione",
  "Describe the block and what you tried...": "Descrivi l’ostacolo e cosa hai provato...",
  "Idea feedback": "Feedback sull’idea",
  "Project not found.": "Progetto non trovato.",
  "This dossier is unavailable.": "Questo dossier non è disponibile.",
  "No ideas yet.": "Ancora nessuna idea.",
  "Add an idea from the Idea Library and select this project.": "Aggiungi un’idea dalla Biblioteca delle idee e seleziona questo progetto.",
  "Project moved to The Archive.": "Progetto spostato in Archivio.",
  "Project reopened.": "Progetto riaperto.",
  "Breakpoint saved.": "Breakpoint salvato.",
  "Feedback unavailable:": "Feedback non disponibili:",
  "← BACK TO PROJECTS": "← TORNA AI PROGETTI",
  "THE ARCHIVE": "ARCHIVIO",
  "BACK TO IDEAS": "TORNA ALLE IDEE",
  "+ CREATE REVISION": "+ CREA REVISIONE",
  "CLOSE HISTORY ↑": "CHIUDI CRONOLOGIA ↑",
  "LOADING...": "CARICAMENTO...",
  "Give it another look.": "Rivediamo questa idea.",
  "Revision title": "Titolo della revisione",
  "Revision description": "Descrizione della revisione",
  "What changes in this version?": "Che cosa cambia in questa versione?",
  "SAVE REVISION ↗": "SALVA REVISIONE ↗",
  "THE NEXT CHAPTER": "IL PROSSIMO CAPITOLO",
  "VERSIONS": "VERSIONI",
  "LATEST": "ULTIMA",
  "SECOND LIFE": "SECOND CHANCES",
  "CREATIVE FOLDERS / OPTIONAL": "CARTELLE CREATIVE / FACOLTATIVE",
  "+ NEW FOLDER": "+ NUOVA CARTELLA",
  "No folders yet. Create one below.": "Ancora nessuna cartella. Creane una qui sotto.",
  "RENAME": "RINOMINA",
  "DELETE": "ELIMINA",
  "EDIT ↗": "MODIFICA ↗",
  "The collections": "Le collezioni",
  "Filed by instinct.": "Organizzate per istinto.",
  "THE CREATIVE CATEGORIES": "LE COLLEZIONI CREATIVE",
  "THE FILING SYSTEM / ALWAYS IN ORDER": "LE COLLEZIONI / SEMPRE IN ORDINE",
  "THE IDEA INDEX / LATEST VERSIONS": "INDICE DELLE IDEE / ULTIME VERSIONI",
  "Starter categories find matching ideas automatically. Your own folders are optional.": "Le categorie iniziali raccolgono automaticamente le idee corrispondenti. Le cartelle personali sono facoltative.",
  "OOPS! / CREATIVE DÉJÀ VU — Nº 001": "OOPS! / DÉJÀ VU CREATIVO — Nº 001",
  "THE COMEBACK FILES": "L’ARCHIVIO DEI RITORNI",
  "This rings a bell.": "Questa mi ricorda qualcosa.",
  "Good ideas have a habit of coming back.": "Le buone idee sanno sempre tornare.",
  "We went digging. Look what we found.": "Abbiamo cercato nell’archivio. Guarda cosa abbiamo trovato.",
  "REVISIT THIS IDEA ↗": "RISCOPRI QUESTA IDEA ↗",
  "THE ORIGINAL / STILL HERE": "L’ORIGINALE / ANCORA QUI",
  "GIVE IT A SECOND LIFE ↗": "DAI UNA NUOVA OCCASIONE ↗",
  "Same spark. New chapter.": "Stessa scintilla. Nuovo capitolo.",
  "Too good to leave behind?": "Troppo bella per lasciarla indietro?",
  "Give an old idea a new chapter.": "Dai un nuovo capitolo a una vecchia idea.",
  "OPEN NEW DOSSIER ↗": "APRI IL NUOVO DOSSIER ↗",
  "01 / PERSONAL INFORMATION": "01 / INFORMAZIONI PERSONALI",
  "02 / PASSWORD & SECURITY": "02 / PASSWORD E SICUREZZA",
  "Breakpoint": "Breakpoint",
  "SAVE CHANGES": "SALVA MODIFICHE",
  "YOUR ACCOUNT / SETTINGS": "IL TUO ACCOUNT / IMPOSTAZIONI",
  "MAKE YOUR SPACE YOURS / SETTINGS": "PERSONALIZZA IL TUO SPAZIO / IMPOSTAZIONI",
  "IN REVISION": "IN REVISIONE",
  "CURRENT EDITION": "VERSIONE ATTUALE",
  "THE ORIGINAL": "L’ORIGINALE",
  "NOTHING GOOD IS REALLY LOST / 004": "NULLA DI BUONO VA DAVVERO PERDUTO / 004",
  "In progress": "In corso",
  "COMPLETED ↗": "COMPLETATO ↗",
  "BACK TO": "TORNA A",
  "REVISION HISTORY": "CRONOLOGIA REVISIONI",
  "COMPLETED ✳": "COMPLETATO ✳",
  "Completed": "Completato",
  "Archived": "Archiviato",
  "Breakpoint analysis": "Breakpoint Analysis",
  "EDITIONS": "VERSIONI",
  "HIDE HISTORY ↑": "NASCONDI CRONOLOGIA ↑",
  "CREATE NEW VERSION ↗": "CREA NUOVA VERSIONE ↗",
  "A new proposed idea will be created in": "Verrà creata una nuova idea proposta in",
  "The original stays untouched.": "L’originale rimane invariato.",
  "ORIGINAL DOSSIER": "DOSSIER ORIGINALE",
  "Previous project": "Progetto precedente",
  "Project created. Open it from the cards below.": "Progetto creato. Aprilo dalle copertine qui sotto.",
  "GOOD THINGS START HERE.": "LE COSE BELLE INIZIANO QUI.",
  "A LITTLE DRAMA NEVER HURT.": "UN PO’ DI DRAMMA NON HA MAI FATTO MALE.",
  "NEW HERE? / 002": "SEI NUOVO? / 002",
  "WELCOME BACK / 001": "BENTORNATO / 001",
  "Close idea": "Chiudi idea",
  "Close": "Chiudi",
  "Breakpoint analysis": "Breakpoint Analysis",
  "This rings a bell": "Questa mi ricorda qualcosa",
  "Nothing filed here. Yet.": "Non c’è ancora nulla qui.",
  "Try another collection or change the filters.": "Prova un’altra raccolta o modifica i filtri.",
  "THE CREATIVE LIBRARY / 002": "LA BIBLIOTECA CREATIVA / 002",
  "No ideas found.": "Nessuna idea trovata.",
  "No folders": "Nessuna cartella",
  "Your creative space": "Il tuo spazio creativo",
  "A place for the thoughts that deserve to stick around.": "Uno spazio per le idee che meritano di restare.",
  "COLLECT THE GOOD ONES / 003": "RACCOGLI LE IDEE MIGLIORI / 003",
  "Collection navigation": "Navigazione raccolte",
  "Idea collections": "Raccolte di idee",
  "Idea status": "Stato dell’idea",
  "Idea title": "Titolo dell’idea",
  "Name a new folder...": "Dai un nome alla nuova cartella...",
  "Name the obstacle. Make room for another way.": "Dai un nome all’ostacolo. Trova un’altra strada.",
  "New folder name": "Nome della nuova cartella",
  "Search ideas": "Cerca idee",
  "Search title, client or keyword...": "Cerca titolo, cliente o parola chiave...",
  "Tags, separated by commas": "Tag separati da virgole",
  "Version history": "Cronologia versioni",
  "WHEN THINGS GET STUCK / 004": "QUANDO QUALCOSA SI BLOCCA / 004",
  "What's the thought?": "Qual è l’idea?",
  "IDEA LIBRARY": "BIBLIOTECA DELLE IDEE",
  "IN REVISION / CURRENT EDITION": "IN REVISIONE / VERSIONE ATTUALE",
  "VERSION HISTORY": "CRONOLOGIA VERSIONI",
  "REDISCOVER / OOPS!": "RISCOPRI / OOPS!",
  "CLOSE ↑": "CHIUDI ↑",
  "+ MANAGE FOLDERS": "+ GESTISCI CARTELLE",
  "+ NEW IDEA": "+ NUOVA IDEA",
  "Give this idea another look.": "Rivediamo questa idea.",
  "Save a new idea.": "Salva una nuova idea.",
  "SAVE IDEA ↗": "SALVA IDEA ↗",
  "Idea updated successfully.": "Idea aggiornata.",
  "Idea saved successfully.": "Idea salvata.",
  "Idea deleted.": "Idea eliminata.",
  "Folder created.": "Cartella creata.",
  "Folder renamed.": "Cartella rinominata.",
  "Folder deleted. Your ideas are safe.": "Cartella eliminata. Le tue idee sono al sicuro.",
  "Hide password": "Nascondi password",
  "Show password": "Mostra password",
  "The server did not return an access token.": "Il server non ha restituito un token di accesso.",
  "Something went wrong.": "Si è verificato un problema.",
  "Fashion": "Moda",
  "Advertising": "Pubblicità",
  "Photography": "Fotografia",
  "Branding": "Branding",
  "Wild Ideas": "Idee fuori dagli schemi",
  "Delete idea": "Eliminare l’idea",
  "This action cannot be undone.": "Questa operazione non può essere annullata.",
  "Rename folder": "Rinomina cartella",
  "Delete folder": "Eliminare la cartella",
  "The ideas will be kept.": "Le idee verranno conservate.",
};
function Translate({ children }) {
  const { language } = useContext(LanguageContext);
  return language === "it" ? (translations[children] || children) : children;
}
function useLanguage() {
  const { language, setLanguage } = useContext(LanguageContext);
  return { language, setLanguage, t: value => language === "it" ? translations[value] || value : value };
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const navigation = [
  { label: "Overview", path: "/app", number: "01" },
  { label: "Projects", path: "/app/projects", number: "02" },
  { label: "Idea Library", path: "/app/ideas", number: "03" },
  { label: "Rediscover", path: "/app/rediscover", number: "04" },
  { label: "The Archive", path: "/app/archive", number: "05" }
];
const themes = {
  original: { name: "Cherry Bomb", accent: "#F8DDE6", strong: "#E31837", soft: "#FFF0F3", background: "#FFFCF9", ink: "#241B1D" },
  olive: { name: "Olive Theory", accent: "#C7D6A5", strong: "#586B3D", soft: "#E8EBCF", background: "#FCFAF0", ink: "#30382A" },
  blue: { name: "Blue Hour", accent: "#C4D3F3", strong: "#2848C7", soft: "#E8EDFA", background: "#FFFDF8", ink: "#222D4A" },
  espresso: { name: "Espresso Club", accent: "#F1D4C4", strong: "#623A30", soft: "#F8E9E0", background: "#FFF9F2", ink: "#392A24" }
};
function getSession() {
  try {
    return JSON.parse(localStorage.getItem("oops-session"));
  } catch {
    return null;
  }
}
async function api(path, token, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}
function App() {
  const [session, setSession] = useState(getSession);
  const [language, setLanguage] = useState(() => localStorage.getItem("oops-language") === "it" ? "it" : "en");
  useEffect(() => { localStorage.setItem("oops-language", language); document.documentElement.lang = language; }, [language]);
  function login(data) {
    localStorage.setItem("oops-session", JSON.stringify(data));
    setSession(data);
  }
  function logout() {
    localStorage.removeItem("oops-session");
    setSession(null);
  }
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome session={session} />} />
        <Route path="/login" element={session ? <Navigate to="/app" replace /> : <Auth type="login" onLogin={login} />} />
        <Route path="/register" element={session ? <Navigate to="/app" replace /> : <Auth type="register" onLogin={login} />} />
        <Route path="/app/*" element={session ? <Workspace session={session} logout={logout} /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </LanguageContext.Provider>
  );
}
function Welcome({ session }) {
  const { t } = useLanguage();
  return (
    <div className="welcome-page">
      <header className="welcome-header">
        <Link to="/" className="brand">oops!</Link>
        <span className="welcome-top-label"><Translate>A CREATIVE WORKSPACE / 2026</Translate></span>
      </header>
      <main className="welcome-main">
        <section className="welcome-content">
          <span className="welcome-eyebrow"><Translate>A HOME FOR UNFINISHED IDEAS</Translate></span>
          <div className="welcome-title">
            <h1><Translate>GOOD IDEAS.</Translate></h1>
            <h1 className="welcome-title-accent"><span><Translate>BAD TIMING.</Translate></span></h1>
          </div>
          <p><Translate>A little chaos never hurt anyone.</Translate></p>
          <div className="welcome-actions">
            <Link to={session ? "/app" : "/register"} className="welcome-button"><Translate>GET STARTED</Translate></Link>
            <Link to={session ? "/app" : "/login"} className="welcome-login"><Translate>LOG IN</Translate></Link>
          </div>
        </section>
      </main>
      <footer className="welcome-footer">
        <span>OOPS! © 2026</span>
        <span><Translate>WORK IN PROGRESS. ALWAYS.</Translate></span>
      </footer>
    </div>
  );
}
function Auth({ type, onLogin }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isRegister = type === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api(`/auth/${isRegister ? "register" : "login"}`, null, {
        method: "POST",
        body: JSON.stringify(isRegister ? { name, email, password } : { email, password })
      });
      if (!data.token) throw new Error(t("The server did not return an access token."));
      onLogin(data);
      navigate("/app");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={`auth-page ${isRegister ? "register-page" : "login-page"}`}>
      <header className="auth-header">
        <Link to="/" className="brand">oops!</Link>
        <span><Translate>THE CREATIVE WORKSPACE / 2026</Translate></span>
      </header>
      <main className="auth-main">
        <section className="auth-card">
          <div className="auth-card-top">
            <span>{t(isRegister ? "NEW HERE? / 002" : "WELCOME BACK / 001")}</span>
            <span>✳</span>
          </div>
          <div className="auth-heading">
            <span className="auth-eyebrow">{t(isRegister ? "GOOD THINGS START HERE." : "A LITTLE DRAMA NEVER HURT.")}</span>
            <h1>{t(isRegister ? "Let's make it official." : "Oh, it's you.")}</h1>
            {!isRegister && <p><Translate>We've been expecting your next big idea.</Translate></p>}
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-field">
                <label htmlFor="name"><Translate>YOUR NAME</Translate></label>
                <input id="name" type="text" placeholder={t("Your name")} value={name} onChange={event => setName(event.target.value)} required />
              </div>
            )}
            <div className="form-field">
              <label htmlFor="email"><Translate>EMAIL ADDRESS</Translate></label>
              <input id="email" type="email" placeholder={t("you@example.com")} value={email} onChange={event => setEmail(event.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="password"><Translate>PASSWORD</Translate></label>
              <div className="password-field">
                <input id="password" type={showPassword ? "text" : "password"} placeholder={t("At least 8 characters")} value={password} onChange={event => setPassword(event.target.value)} minLength={8} required />
                <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={t(showPassword ? "Hide password" : "Show password")} aria-pressed={showPassword}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {!showPassword && <path d="M3 3 21 21" />}
                  </svg>
                </button>
              </div>
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="auth-submit" type="submit" disabled={loading}>
              {t(loading ? "PLEASE WAIT..." : isRegister ? "CREATE ACCOUNT" : "LOG IN")}
            </button>
          </form>
          <div className="auth-switch">
            <span>{t(isRegister ? "ALREADY ONE OF US?" : "NEW HERE?")}</span>
            <Link to={isRegister ? "/login" : "/register"}>{t(isRegister ? "LOG IN" : "CREATE AN ACCOUNT")}</Link>
          </div>
        </section>
      </main>
      <footer className="auth-footer">
        <span><Translate>GOOD IDEAS. BAD TIMING.</Translate></span>
        <span>OOPS! © 2026</span>
      </footer>
    </div>
  );
}
function Workspace({ session, logout }) {
  const { t } = useLanguage();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("oops-theme");
    return themes[saved] ? saved : "original";
  });
  function updateSessionUser(updatedUser) {
    const nextSession = { ...session, user: { ...session.user, ...updatedUser } };
    localStorage.setItem("oops-session", JSON.stringify(nextSession));
    window.location.reload();
  }
  const selected = themes[theme];
  useEffect(() => {
    localStorage.setItem("oops-theme", theme);
  }, [theme]);
  return (
    <div className="app-layout" style={{ "--accent": selected.accent, "--strong": selected.strong, "--soft": selected.soft, "--workspace-bg": selected.background, "--workspace-ink": selected.ink }}>
      <aside className="sidebar">
        <Link to="/app" className="brand">oops!</Link>
        <div className="sidebar-content">
          <span className="sidebar-label"><Translate>YOUR WORKSPACE</Translate></span>
          <nav className="sidebar-nav">
            {navigation.map(item => (
              <NavLink key={item.path} to={item.path} end={item.path === "/app"}>
                <span>{item.number}</span>{t(item.label)}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <NavLink to="/app/appearance"><Translate>Appearance</Translate></NavLink>
          <NavLink to="/app/settings"><Translate>Settings</Translate></NavLink>
          <button onClick={logout}><Translate>LOG OUT</Translate> </button>
          <span><Translate>THE CREATIVE STUDIO / 2026</Translate></span>
        </div>
      </aside>
      <div className="workspace">
        <header className="workspace-topbar">
          <span><Translate>OOPS!</Translate> <i>/</i> <Translate>YOUR CREATIVE SPACE</Translate></span>
          <span>{session.user?.name || session.user?.email}</span>
        </header>
        <Routes>
          <Route index element={<Overview token={session.token} />} />
          <Route path="projects" element={<Projects token={session.token} />} />
          <Route path="projects/:projectId" element={<ProjectDossier token={session.token} />} />
          <Route path="ideas" element={<Ideas token={session.token} />} />
          <Route path="breakpoint" element={<Breakpoint token={session.token} />} />
          <Route path="rediscover" element={<Rediscover token={session.token} />} />
          <Route path="archive" element={<Archive token={session.token} />} />
          <Route path="appearance" element={<Appearance theme={theme} setTheme={setTheme} />} />
          <Route path="settings" element={<Settings user={session.user} token={session.token} logout={logout} onProfileSaved={updatedUser => updateSessionUser(updatedUser)} />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </div>
    </div>
  );
}
function useData(path, token) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function reload() {
    try {
      setLoading(true);
      setError("");
      const data = await api(path, token);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await api(path, token);
        if (active) setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) setError(error.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [path, token]);
  return { items, loading, error, reload };
}
function PageHeading({ eyebrow, title, description, action }) {
  const { t } = useLanguage();
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
const breakpointCategories = ["Budget", "Style", "Timing", "Client request", "Other"];
function BreakpointAnalysis({ items, title = "Where did we get stuck?", overall = false }) {
  const { t } = useLanguage();
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
        <div><strong>{String(items.length).padStart(2, "0")}</strong><span><Translate>RECORDED FEEDBACK</Translate></span></div>
        <div><strong>{String(counts.length).padStart(2, "0")}</strong><span><Translate>CATEGORIES FOUND</Translate></span></div>
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
      ) : <p className="breakpoint-analysis-note"><Translate>No feedback recorded yet. The analysis will appear as you collect it.</Translate></p>}
      {recurring.length > 0 ? (
        <p className="breakpoint-analysis-note"><strong><Translate>Worth another look.</Translate></strong> {recurring.map(item => `${t(item.category)} (${item.count})`).join(", ")} {t(recurring.length === 1 ? "appears more than once in the recorded feedback." : "appear more than once in the recorded feedback.")}</p>
      ) : items.length > 0 ? (
        <p className="breakpoint-analysis-note"><Translate>No recurring category yet. More feedback will help reveal patterns.</Translate></p>
      ) : null}
    </section>
  );
}
function Overview({ token }) {
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
      {!projects.loading && !projects.error && projects.items.length === 0 && <Empty title={t("A blank page. For now.")} description={t("Your first project is waiting to happen.")} />}
      <ProjectGrid projects={projects.items.slice(0, 3)} />
      <div className="content-heading idea-heading">
        <div><span className="small-label"><Translate>NOTES FROM THE STUDIO</Translate></span><h2><Translate>Recently saved ideas</Translate></h2></div>
        <Link to="/app/ideas"><Translate>EXPLORE</Translate> </Link>
      </div>
      <div className="editorial-recent-list">{latestIdeas.slice(0, 4).map((idea, index) => (
        <div className="idea-row" key={idea._id}><span className="editorial-row-index">{String(index + 1).padStart(2, "0")}</span><span>{idea.title}</span><small>{t(idea.status)}</small></div>
      ))}</div>
      {feedback.error && <p className="state-message">{t("Feedback unavailable:")} {feedback.error}</p>}
            {!feedback.loading && !feedback.error && <BreakpointAnalysis items={feedback.items} title={t("The usual suspects.")} overall />}
      <section className="thought-panel">
        <span><Translate>OOPS! / NOTES FROM THE EDITOR</Translate></span>
        <h2><Translate>Not every good idea happens on schedule.</Translate></h2>
        <p><Translate>Keep the interesting ones. We'll find a place for them.</Translate></p>
      </section>
    </main>
  );
}
function isCompleted(project) {
  return ["Completed", "Archived"].includes(project.status);
}
function ProjectGrid({ projects }) {
  const { t } = useLanguage();
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <Link className="project-card project-card-link" key={project._id} to={`/app/projects/${project._id}`}>
          <div className={`project-cover cover-${index % 4}`}>
            {project.cover ? <img src={project.cover} alt={project.title} /> : <span>{String(index + 1).padStart(2, "0")} / OOPS! STUDIO</span>}
            {isCompleted(project) && <span className="project-completed-stamp">{t("COMPLETED")} ✳</span>}
          </div>
          <div className="project-info">
            <div><h3>{project.title}</h3><p>{project.client || project.category}</p></div>
            <span>{t(isCompleted(project) ? "COMPLETED ↗" : "OPEN DOSSIER ↗")}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
const commonWords = new Set(["this", "that", "with", "from", "your", "their", "about", "after", "before", "into", "have", "will", "were", "what", "when", "where", "then", "than", "been", "only", "more", "some", "project", "creative", "campaign", "idea", "ideas", "client", "work", "the", "and", "for", "are", "you", "our", "its", "una", "uno", "per", "con", "che", "del", "della", "delle", "gli", "nel", "alla", "dalla"]);
function keywords(value) {
  return [...new Set(String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/[a-z0-9]{3,}/g)?.filter(word => !commonWords.has(word)) || [])];
}
function suggestIdeas(project, ideas) {
  const terms = keywords(`${project.title} ${project.client} ${project.category} ${project.description}`);
  if (!terms.length) return [];
  return ideas.filter(idea => (idea.project?._id || idea.project) !== project._id).map(idea => {
    const ideaTerms = keywords(`${idea.title} ${idea.description} ${(idea.tags || []).join(" ")}`);
    const shared = terms.filter(word => ideaTerms.includes(word));
    return { idea, shared };
  }).filter(item => item.shared.length >= 2).sort((a, b) => b.shared.length - a.shared.length).slice(0, 3);
}
function Projects({ token }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const data = useData("/projects", token);
  const ideas = useData("/ideas", token);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ title: "", client: "", description: "", category: "Creative" });
  const [suggestions, setSuggestions] = useState(null);
  const [revisit, setRevisit] = useState(null);
  const [reviving, setReviving] = useState(null);
  const [reviveError, setReviveError] = useState("");
  const [reviveSaving, setReviveSaving] = useState(false);
  const filtered = data.items.filter(project => !isCompleted(project) && `${project.title} ${project.client} ${project.category}`.toLowerCase().includes(search.toLowerCase()));
  async function createProject(event) {
    event.preventDefault();
    try {
      const created = await api("/projects", token, { method: "POST", body: JSON.stringify(form) });
      const project = created.project || created;
      setForm({ title: "", client: "", description: "", category: "Creative" });
      setShowForm(false);
      await data.reload();
      if (project._id) {
        const matches = suggestIdeas(project, ideas.items);
        if (matches.length) setSuggestions({ project, matches });
        else navigate(`/app/projects/${project._id}`);
      } else setMessage(t("Project created. Open it from the cards below."));
    } catch (error) {
      setMessage(error.message);
    }
  }
  async function giveSecondLife(idea) {
    if (!suggestions || reviveSaving) return;
    setReviveSaving(true);
    setReviveError("");
    try {
      const newIdea = {
        title: idea.title,
        description: idea.description,
        project: suggestions.project._id,
        tags: idea.tags || [],
        status: "Proposed",
        originalIdea: idea._id
      };
      await api("/ideas", token, { method: "POST", body: JSON.stringify(newIdea) });
      navigate(`/app/projects/${suggestions.project._id}`);
      setSuggestions(null);
      setRevisit(null);
      setReviving(null);
    } catch (error) {
      setReviveError(error.message);
    } finally {
      setReviveSaving(false);
    }
  }
  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("THE CREATIVE LIBRARY / 002")} title={t("Projects")} description={t("Every project has a story. Open yours.")} action={<button className="workspace-action" onClick={() => setShowForm(!showForm)}><Translate>+ NEW PROJECT</Translate></button>} />
      {showForm && (
        <form className="create-form" onSubmit={createProject}>
          <h2><Translate>Start something good.</Translate></h2>
          <input placeholder={t("Project title")} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} required />
          <input placeholder={t("Client or team")} value={form.client} onChange={event => setForm({ ...form, client: event.target.value })} required />
          <input placeholder={t("Category")} value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} required />
          <textarea placeholder={t("A short project description")} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} required />
          <button className="solid-button"><Translate>SAVE PROJECT ↗</Translate></button>
        </form>
      )}
      {message && <p className="state-message">{message}</p>}
      <div className="projects-toolbar"><input placeholder={t("Search your projects...")} value={search} onChange={event => setSearch(event.target.value)} /><span>{filtered.length} {t("ACTIVE PROJECTS")}</span></div>
      {data.loading && <p className="state-message"><Translate>Loading projects...</Translate></p>}
      {data.error && <p className="state-message">{data.error}</p>}
      {!data.loading && !data.error && filtered.length === 0 && <Empty title={t("Nothing here. Yet.")} description={t("Create a project or explore The Archive.")} />}
      <ProjectGrid projects={filtered} />
      {suggestions && <div className="idea-modal-backdrop" onClick={() => { navigate(`/app/projects/${suggestions.project._id}`); setSuggestions(null); }}>
        <section className="idea-modal comeback-modal" role="dialog" aria-modal="true" aria-label={t("This rings a bell")} onClick={event => event.stopPropagation()}>
          <div className="idea-modal-top"><span className="small-label"><Translate>OOPS! / CREATIVE DÉJÀ VU — Nº 001</Translate></span><button className="idea-close-button" aria-label={t("Close")} onClick={() => { navigate(`/app/projects/${suggestions.project._id}`); setSuggestions(null); }}>×</button></div>
          <div className="comeback-heading"><span><Translate>THE COMEBACK FILES</Translate></span><h2><Translate>This rings a bell.</Translate></h2><em><Translate>Good ideas have a habit of coming back.</Translate></em><p><Translate>We went digging. Look what we found.</Translate></p></div>
          <div className="comeback-list">{suggestions.matches.map(({ idea, shared }, index) => <article className="comeback-card" key={idea._id}>
            <div className="comeback-card-top"><span>{String(index + 1).padStart(2, "0")} / {t("THE COMEBACK FILES")}</span><span>↗</span></div>
            <h3>{idea.title}</h3><p>{idea.project?.title || t("Previous project")}</p>
            <div className="comeback-tags">{shared.map(word => <span key={word}>{word}</span>)}</div>
            <button type="button" className="comeback-link" onClick={() => { setRevisit(idea); setReviving(null); setReviveError(""); }}><Translate>REVISIT THIS IDEA ↗</Translate></button>
          </article>)}</div>
          {revisit && <div className="comeback-detail"><span className="small-label"><Translate>THE ORIGINAL / STILL HERE</Translate></span><h3>{revisit.title}</h3><p>{revisit.description}</p><small>{t("ORIGINAL DOSSIER")}: {revisit.project?.title || t("Previous project")}</small><div className="comeback-detail-actions"><button type="button" className="solid-button" onClick={() => { setReviving(revisit); setReviveError(""); }}><Translate>GIVE IT A SECOND LIFE ↗</Translate></button><button type="button" className="idea-text-button" onClick={() => { setRevisit(null); setReviving(null); }}><Translate>BACK TO IDEAS</Translate></button></div></div>}
          {reviving && <div className="comeback-confirm"><strong><Translate>Same spark. New chapter.</Translate></strong><p>{t("A new proposed idea will be created in")} {suggestions.project.title}. {t("The original stays untouched.")}</p><button type="button" className="solid-button" disabled={reviveSaving} onClick={() => giveSecondLife(reviving)}>{t(reviveSaving ? "SAVING..." : "CREATE NEW VERSION ↗")}</button><button type="button" className="idea-text-button" onClick={() => setReviving(null)}><Translate>CANCEL</Translate></button></div>}
          {reviveError && <p className="state-message" role="alert">{reviveError}</p>}
          <div className="comeback-footer"><div><strong><Translate>Too good to leave behind?</Translate></strong><span><Translate>Give an old idea a new chapter.</Translate></span></div><button type="button" className="comeback-finish" onClick={() => { navigate(`/app/projects/${suggestions.project._id}`); setSuggestions(null); }}><Translate>OPEN NEW DOSSIER ↗</Translate></button></div>
        </section>
      </div>}
    </main>
  );
}
function ProjectDossier({ token }) {
  const { t } = useLanguage();
  const { projectId } = useParams();
  const projects = useData("/projects", token);
  const ideas = useData("/ideas", token);
  const feedback = useData("/feedback", token);
  const [showFeedback, setShowFeedback] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ idea: "", comment: "", category: "Other" });
  const project = projects.items.find(item => item._id === projectId);
  const projectIdeas = ideas.items.filter(idea => (idea.project?._id || idea.project) === projectId);
  const revisedIds = new Set(projectIdeas.map(idea => String(idea.previousRevision || "")).filter(Boolean));
  const latestIdeas = projectIdeas.filter(idea => !revisedIds.has(String(idea._id)));
  const ideaIds = new Set(projectIdeas.map(idea => idea._id));
  const projectFeedback = feedback.items.filter(item => ideaIds.has(item.idea?._id || item.idea));
  async function toggleCompleted() {
    setUpdatingStatus(true);
    setMessage("");
    try {
      const nextStatus = isCompleted(project) ? "In progress" : "Completed";
      await api(`/projects/${projectId}`, token, { method: "PUT", body: JSON.stringify({ status: nextStatus }) });
      await projects.reload();
      setMessage(nextStatus === "Completed" ? t("Project moved to The Archive.") : t("Project reopened."));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  }
  async function saveFeedback(event) {
    event.preventDefault();
    try {
      await api("/feedback", token, { method: "POST", body: JSON.stringify(form) });
      setForm({ idea: "", comment: "", category: "Other" });
      setShowFeedback(false);
      setMessage(t("Breakpoint saved."));
      await feedback.reload();
    } catch (error) { setMessage(error.message); }
  }
  if (projects.loading) return <main className="workspace-page"><p className="state-message"><Translate>Loading dossier...</Translate></p></main>;
  if (!project) return <main className="workspace-page"><Link to="/app/projects"><Translate>← BACK TO PROJECTS</Translate></Link><Empty title={t("Project not found.")} description={projects.error || t("This dossier is unavailable.")} /></main>;
  return (
    <main className="workspace-page dossier-page">
      <Link className="dossier-back" to={isCompleted(project) ? "/app/archive" : "/app/projects"}>← {t("BACK TO")} {t(isCompleted(project) ? "THE ARCHIVE" : "PROJECTS")}</Link>
      <header className="dossier-header"><span className="small-label"><Translate>OOPS! / PROJECT DOSSIER</Translate></span><h1>{project.title}</h1><p>{project.client || project.category}</p><span className="dossier-status">{t(project.status || "In progress")}</span></header>
      <div className="dossier-status-actions"><button className="workspace-action" type="button" onClick={toggleCompleted} disabled={updatingStatus}>{t(updatingStatus ? "SAVING..." : isCompleted(project) ? "REOPEN PROJECT ↗" : "MARK AS COMPLETED ↗")}</button></div>
      {project.description && <section className="dossier-intro"><span className="small-label"><Translate>THE BRIEF</Translate></span><p>{project.description}</p></section>}
      <div className="dossier-numbers"><div><strong>{latestIdeas.length.toString().padStart(2, "0")}</strong><span><Translate>IDEAS</Translate></span></div><div><strong>{projectFeedback.length.toString().padStart(2, "0")}</strong><span><Translate>BREAKPOINTS</Translate></span></div><div><strong>{t(isCompleted(project) ? "DONE" : "LIVE")}</strong><span><Translate>STATUS</Translate></span></div></div>
      <div className="content-heading"><div><span className="small-label"><Translate>THE CREATIVE PROCESS / 01</Translate></span><h2><Translate>Ideas</Translate></h2></div><Link to="/app/ideas"><Translate>IDEA LIBRARY ↗</Translate></Link></div>
      {ideas.error && <p className="state-message">{ideas.error}</p>}
      {!ideas.loading && projectIdeas.length === 0 && <Empty title={t("No ideas yet.")} description={t("Add an idea from the Idea Library and select this project.")} />}
      <div className="dossier-ideas dossier-ideas-index">{latestIdeas.map(idea => <DossierIdea key={idea._id} idea={idea} token={token} readOnly={isCompleted(project)} onRevisionSaved={ideas.reload} />)}</div>
      <div className="content-heading dossier-breakpoint-heading"><div><span className="small-label"><Translate>THE CREATIVE PROCESS / 02</Translate></span><h2><Translate>Breakpoint</Translate></h2></div>{!isCompleted(project) && <button className="workspace-action" onClick={() => setShowFeedback(!showFeedback)}><Translate>+ ADD BREAKPOINT</Translate></button>}</div>
      {message && <p className="state-message">{message}</p>}
      {feedback.error && <p className="state-message">{t("Feedback unavailable:")} {feedback.error}</p>}
      {showFeedback && <form className="create-form" onSubmit={saveFeedback}><h2><Translate>What got in the way?</Translate></h2><select value={form.idea} onChange={event => setForm({ ...form, idea: event.target.value })} required><option value=""><Translate>Choose an idea</Translate></option>{projectIdeas.map(idea => <option key={idea._id} value={idea._id}>{idea.title}</option>)}</select><select value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{["Budget", "Style", "Timing", "Client request", "Other"].map(category => <option key={category} value={category}>{t(category)}</option>)}</select><textarea placeholder={t("Feedback or revision notes")} value={form.comment} onChange={event => setForm({ ...form, comment: event.target.value })} required /><button className="solid-button" disabled={!projectIdeas.length}><Translate>SAVE BREAKPOINT ↗</Translate></button></form>}
      {!feedback.loading && !feedback.error && <BreakpointAnalysis items={projectFeedback} />}
      <div className="dossier-ideas">{projectFeedback.map(item => <article className="dossier-idea" key={item._id}><span className="small-label">{t(item.category)}</span><h3>{item.idea?.title || projectIdeas.find(idea => idea._id === item.idea)?.title || t("Idea feedback")}</h3><p>{item.comment}</p></article>)}</div>
    </main>
  );
}
function DossierIdea({ idea, token, readOnly, onRevisionSaved }) {
  const { t, language } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ title: idea.title, description: idea.description });
  useEffect(() => {
    setDraft({ title: idea.title, description: idea.description });
    setShowForm(false);
    setShowHistory(false);
    setHistory([]);
    setError("");
  }, [idea._id, idea.title, idea.description]);
  async function loadHistory() {
    setLoadingHistory(true);
    setError("");
    try {
      const versions = await api(`/ideas/${idea._id}/revisions`, token);
      setHistory(versions);
      setShowHistory(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingHistory(false);
    }
  }
  async function saveRevision(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const revision = await api(`/ideas/${idea._id}/revisions`, token, {
        method: "POST",
        body: JSON.stringify({ title: draft.title, description: draft.description })
      });
      setShowForm(false);
      await onRevisionSaved();
      const versions = await api(`/ideas/${revision._id}/revisions`, token);
      setHistory(versions);
      setShowHistory(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <article className="dossier-idea">
      <span className="small-label">{t(idea.status || "Proposed")}{idea.originalIdea ? ` / ${t("SECOND LIFE")}` : ""} / {t("VERSION")} {String(idea.revisionNumber || 1).padStart(2, "0")}</span>
      <h3>{idea.title}</h3>
      <p>{idea.description}</p>
      <div className="idea-form-actions" style={{ marginTop: 18, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <button type="button" className="idea-text-button" onClick={() => showHistory ? setShowHistory(false) : loadHistory()} disabled={loadingHistory}>{t(loadingHistory ? "LOADING..." : showHistory ? "CLOSE HISTORY ↑" : "VERSION HISTORY ↗")}</button>
        {!readOnly && <button type="button" className="idea-text-button" onClick={() => { setShowForm(!showForm); setError(""); }}>{t(showForm ? "CANCEL" : "+ CREATE REVISION")}</button>}
      </div>
      {error && <p className="state-message" role="alert">{error}</p>}
      {showForm && <form className="create-form" onSubmit={saveRevision} style={{ marginTop: 18 }}>
        <span className="small-label">{t("THE NEXT CHAPTER")} / {t("VERSION")} {String((idea.revisionNumber || 1) + 1).padStart(2, "0")}</span>
        <h3><Translate>Give it another look.</Translate></h3>
        <input aria-label={t("Revision title")} placeholder={t("Revision title")} value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} required />
        <textarea aria-label={t("Revision description")} placeholder={t("What changes in this version?")} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} required />
        <button type="submit" className="solid-button" disabled={saving}>{t(saving ? "SAVING..." : "SAVE REVISION ↗")}</button>
      </form>}
      {showHistory && <section style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid currentColor" }} aria-label={t("Version history")}>
        <span className="small-label">{t("THE STORY SO FAR")} / {history.length} {t("VERSIONS")}</span>
        {history.map(version => <div key={version._id} style={{ paddingTop: 18 }}>
          <span className="small-label">{t("VERSION")} {String(version.revisionNumber || 1).padStart(2, "0")}{version._id === idea._id ? ` / ${t("LATEST")}` : ""} · {new Date(version.createdAt).toLocaleDateString(language === "it" ? "it-IT" : "en-GB")}</span>
          <h3>{version.title}</h3>
          <p>{version.description}</p>
        </div>)}
      </section>}
    </article>
  );
}
function Ideas({ token }) {
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
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [folderFilter, setFolderFilter] = useState("");
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
    return inCollection(idea, collection) && term.includes(search.toLowerCase()) &&
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
      folders: (idea.folders || []).map(folder => folder._id)
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
    if (!window.confirm(`${t("Delete idea")}: "${idea.title}"? ${t("This action cannot be undone.")}`)) return;
    try {
      await api(`/ideas/${idea._id}`, token, { method: "DELETE" });
      setSelected(null);
      if (editingId === idea._id) cancelEdit();
      setMessage(t("Idea deleted."));
      await data.reload();
    } catch (error) {
      setMessage(error.message);
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
      if (folderFilter === folder._id) setFolderFilter("");
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
        {!data.loading && !data.error && filtered.length === 0 && <Empty title={t("Nothing filed here. Yet.")} description={t("Try another collection or change the filters.")} />}
        <div className="library-index-list">
          {filtered.map((idea, index) => <button key={idea._id} className="library-index-row" type="button" onClick={() => openIdea(idea)}>
            <span className="library-row-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="library-row-main"><strong>{idea.title}</strong><small>{idea.project?.title || t("Project idea")}</small></span>
            <span className="library-row-status">{t(idea.status || "Proposed")}{idea.revisionNumber > 1 ? ` · V${String(idea.revisionNumber).padStart(2, "0")}` : ""}</span>
            <span className="library-row-arrow">↗</span>
          </button>)}
        </div>
      </section>
      {selected && (
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
                <div className="idea-modal-actions">
                  {selected.project?._id && <Link className="idea-text-button" to={`/app/projects/${selected.project._id}`} onClick={() => setSelected(null)}><Translate>OPEN PROJECT ↗</Translate></Link>}
                  <button type="button" className="idea-text-button" disabled={historyLoading} onClick={() => { if (historyOpen) { setHistoryOpen(false); setExpandedVersion(null); } else { setHistoryOpen(true); loadHistory(selected); } }}>{t(historyLoading ? "LOADING..." : historyOpen ? "HIDE HISTORY ↑" : "VERSION HISTORY ↗")}</button>
                  {(selected.revisionNumber || 1) === 1 && !previousIds.has(String(selected._id)) && <button className="idea-text-button" onClick={() => startEdit(selected)}><Translate>EDIT ↗</Translate></button>}
                  {(selected.revisionNumber || 1) === 1 && !previousIds.has(String(selected._id)) && <button className="idea-text-button danger" onClick={() => deleteIdea(selected)}><Translate>DELETE</Translate></button>}
                </div>
              </div>
              <aside className="editorial-dossier-aside">
                <div className="editorial-aside-top"><span className="small-label"><Translate>THE REVISION ARCHIVE</Translate></span><span className="small-label">{historyOpen ? `${history.length} ${t("EDITIONS")}` : t("THE STORY SO FAR")}</span></div>
                {!historyOpen && <div className="editorial-history-intro"><h3><Translate>Every idea has a backstory.</Translate></h3><p><Translate>Explore earlier editions, notes and the changes that brought this idea here.</Translate></p><button type="button" className="idea-text-button" onClick={() => { setHistoryOpen(true); loadHistory(selected); }}><Translate>EXPLORE THE EDITIONS ↗</Translate></button></div>}
                {historyError && <p className="state-message" role="alert">{historyError}</p>}
                {historyOpen && historyLoading && <p className="state-message"><Translate>Loading editions...</Translate></p>}
                {historyOpen && !historyLoading && history.length === 0 && !historyError && <p className="state-message"><Translate>No revisions available.</Translate></p>}
                {historyOpen && history.length > 0 && <div className="editorial-editions">
                  {[...history].sort((a, b) => (b.revisionNumber || 1) - (a.revisionNumber || 1)).map(version => {
                    const isExpanded = expandedVersion === version._id;
                    const isCurrent = version._id === selected._id || version.revisionNumber === selected.revisionNumber;
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
        </div>
      )}
    </main>
  );
}
function Breakpoint({ token }) {
  const { t } = useLanguage();
  const ideas = useData("/ideas", token);
  const feedback = useData("/feedback", token);
  const [form, setForm] = useState({ idea: "", comment: "", category: "Other" });
  const [message, setMessage] = useState("");
  async function createFeedback(event) {
    event.preventDefault();
    try {
      await api("/feedback", token, { method: "POST", body: JSON.stringify(form) });
      setForm({ idea: "", comment: "", category: "Other" });
      setMessage(t("Breakpoint saved."));
      feedback.reload();
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("WHEN THINGS GET STUCK / 004")} title={t("Breakpoint")} description={t("Name the obstacle. Make room for another way.")} />
      <form className="create-form" onSubmit={createFeedback}>
        <h2><Translate>What got in the way?</Translate></h2>
        <select value={form.idea} onChange={event => setForm({ ...form, idea: event.target.value })} required>
          <option value=""><Translate>Choose an idea</Translate></option>
          {ideas.items.map(idea => <option key={idea._id} value={idea._id}>{idea.title}</option>)}
        </select>
        <select value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>
          {["Budget", "Style", "Timing", "Client request", "Other"].map(category => <option key={category} value={category}>{t(category)}</option>)}
        </select>
        <textarea placeholder={t("Describe the block and what you tried...")} value={form.comment} onChange={event => setForm({ ...form, comment: event.target.value })} required />
        <button className="solid-button" disabled={!ideas.items.length}><Translate>SAVE BREAKPOINT</Translate> </button>
      </form>
      {message && <p className="state-message">{message}</p>}
      <div className="idea-list">
        {feedback.items.map(item => (
          <article className="idea-card" key={item._id}>
            <span>{t(item.category)}</span><p>{item.comment}</p><small>{item.idea?.title || t("IDEA")}</small>
          </article>
        ))}
      </div>
    </main>
  );
}
function Rediscover({ token }) {
  const { t } = useLanguage();
  const projects = useData("/projects", token);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [items, setItems] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const statuses = ["Proposed", "Approved", "In revision", "Rejected"];
  async function searchIdeas(event) {
    if (event) event.preventDefault();
    setLoading(true);
    setError("");
    setSelected(null);
    const params = new URLSearchParams();
    if (projectFilter) params.set("project", projectFilter);
    try {
      const data = await api(`/rediscover?${params.toString()}`, token);
      const all = Array.isArray(data) ? data : [];
      const byId = new Map(all.map(idea => [String(idea._id), idea]));
      const previousIds = new Set(all.map(idea => String(idea.previousRevision || "")).filter(Boolean));
      const latest = all.filter(idea => !previousIds.has(String(idea._id)));
      const keyword = search.trim().toLowerCase();
      const visible = latest.filter(idea => {
        if (statusFilter && idea.status !== statusFilter) return false;
        if (!keyword) return true;
        let version = idea;
        const visited = new Set();
        while (version && !visited.has(String(version._id))) {
          visited.add(String(version._id));
          const text = [version.title, version.description, ...(version.tags || []), version.project?.title, version.project?.client].join(" ").toLowerCase();
          if (text.includes(keyword)) return true;
          version = byId.get(String(version.previousRevision || ""));
        }
        return false;
      });
      setItems(visible);
      setResultCount(visible.length);
    } catch (error) {
      setError(error.message);
      setItems([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  }
  function resetSearch() {
    setSearch("");
    setProjectFilter("");
    setStatusFilter("");
    setItems([]);
    setResultCount(0);
    setSelected(null);
    setSearched(false);
    setError("");
  }
  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("NOTHING GOOD IS REALLY LOST / 004")} title={t("Rediscover")} description={t("Find the ideas worth another look. Nothing good is really lost.")} />
      <form className="create-form" onSubmit={searchIdeas}>
        <span className="small-label">{t("THE CREATIVE SEARCH")}</span>
        <h2>{t("What are we looking for?")}</h2>
        <input placeholder={t("A word, an idea, a client...")} value={search} onChange={event => setSearch(event.target.value)} aria-label={t("Search by keyword")} />
        <div className="idea-filters">
          <select value={projectFilter} onChange={event => setProjectFilter(event.target.value)} aria-label={t("Filter by project")}>
            <option value=""><Translate>All projects</Translate></option>
            {projects.items.map(project => <option key={project._id} value={project._id}>{project.title}</option>)}
          </select>
          <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label={t("Filter by status")}>
            <option value=""><Translate>All statuses</Translate></option>
            {statuses.map(status => <option key={status} value={status}>{t(status)}</option>)}
          </select>
        </div>
        <div className="idea-form-actions">
          <button className="solid-button" type="submit" disabled={loading}>{t(loading ? "SEARCHING..." : "FIND IDEAS ↗")}</button>
          <button className="idea-text-button" type="button" onClick={resetSearch}><Translate>CLEAR FILTERS</Translate></button>
        </div>
      </form>
      {projects.error && <p className="state-message">{t("Projects unavailable:")} {projects.error}</p>}
      {error && <p className="state-message" role="alert">{error}</p>}
      {searched && !loading && !error && (
        <div className="content-heading idea-heading">
          <div><span className="small-label">{t("BACK FROM THE ARCHIVE")}</span><h2>{t(items.length ? "Look what we found." : "No matches this time.")}</h2></div>
          <span className="small-label">{resultCount} {t(resultCount === 1 ? "IDEA" : "IDEAS")}</span>
        </div>
      )}
      {searched && !loading && !error && items.length === 0 && <Empty title={t("Nothing turned up.")} description={t("Try another keyword or clear the filters. Your ideas are still here.")} />}
      <div className="idea-list">
        {items.map(idea => (
          <button className="idea-card idea-card-button" key={idea._id} type="button" style={{ padding: "22px 24px" }} onClick={() => setSelected(idea)}>
            <span>{t(idea.status || "Proposed")}{idea.revisionNumber > 1 ? ` / ${t("VERSION")} ${String(idea.revisionNumber).padStart(2, "0")}` : ""}</span>
            <h3>{idea.title}</h3>
            <p>{idea.description}</p>
            <small>{idea.project?.title || t("Project idea")}</small>
            {(idea.tags || []).length > 0 && <div className="idea-card-folders">{idea.tags.map((tag, index) => <span key={`${tag}-${index}`}>{tag}</span>)}</div>}
            <span className="idea-card-open">{t("OPEN IDEA ↗")}</span>
          </button>
        ))}
      </div>
      {selected && (
        <div className="idea-modal-backdrop" onClick={() => setSelected(null)}>
          <section className="idea-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={event => event.stopPropagation()}>
            <div className="idea-modal-top"><span className="small-label"><Translate>REDISCOVER / OOPS!</Translate></span><button className="idea-text-button" type="button" onClick={() => setSelected(null)}>{t("CLOSE ×")}</button></div>
            <span className="idea-modal-status">{t(selected.status || "Proposed")}</span>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <div className="idea-modal-meta"><strong>{t("PROJECT")}</strong><span>{selected.project?.title || t("Project idea")}</span></div>
            <div className="idea-modal-meta"><strong>{t("TAGS")}</strong><span>{selected.tags?.join(" · ") || t("No tags")}</span></div>
            {selected.project?._id && <div className="idea-modal-actions"><Link className="solid-button" to={`/app/projects/${selected.project._id}`}><Translate>OPEN DOSSIER ↗</Translate></Link></div>}
          </section>
        </div>
      )}
    </main>
  );
}
function Archive({ token }) {
  const { t } = useLanguage();
  const data = useData("/projects", token);
  const archived = data.items.filter(isCompleted);
  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("THE CREATIVE LEGACY / 005")} title={t("The Archive")} description={t("Some things are too good to forget. A showcase of completed projects.")} />
      {data.loading && <p className="state-message"><Translate>Loading archive...</Translate></p>}
      {data.error && <p className="state-message">{data.error}</p>}
      {!data.loading && archived.length === 0 && <Empty title={t("Nothing archived yet.")} description={t("Completed projects will find their place here.")} />}
      <ProjectGrid projects={archived} />
    </main>
  );
}
function Appearance({ theme, setTheme }) {
  const { t } = useLanguage();
  return (
    <main className="workspace-page">
      <PageHeading eyebrow={t("MAKE YOUR SPACE YOURS / SETTINGS")} title={t("Appearance")} description={t("Choose the colours that make this studio feel like yours.")} />
      <div className="theme-grid">
        {Object.entries(themes).map(([key, item]) => (
          <button className={`theme-card ${theme === key ? "selected" : ""}`} key={key} onClick={() => setTheme(key)}>
            <div className="theme-swatches">
              <i style={{ background: item.accent }} /><i style={{ background: item.strong }} /><i style={{ background: item.soft }} />
            </div>
            <strong>{item.name}</strong>
            <span>{t(theme === key ? "SELECTED" : "PREVIEW THEME")}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
function Settings({ user, token, logout, onProfileSaved }) {
  const { t, language, setLanguage } = useLanguage();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  async function saveProfile(event) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");
    try {
      const result = await api("/auth/profile", token, { method: "PUT", body: JSON.stringify({ name: name.trim(), email: email.trim() }) });
      setProfileMessage(t("Profile updated."));
      onProfileSaved(result.user || result);
    } catch (error) {
      setProfileMessage(error.message);
    } finally {
      setSavingProfile(false);
    }
  }
  async function savePassword(event) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage(t("The new passwords do not match."));
      return;
    }
    setSavingPassword(true);
    setPasswordMessage("");
    try {
      await api("/auth/password", token, { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage(t("Password updated."));
    } catch (error) {
      setPasswordMessage(error.message);
    } finally {
      setSavingPassword(false);
    }
  }
  return (
    <main className="workspace-page settings-page">
      <PageHeading eyebrow={t("YOUR ACCOUNT / SETTINGS")} title={t("Settings")} description={t("The details behind your creative universe.")} />
      <div className="settings-layout">
        <section className="settings-section">
          <span className="small-label"><Translate>01 / PERSONAL INFORMATION</Translate></span>
          <h2><Translate>Make it yours.</Translate></h2>
          <p><Translate>Keep your account details up to date.</Translate></p>
          <form className="settings-form" onSubmit={saveProfile}>
            <label htmlFor="profile-name"><Translate>YOUR NAME</Translate></label>
            <input id="profile-name" value={name} onChange={event => setName(event.target.value)} required />
            <label htmlFor="profile-email"><Translate>EMAIL ADDRESS</Translate></label>
            <input id="profile-email" type="email" value={email} onChange={event => setEmail(event.target.value)} required />
            <button className="solid-button" type="submit" disabled={savingProfile}>{t(savingProfile ? "SAVING..." : "SAVE CHANGES ↗")}</button>
            {profileMessage && <p className="settings-message" role="status">{t(profileMessage)}</p>}
          </form>
        </section>
        <section className="settings-section">
          <span className="small-label"><Translate>02 / PASSWORD & SECURITY</Translate></span>
          <h2><Translate>For your eyes only.</Translate></h2>
          <p><Translate>Choose a new password to protect your ideas.</Translate></p>
          <form className="settings-form" onSubmit={savePassword}>
            <label htmlFor="current-password"><Translate>CURRENT PASSWORD</Translate></label>
            <input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required />
            <label htmlFor="new-password"><Translate>NEW PASSWORD</Translate></label>
            <input id="new-password" type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={event => setNewPassword(event.target.value)} required />
            <label htmlFor="confirm-password"><Translate>CONFIRM NEW PASSWORD</Translate></label>
            <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required />
            <button className="solid-button" type="submit" disabled={savingPassword}>{t(savingPassword ? "SAVING..." : "UPDATE PASSWORD ↗")}</button>
            {passwordMessage && <p className="settings-message" role="status">{t(passwordMessage)}</p>}
          </form>
        </section>
      </div>
      <section className="settings-section language-settings">
        <span className="small-label">03 / {t("LANGUAGE & REGION")}</span>
        <h2>{t("App language")}</h2>
        <p>{t("Choose the language of your workspace. Your ideas and projects stay in their original language.")}</p>
        <div className="language-options" role="group" aria-label={t("App language")}>
          <button type="button" className={language === "en" ? "language-option selected" : "language-option"} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>English <span>EN</span></button>
          <button type="button" className={language === "it" ? "language-option selected" : "language-option"} onClick={() => setLanguage("it")} aria-pressed={language === "it"}>Italiano <span>IT</span></button>
        </div>
      </section>
      <div className="settings-footer-actions"><Link to="/app/appearance"><Translate>EXPLORE APPEARANCE ↗</Translate></Link><button type="button" onClick={logout}><Translate>LOG OUT ↗</Translate></button></div>
    </main>
  );
}
function Empty({ title, description }) {
  const { t } = useLanguage();
  return (
    <div className="empty-state">
      <span>OOPS! / {t("A FRESH START")}</span><h3>{title}</h3><p>{description}</p>
    </div>
  );
}
export default App;
