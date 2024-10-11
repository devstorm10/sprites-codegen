export interface Tab {
  title: string
  active?: boolean
}

export interface ContextNode {
  id: string
  type: 'group' | 'tag' | 'input'
  title?: string
  contexts?: ContextNode[]
}

export interface Tag {
  id: string
  title: string
  color: string
}

export interface TextPrompt {
  id: string
  contextId: string | null
  tagId: string | null
  content: string
}

export interface CreateNode {
  title: string
  name: string
}
