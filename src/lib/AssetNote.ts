export interface AssetNote {
  arc69: Arc69
  image_url: string
  ipnft: string
  title: string
  url: string
}
export interface Arc69 {
  description: string
  external_url: string
  mime_type: string
  properties: Properties
  standard: string
}
export interface Properties {
  artist: string
  cause: string
  causePercentage: number
  date: string
  file: File
  price: number
}
export interface File {
  name: string
  size: number
  type: string
}
