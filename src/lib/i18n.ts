export const LANGUAGES = ["en", "zh"] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";

export function isLanguage(value: string): value is Language {
  return LANGUAGES.includes(value as Language);
}

export function getLanguage(value: string): Language {
  return isLanguage(value) ? value : DEFAULT_LANGUAGE;
}
