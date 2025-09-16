export type partyData = {
  id: number
  slug: string
  name: string
  imageLink?: string
  image?: { imageFile: { url: string } }
}

export type stateType<T> = {
  party: T[]
  isLoading: boolean
  error?: Error
}
