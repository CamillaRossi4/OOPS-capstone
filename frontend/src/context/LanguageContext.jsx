import { useContext } from "react";
import { LanguageContext } from "./LanguageProviderContext";
import { translations } from "./translations";

export function Translate({ children }) {
  const { language } = useContext(LanguageContext);
  return language === "it" ? (translations[children] || children) : children;
}

