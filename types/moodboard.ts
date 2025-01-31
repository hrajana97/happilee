export type MoodboardCategory = {
  id: string
  name: string
  coverImage: string
}

export type FlowerImage = {
  id: string
  url: string
  style: string
  description: string
  colors: string[]
  liked?: boolean
}

export type ColorPalette = {
  primary: string
  secondary: string
  accent: string[]
}

