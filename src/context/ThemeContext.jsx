import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { DEFAULT_THEME, normalizeTheme } from '../theme'

const THEME_STORAGE_KEY = 'theme'

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setThemePreference: () => {},
})

function applyTheme(theme) {
  const nextTheme = normalizeTheme(theme)
  document.documentElement.setAttribute('data-theme', nextTheme)
  document.body.setAttribute('data-theme', nextTheme)
  document.body.style.backgroundColor = `var(--theme-bg)`
}

export function ThemeProvider({ children }) {
  const { user } = useAuth()
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    return normalizeTheme(savedTheme)
  })

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (!user) return
    const nextTheme = normalizeTheme(user.theme)
    setTheme(currentTheme => (currentTheme === nextTheme ? currentTheme : nextTheme))
  }, [user])

  const setThemePreference = (nextTheme) => {
    setTheme(normalizeTheme(nextTheme))
  }

  return (
    <ThemeContext.Provider value={{ theme, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
