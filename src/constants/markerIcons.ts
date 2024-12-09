import L from 'leaflet'
import { TranslationColorType, TranslationIconType } from '../i18n'

export const MARKER_COLORS: Record<keyof TranslationColorType, string> = {
  blue: '#2196F3', // default blue
  red: '#FF0000', // red
  orange: '#FFA500', // orange
  green: '#008000', // green
  purple: '#800080', // purple
  pink: '#ff60b0', // pink
  white: '#FFFFFF', // white
  black: '#000000', // black
}

export type MarkerColorKey = keyof typeof MARKER_COLORS

export const COLOR_LABELS: Record<keyof TranslationColorType, string> = {
  blue: 'Blue',
  red: 'Red',
  orange: 'Orange',
  green: 'Green',
  purple: 'Purple',
  pink: 'Pink',
  white: 'White',
  black: 'Black',
}

const createMdiIcon = (iconName: string, color: string = '#FFFFFF', bgColor: string = '#2196F3') => {
  return L.divIcon({
    html: `<div style="background-color: ${bgColor};"><span class="mdi mdi-${iconName} marker-icon" style="color: ${color};"></span></div>`,
    className: `custom-div-icon`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

export const MARKER_ICONS: Record<keyof TranslationIconType, string> = {
  default: 'map-marker',
  home: 'home',
  shop: 'shopping',
  restaurant: 'silverware-fork-knife',
  school: 'school',
  hospital: 'hospital',
  park: 'nature',
  gym: 'dumbbell',
  cafe: 'coffee',
  office: 'office-building',
  parking: 'parking',
}

export const ICON_LABELS: Record<keyof TranslationIconType, string> = {
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
}

export const createMarkerIcon = (iconType: keyof TranslationIconType, markerColor: string = MARKER_COLORS.blue) => {
  const baseIcon: string = MARKER_ICONS[iconType] || MARKER_ICONS.default
  return createMdiIcon(baseIcon, markerColor === MARKER_COLORS.white ? '#000000' : '#FFFFFF', markerColor)
}

export const getIconName = (type: keyof TranslationIconType = 'default'): string => {
  return MARKER_ICONS[type] || 'map-marker'
}
