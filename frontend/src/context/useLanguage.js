import { useContext } from "react";
import { LanguageContext } from "./LanguageProviderContext";
import { translations } from "./translations";

export function useLanguage() {
  const { language, setLanguage } = useContext(LanguageContext);
  return {
    language,
    setLanguage,
    t: (value) => (language === "it" ? translations[value] || value : value),
  };
}
