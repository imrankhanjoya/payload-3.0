declare module 'payload' {
  export interface Field {
    name: string
    saveToJWT?: boolean
    fields?: Field[]
  }

  export function fieldAffectsData(field: Field): boolean
  export function fieldHasSubFields(field: Field): boolean
}
