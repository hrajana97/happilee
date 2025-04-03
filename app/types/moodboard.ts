export interface ColorPalette {
  primary: string
  secondary: string
  accent: string[]
  dominantColors?: string[]
  mood?: string
}

export interface FlowerImage {
  id: string
  url: string
  style: string
  description: string
  colors: string[]
  tags: string[]
  source: {
    name: string
    url: string
    attribution: string
  }
}

export interface VendorRecommendation {
  name: string
  type: string
  description: string
  website: string
  location: string
}

export interface MoodboardCollection {
  id: string
  name: string
  description: string
  images: FlowerImage[]
  colorPalette: ColorPalette
  tags: string[]
  vendorRecommendations: VendorRecommendation[]
  createdAt: Date
  updatedAt: Date
} 