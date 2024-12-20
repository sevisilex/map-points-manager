import { Language } from '../i18n'

const setStorageItem = <T>(key: string, value: T): void => localStorage.setItem(key, JSON.stringify(value))
const getStorageItem = <T>(key: string): T | null => {
  const item = localStorage.getItem(key)
  // return item ? (JSON.parse(item) as T) : null
  return item ? item as T : null
}

export const setDarkModeStorage = (isDark: boolean): void => setStorageItem('theme', isDark ? 'dark' : 'light')
export const isDarkModeStorage = (): boolean => getStorageItem<string>('theme') === 'dark'

export const setLanguageStorage = (lang: Language): void => setStorageItem('preferred-language', lang)
export const getLanguageStorage = (): Language | null => getStorageItem<Language>('preferred-language')

export const setSidebarOpenStorage = (isOpen: boolean): void => setStorageItem('sidebar-state', isOpen ? 'open' : 'closed')
export const isSidebarOpenStorage = (): boolean => getStorageItem<string>('sidebar-state') === 'open'
