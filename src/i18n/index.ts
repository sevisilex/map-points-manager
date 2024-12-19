import { ref, computed } from 'vue'
import { setLanguageStorage, getLanguageStorage } from '../services/storage'

export type Language = 'de' | 'en' | 'pl'

const translation = {
  toggleSidebar: 'Toggle sidebar',
  locationsList: 'Locations',
  exportCsv: 'Export as CSV',
  loading: 'Loading...',
  addPoint: 'Add point',
  editPoint: 'Edit point',
  addNewPoint: 'Add new point',
  name: 'Name',
  url: 'URL',
  description: 'Description',
  icon: 'Icon',
  color: 'Color',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  confirm: 'Confirm deletion',
  confirmDelete: 'Are you sure you want to delete this point?',
  dragToChange: 'Drag to change position',
  emptyDatabaseTitle: 'Oh! All Empty Here!',
  emptyDatabaseMessage: "Looks like you don't have any saved locations yet! Want to import 35 cool demo spots?",
  importDemo: 'Yes, show me!',
  skipDemo: "No thanks, I'll add my own",
  about: 'About',
  aboutProject: 'About This Project',
  coffeeMessage: "If you're happy with this project, consider buying me a coffee! ☕",
  coffeeButton: 'Buy me a coffee',
  colors: {
    blue: 'Blue',
    red: 'Red',
    orange: 'Orange',
    green: 'Green',
    purple: 'Purple',
    pink: 'Pink',
    white: 'White',
    black: 'Black',
  },
  icons: {
    default: 'Default',
    home: 'Home',
    shop: 'Shop',
    restaurant: 'Restaurant',
    museum: 'Museum',
    school: 'School',
    hospital: 'Hospital',
    park: 'Park',
    gym: 'Gym',
    cafe: 'Cafe',
    office: 'Office',
    parking: 'Parking',
  },
}

export type TranslationType = typeof translation
export type TranslationIconType = typeof translation.icons
export type TranslationColorType = typeof translation.colors

const translations: Record<Language, TranslationType> = {
  en: translation,
  de: {
    toggleSidebar: 'Seitenleiste umschalten',
    locationsList: 'Standorte',
    exportCsv: 'Als CSV exportieren',
    loading: 'Laden...',
    addPoint: 'Punkt hinzufügen',
    editPoint: 'Punkt bearbeiten',
    addNewPoint: 'Neuen Punkt hinzufügen',
    name: 'Name',
    url: 'URL',
    description: 'Beschreibung',
    icon: 'Symbol',
    color: 'Farbe',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    confirm: 'Löschen bestätigen',
    confirmDelete: 'Möchten Sie diesen Punkt wirklich löschen?',
    dragToChange: 'Ziehen Sie zum Ändern der Position',
    emptyDatabaseTitle: 'Oh! Ganz leer hier!',
    emptyDatabaseMessage: 'Du hast noch keine gespeicherten Orte! Möchtest du 35 coole Demo-Locations importieren?',
    importDemo: 'Ja, zeig mal!',
    skipDemo: 'Nein danke, ich füge meine eigenen hinzu',
    about: 'Über',
    aboutProject: 'Über dieses Projekt',
    coffeeMessage: 'Wenn dir das Projekt gefällt, spendier mir doch einen Kaffee! ☕',
    coffeeButton: 'Kaffee spendieren',
    colors: {
      blue: 'Blau',
      red: 'Rot',
      orange: 'Orange',
      green: 'Grün',
      purple: 'Lila',
      pink: 'Rosa',
      white: 'Weiß',
      black: 'Schwarz',
    },
    icons: {
      default: 'Standard',
      home: 'Zuhause',
      shop: 'Geschäft',
      restaurant: 'Restaurant',
      museum: 'Museum',
      school: 'Schule',
      hospital: 'Krankenhaus',
      park: 'Park',
      gym: 'Fitnessstudio',
      cafe: 'Café',
      office: 'Büro',
      parking: 'Parkplatz',
    },
  },
  pl: {
    toggleSidebar: 'Przełącz panel boczny',
    locationsList: 'Lokalizacje',
    exportCsv: 'Eksportuj jako CSV',
    loading: 'Ładowanie...',
    addPoint: 'Dodaj punkt',
    editPoint: 'Edytuj punkt',
    addNewPoint: 'Dodaj nowy punkt',
    name: 'Nazwa',
    url: 'URL',
    description: 'Opis',
    icon: 'Ikona',
    color: 'Kolor',
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    edit: 'Edytuj',
    confirm: 'Potwierdź usunięcie',
    confirmDelete: 'Czy na pewno chcesz usunąć ten punkt?',
    dragToChange: 'Przeciągnij, aby zmienić pozycję',
    emptyDatabaseTitle: 'Ojej! Puściutko tutaj!',
    emptyDatabaseMessage: 'Nie masz jeszcze żadnych zapisanych miejsc! Zaimportować 35 fajnych lokalizacji demo?',
    importDemo: 'Jasne, pokaż!',
    skipDemo: 'Nie, dziękuję, dodam własne',
    about: 'O projekcie',
    aboutProject: 'O tym projekcie',
    coffeeMessage: 'Jeśli podoba Ci się ten projekt, postaw mi kawę! ☕',
    coffeeButton: 'Postaw kawkę!',
    colors: {
      blue: 'Niebieski',
      red: 'Czerwony',
      orange: 'Pomarańczowy',
      green: 'Zielony',
      purple: 'Fioletowy',
      pink: 'Różowy',
      white: 'Biały',
      black: 'Czarny',
    },
    icons: {
      default: 'Domyślna',
      home: 'Dom',
      shop: 'Sklep',
      restaurant: 'Restauracja',
      museum: 'Muzeum',
      school: 'Szkoła',
      hospital: 'Szpital',
      park: 'Park',
      gym: 'Siłownia',
      cafe: 'Kawiarnia',
      office: 'Biuro',
      parking: 'Parking',
    },
  },
}

const getBrowserLanguage = (): Language => {
  // Get browser language (returns something like 'pl-PL' or 'de')
  const browserLang = navigator.language.toLowerCase().split('-')[0]
  if (['de', 'pl'].includes(browserLang)) {
    return browserLang as Language
  }
  return 'en'
}

const currentLanguage = ref<Language>(getBrowserLanguage())

export const useI18n = () => {
  const t = computed(() => translations[currentLanguage.value])

  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    setLanguageStorage(lang)
  }

  const getLanguage = () => currentLanguage.value

  // Initialize language from localStorage if available
  const initializeLanguage = () => {
    const savedLang = getLanguageStorage()
    if (savedLang && ['de', 'en', 'pl'].includes(savedLang)) {
      currentLanguage.value = savedLang
    }
  }

  return {
    t,
    setLanguage,
    getLanguage,
    initializeLanguage,
  }
}
