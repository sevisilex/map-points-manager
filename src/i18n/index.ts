import { ref, computed } from 'vue'

type Language = 'de' | 'en' | 'pl'

const translations = {
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
    confirmDelete: 'Möchten Sie diesen Punkt wirklich löschen?',
    dragToChange: 'Ziehen Sie zum Ändern der Position',
    about: 'Über',
    aboutProject: 'Über dieses Projekt',
    buyMeCoffee: 'Kauf mir einen Kaffee',
    supportText: 'Wenn Sie mit diesem Projekt zufrieden sind, unterstützen Sie meine Arbeit!',
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
      school: 'Schule',
      hospital: 'Krankenhaus',
      park: 'Park',
      gym: 'Fitnessstudio',
      cafe: 'Café',
      office: 'Büro',
      parking: 'Parkplatz',
    },
  },
  en: {
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
    confirmDelete: 'Are you sure you want to delete this point?',
    dragToChange: 'Drag to change position',
    about: 'About',
    aboutProject: 'About This Project',
    buyMeCoffee: 'Buy me a coffee',
    supportText: "If you're happy with this project, consider supporting my work!",
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
      school: 'School',
      hospital: 'Hospital',
      park: 'Park',
      gym: 'Gym',
      cafe: 'Cafe',
      office: 'Office',
      parking: 'Parking',
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
    confirmDelete: 'Czy na pewno chcesz usunąć ten punkt?',
    dragToChange: 'Przeciągnij, aby zmienić pozycję',
    about: 'O projekcie',
    aboutProject: 'O tym projekcie',
    buyMeCoffee: 'Kup mi kawę',
    supportText: 'Jeśli jesteś zadowolony z tego projektu, rozważ wsparcie mojej pracy!',
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

// Create i18n store
const currentLanguage = ref<Language>('de') // default language is German

// Type for translation access
export type TranslationType = typeof translations.de

export const useI18n = () => {
  const t = computed(() => translations[currentLanguage.value])

  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    localStorage.setItem('preferred-language', lang)
  }

  const getLanguage = () => currentLanguage.value

  // Initialize language from localStorage if available
  const initializeLanguage = () => {
    const savedLang = localStorage.getItem('preferred-language') as Language
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
