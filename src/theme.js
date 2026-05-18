export const DEFAULT_THEME = 'dark'
export const ALLOWED_THEMES = ['dark', 'dim', 'light']

export function normalizeTheme(theme) {
  return ALLOWED_THEMES.includes(theme) ? theme : DEFAULT_THEME
}
