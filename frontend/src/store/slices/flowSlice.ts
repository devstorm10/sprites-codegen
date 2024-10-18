import { FlowNodeData } from '@/lib/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Node, Edge, Viewport } from 'reactflow'

type FlowItem = {
  id: string
  viewport: Viewport
  nodes: Node<FlowNodeData>[]
  edges: Edge<any>[]
}

type FlowState = {
  flows: FlowItem[]
}

const initialState: FlowState = {
  flows: [],
}

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    createFlowView: (state: FlowState, action: PayloadAction<string>) => {
      state.flows.push({
        id: action.payload,
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      })
    },
    addFlowNode: (
      state: FlowState,
      action: PayloadAction<{ id: string; node: Node<FlowNodeData> }>
    ) => {
      const flowItem = state.flows.find((item) => item.id == action.payload.id)
      if (flowItem) {
        flowItem.nodes.push(action.payload.node)
      }
    },
    addFlowEdge: (
      state: FlowState,
      action: PayloadAction<{ id: string; edge: any }>
    ) => {
      const flowItem = state.flows.find((item) => item.id == action.payload.id)
      if (flowItem) {
        flowItem.edges.push(action.payload.edge)
      }
    },
    updateFlowViewport: (
      state: FlowState,
      action: PayloadAction<{ id: string; viewport: Viewport }>
    ) => {
      state.flows = state.flows.map((flow) =>
        flow.id === action.payload.id
          ? { ...flow, viewport: action.payload.viewport }
          : flow
      )
    },
  },
})

export const { createFlowView, addFlowNode, addFlowEdge, updateFlowViewport } =
  flowSlice.actions
export default flowSlice.reducer
