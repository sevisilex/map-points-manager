import { TranslationColorType, TranslationIconType } from '../i18n'

export interface Location {
  id?: number
  name: string
  url?: string
  latitude: number
  longitude: number
  description: string
  iconType?: keyof TranslationIconType
  color?: keyof TranslationColorType
}
