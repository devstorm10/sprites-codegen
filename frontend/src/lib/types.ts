import { ReactNode } from 'react'

export interface Tab {
  id: string
  title: string
  active?: boolean
}

export interface ContextNode {
  id: string
  type: 'group' | 'tag' | 'input' | 'flow'
  title?: string
  data?: Record<string, any>
  contexts?: ContextNode[]
  collapsed?: boolean
}

export interface Variable {
  id: string
  name: string
  value: string
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
  icon?: ReactNode
  title: string
  name: string
}
