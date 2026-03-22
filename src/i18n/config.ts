export const locales = ['pt-BR', 'en-US', 'es-ES', 'fr-FR', 'it-IT', 'de-DE'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt-BR';
