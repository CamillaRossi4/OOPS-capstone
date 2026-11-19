export function isCompleted(project) {
  return ["Completed", "Archived"].includes(project.status);
}
const commonWords = new Set([
  "this",
  "that",
  "with",
  "from",
  "your",
  "their",
  "about",
  "after",
  "before",
  "into",
  "have",
  "will",
  "were",
  "what",
  "when",
  "where",
  "then",
  "than",
  "been",
  "only",
  "more",
  "some",
  "project",
  "creative",
  "campaign",
  "idea",
  "ideas",
  "client",
  "work",
  "the",
  "and",
  "for",
  "are",
  "you",
  "our",
  "its",
  "una",
  "uno",
  "per",
  "con",
  "che",
  "del",
  "della",
  "delle",
  "gli",
  "nel",
  "alla",
  "dalla",
]);
function keywords(value) {
  return [
    ...new Set(
      String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .match(/[a-z0-9]{3,}/g)
        ?.filter((word) => !commonWords.has(word)) || [],
    ),
  ];
}
export function suggestIdeas(project, ideas) {
  const terms = keywords(
    `${project.title} ${project.client} ${project.category} ${project.description}`,
  );
  if (!terms.length) return [];
  return ideas
    .filter((idea) => {
      const projectId = idea.project?._id || idea.project;
      return String(projectId) !== String(project._id);
    })
    .map((idea) => {
      const ideaTerms = keywords(
        `${idea.title} ${idea.description} ${(idea.tags || []).join(" ")}`,
      );
      const shared = terms.filter((word) => ideaTerms.includes(word));
      return { idea, shared };
    })
    .filter((item) => item.shared.length >= 2)
    .sort((a, b) => b.shared.length - a.shared.length)
    .slice(0, 3);
}
