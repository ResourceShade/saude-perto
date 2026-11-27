export type OrigemDado =
  | 'openstreetmap'
  | 'demonstrativo'
  | 'editorial'
  | 'cnes'

export type ComOrigem<T> = T & {
  origem: OrigemDado
  obtidoEm: string
}