export {}

declare global {
  interface Window {
    editLocation: (id: number) => Promise<void>
    deleteLocation: (id: number) => Promise<void>
  }
}
