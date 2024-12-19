import { Language } from '../i18n'

export const setDarkModeStorage = (isDark: boolean): void => localStorage.setItem('theme', isDark ? 'dark' : 'light')

export const isDarkModeStorage = (): boolean => localStorage.getItem('theme') === 'dark'

export const setLanguageStorage = (lang: Language): void => localStorage.setItem('preferred-language', lang)

export const getLanguageStorage = (): Language | null => localStorage.getItem('preferred-language') as Language | null

export const setSidebarOpenStorage = (isOpen: boolean): void => localStorage.setItem('sidebar-state', isOpen ? 'open' : 'closed')

export const isSidebarOpenStorage = (): boolean => localStorage.getItem('sidebar-state') === 'open'
