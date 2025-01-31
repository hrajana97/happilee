export interface Vendor {
  id: string
  name: string
  category: string
  description: string
  image: string
  startingPrice: string
  packages: VendorPackage[]
}

export interface VendorPackage {
  id: string
  vendorName: string
  packageName: string
  price: number
  pricePerPerson?: number
  description: string
  includedServices: string[]
  additionalFees: {
    name: string
    amount: number
  }[]
  terms: string[]
  menuItems?: {
    [key: string]: string[]
  }
  staffing?: {
    [key: string]: number
  }
  equipment?: boolean
  hours?: number
  [key: string]: any
}

