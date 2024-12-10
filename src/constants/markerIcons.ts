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

export const MARKER_ICONS: Record<keyof TranslationIconType, string> = {
  default: 'place',
  home: 'home',
  shop: 'local_mall',
  restaurant: 'restaurant',
  school: 'school',
  hospital: 'medical_services',
  park: 'nature',
  gym: 'fitness_center',
  cafe: 'coffee',
  office: 'business',
  parking: 'local_parking',
}

export const getIconName = (type: keyof TranslationIconType = 'default'): string => {
  return MARKER_ICONS[type] || 'map-marker'
}

export const createMarkerIcon = (iconType: keyof TranslationIconType, markerColor: string = MARKER_COLORS.blue) => {
  return createMaterialIcon(getIconName(iconType), markerColor === MARKER_COLORS.white ? '#000000' : '#FFFFFF', markerColor)
}

const createMaterialIcon = (iconName: string, color: string = '#FFFFFF', bgColor: string = '#2196F3') => {
  return L.divIcon({
    html: `<div style="background-color: ${bgColor};"><span class="material-icons marker-icon" style="color: ${color};">${iconName}</span></div>`,
    className: `custom-div-icon`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}
