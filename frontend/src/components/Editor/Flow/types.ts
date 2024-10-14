import { Node, Edge } from 'reactflow'

export interface LayoutedGraph {
  nodes: Node[]
  edges: Edge[]
}

export interface LayoutDirection {
  direction: 'DOWN' | 'RIGHT'
  useInitialNodes?: boolean
}
