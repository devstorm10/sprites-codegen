import React, { useCallback, useLayoutEffect } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  Controls,
  OnConnect,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { initialEdges, initialNodes } from './data'
import { getLayoutedElements } from './utils'
import { LayoutDirection } from './types'

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '80',
}

const LayoutFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { fitView } = useReactFlow()

  const onConnect = useCallback<OnConnect>(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onLayout = useCallback(
    async ({ direction, useInitialNodes = false }: LayoutDirection) => {
      const opts = { 'elk.direction': direction, ...elkOptions }
      const ns = useInitialNodes ? initialNodes : nodes
      const es = useInitialNodes ? initialEdges : edges

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await getLayoutedElements(ns, es, opts)
      setNodes(layoutedNodes)
      setEdges(layoutedEdges)

      window.requestAnimationFrame(() => fitView())
    },
    [nodes, edges, setNodes, setEdges, fitView]
  )

  useLayoutEffect(() => {
    onLayout({ direction: 'DOWN', useInitialNodes: true })
  }, [])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  )
}

const FlowViewer = () => (
  <ReactFlowProvider>
    <div className="w-full flex-1">
      <LayoutFlow />
    </div>
  </ReactFlowProvider>
)

export default FlowViewer
