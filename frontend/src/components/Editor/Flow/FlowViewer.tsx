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
  NodeProps,
} from 'reactflow'
import uuid from 'react-uuid'
import 'reactflow/dist/style.css'

import FlowNode from './FlowNode'
import PromptBar from './PromptBar'

import { Card } from '@/components/ui/card'
import { LayoutIcon } from '@/components/icons/LayoutIcon'
import { MessageIcon } from '@/components/icons/MessageIcon'
import { FlowIcon } from '@/components/icons/FlowIcon'
import { FlashIcon } from '@/components/icons/FlashIcon'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  addFlowEdge,
  addFlowNode,
  createFlowNode,
  findContextNodeById,
  showSidebar,
  updateFlowViewport,
} from '@/store/slices'
import { ContextNode, FlowNodeData } from '@/lib/types'
import { cn } from '@/lib/utils'

const nodeTypes = {
  basic: (props: NodeProps) => <FlowNode {...props} type="basic" />,
  prompt: (props: NodeProps) => <FlowNode {...props} type="prompt" />,
  condition: (props: NodeProps) => <FlowNode {...props} type="condition" />,
}
type FlowViewerProps = {
  flowContext: ContextNode
}

type ActionButtonsProps = {
  onLayoutClick: () => void
  onPromptTriggerClick: () => void
  onConditionTriggerClick: () => void
  onSimpleTriggerClick: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onLayoutClick,
  onPromptTriggerClick,
  onConditionTriggerClick,
  onSimpleTriggerClick,
}) => {
  const isSidebar = useAppSelector((state) => state.setting.isSidebar)

  return (
    <Card className="absolute top-1/2 left-4 -translate-y-1/2 py-2 px-1 flex flex-col gap-y-0.5 z-50">
      <span
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer"
        onClick={onLayoutClick}
      >
        <LayoutIcon className={cn({ 'scale-x-[-1]': isSidebar })} />
      </span>
      <span
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer"
        onClick={onPromptTriggerClick}
      >
        <MessageIcon />
      </span>
      <span
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer"
        onClick={onSimpleTriggerClick}
      >
        <FlowIcon className="w-5 h-5" />
      </span>
      <span
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer"
        onClick={onConditionTriggerClick}
      >
        <FlashIcon />
      </span>
    </Card>
  )
}

const FlowViewer: React.FC<FlowViewerProps> = ({ flowContext }) => {
  const dispatch = useAppDispatch()
  const isSidebar = useAppSelector((state) => state.setting.isSidebar)
  const isPromptbar = useAppSelector((state) => state.setting.isPromptbar)

  const flowItem = useAppSelector((state) =>
    state.flow.flows.find((item) => item.id === flowContext.id)
  )
  const selectedNodeId = useAppSelector((state) => state.context.selectedId)
  const selectedContext = findContextNodeById(
    flowContext.contexts || [],
    selectedNodeId || ''
  )

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([])
  const { getZoom, setViewport, screenToFlowPosition, fitView } = useReactFlow()
  const viewport = useViewport()

  const [trigger, setTrigger] = useState<'' | 'basic' | 'prompt' | 'condition'>(
    ''
  )
  const [triggerPos, setTriggerPos] = useState<{ x: number; y: number }>({
    x: -100,
    y: -100,
  })

  const handleSidebarToggle = () => {
    dispatch(showSidebar(!isSidebar))
  }

  const handlePromptTriggerClick = () => {
    setTrigger('prompt')
  }

  const handleSimpleTriggerCreate = () => {
    setTrigger('basic')
  }

  const handleConditionTriggerCreate = () => {
    setTrigger('condition')
  }

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!trigger) return
    e.preventDefault()

    if (e.button === 0) {
      const newNode = {
        id: uuid(),
        type: trigger,
        data: {
          title:
            trigger === 'basic'
              ? 'Trigger'
              : trigger === 'prompt'
                ? 'Additional Prompt'
                : trigger === 'condition'
                  ? 'Condition'
                  : '',
        },
        position: screenToFlowPosition({ x: e.clientX, y: e.clientY }),
      }
      setTrigger('')
      setNodes([...nodes, newNode])
      dispatch(addFlowNode({ id: flowContext.id, node: newNode }))
      dispatch(createFlowNode({ id: flowContext.id, node: newNode }))
    } else if (e.button === 2) {
      setTrigger('')
    }
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!trigger) return
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
          zIndex: 100,
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
  }, [flowItem?.id, setViewport, fitView])

  useEffect(() => {
    dispatch(updateFlowViewport({ id: flowContext.id, viewport }))
  }, [viewport.x, viewport.y, viewport.zoom])

  useEffect(() => {
    const handleContextMenu = (event: Event) => {
      event.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextMenu)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

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
      >
        <Background />
        <Controls />
      </ReactFlow>

      <ActionButtons
        onLayoutClick={handleSidebarToggle}
        onPromptTriggerClick={handlePromptTriggerClick}
        onSimpleTriggerClick={handleSimpleTriggerCreate}
        onConditionTriggerClick={handleConditionTriggerCreate}
      />

      {isPromptbar && selectedContext && (
        <PromptBar context={selectedContext} />
      )}

      {trigger && (
        <FlowNode
          type={trigger}
          data={{
            title:
              trigger === 'basic'
                ? 'Trigger'
                : trigger === 'condition'
                  ? 'Condition'
                  : '',
          }}
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
