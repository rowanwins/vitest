export type SuiteMocks = Record<string, Record<string, string | null | (() => unknown)>>

export interface PendingSuiteMock {
  id: string
  importer: string
  type: 'mock' | 'unmock'
  factory?: () => unknown
}
