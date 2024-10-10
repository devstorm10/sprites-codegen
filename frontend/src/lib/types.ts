export interface Tab {
  title: string
  active?: boolean
}

export interface ContextNode {
  id: string
  type: 'group' | 'input'
  title?: string
  contexts?: ContextNode[]
}
