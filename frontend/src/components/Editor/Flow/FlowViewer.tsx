import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  Controls,
  OnConnect,
  MarkerType,
  useViewport,
} from 'reactflow'
import uuid from 'react-uuid'
import 'reactflow/dist/style.css'

import FlowTrigger from './FlowTrigger'

import { Card } from '@/components/ui/card'
import { LayoutIcon } from '@/components/icons/LayoutIcon'
import { MessageIcon } from '@/components/icons/MessageIcon'
import { FlowIcon } from '@/components/icons/FlowIcon'
import { FlashIcon } from '@/components/icons/FlashIcon'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  addFlowEdge,
  addFlowNode,
  showSidebar,
  updateFlowViewport,
} from '@/store/slices'
import { ContextNode, FlowNodeData } from '@/lib/types'

const nodeTypes = {
  trigger: FlowTrigger,
}

type FlowViewerProps = {
  flowContext: ContextNode
}

type ActionButtonsProps = {
  onLayoutClick: () => void
  onTriggerClick: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onLayoutClick,
  onTriggerClick,
}) => {
  return (
    <Card className="absolute top-1/2 left-4 -translate-y-1/2 py-2 px-1 flex flex-col gap-y-0.5 z-50">
      <span
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer"
        onClick={onLayoutClick}
      >
        <LayoutIcon />
      </span>
      <span className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer">
        <MessageIcon />
      </span>
      <span className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer">
        <FlowIcon className="w-5 h-5" />
      </span>
      <span
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer"
        onClick={onTriggerClick}
      >
        <FlashIcon />
      </span>
    </Card>
  )
}

const FlowViewer: React.FC<FlowViewerProps> = ({ flowContext }) => {
  const dispatch = useAppDispatch()
  const isSidebar = useAppSelector((state) => state.setting.isSidebar)
  const flowItem = useAppSelector((state) =>
    state.flow.flows.find((item) => item.id === flowContext.id)
  )

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([])
  const { getZoom, setViewport, screenToFlowPosition, fitView } = useReactFlow()
  const viewport = useViewport()

  const [isTrigger, setTrigger] = useState<boolean>(false)
  const [triggerPos, setTriggerPos] = useState<{ x: number; y: number }>({
    x: -100,
    y: -100,
  })

  const handleSidebarToggle = () => {
    dispatch(showSidebar(!isSidebar))
  }

  const handleTriggerCreate = () => {
    setTrigger(true)
  }

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!isTrigger) return
    e.preventDefault()

    const newNode = {
      id: uuid(),
      type: 'trigger',
      data: { title: 'Trigger' },
      position: screenToFlowPosition({ x: e.clientX, y: e.clientY }),
    }
    setTrigger(false)
    setNodes([...nodes, newNode])
    dispatch(addFlowNode({ id: flowContext.id, node: newNode }))
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isTrigger) return
    e.preventDefault()
    const element = e.currentTarget.getBoundingClientRect()
    const mouseXPos = e.clientX - element.left
    const mouseYPos = e.clientY - element.top
    setTriggerPos({ x: mouseXPos, y: mouseYPos })
  }

  const onConnect = useCallback<OnConnect>(
    (params) => {
      const newEdge = {
        ...params,
        id: uuid(),
        markerEnd: {
          type: MarkerType.Arrow,
          width: 20,
          height: 20,
          color: 'black',
        },
        style: {
          strokeWidth: 1,
          stroke: 'black',
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
      dispatch(addFlowEdge({ id: flowContext.id, edge: newEdge }))
    },
    [setEdges]
  )

  useEffect(() => {
    if (!flowItem) return
    const flowNodes = flowItem ? flowItem.nodes : []
    const flowEdges = flowItem ? flowItem.edges : []
    setViewport(flowItem.viewport)
    setNodes(flowNodes)
    setEdges(flowEdges)
    // fitView()
  }, [flowItem?.id, setViewport, fitView])

  useEffect(() => {
    dispatch(updateFlowViewport({ id: flowContext.id, viewport }))
  }, [viewport.x, viewport.y, viewport.zoom])

  return (
    <div
      className="w-full flex-1 relative"
      onMouseMoveCapture={handleMouseMove}
      onMouseDownCapture={handleMouseDown}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        // fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      <ActionButtons
        onLayoutClick={handleSidebarToggle}
        onTriggerClick={handleTriggerCreate}
      />

      {isTrigger && (
        <FlowTrigger
          data={{ title: 'Trigger' }}
          className="absolute z-40 opacity-50"
          style={{
            left: triggerPos.x,
            top: triggerPos.y,
            transform: `scale(${getZoom()})`,
            transformOrigin: 'top left',
          }}
        />
      )}
    </div>
  )
}

export default FlowViewer
