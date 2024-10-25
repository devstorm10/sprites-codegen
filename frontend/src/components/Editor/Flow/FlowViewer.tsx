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
  ConnectionLineType,
  ConnectionMode,
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
  updateEdges,
  updateFlowViewport,
  updateNodes,
} from '@/store/slices'
import { ContextNode, FlowNodeData } from '@/lib/types'
import { FAKE_NODE_ID } from '@/lib/constants'

const nodeTypes = {
  flow_node: (props: NodeProps) =>
    props.data.type === 'trigger' ? (
      <FlowNode {...props} type="trigger" />
    ) : props.data.type === 'prompt' ? (
      <FlowNode {...props} type="prompt" />
    ) : props.data.type === 'action' ? (
      <FlowNode {...props} type="action" />
    ) : props.data.type === 'insert_line' ? (
      <FlowNode {...props} type="insert_line" />
    ) : (
      <></>
    ),
}
type FlowViewerProps = {
  flowContext: ContextNode
}

type ActionButtonsProps = {
  onTriggerClick: () => void
  onAddPromptClick: () => void
  onActionClick: () => void
  onInsertLineClick: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onTriggerClick,
  onAddPromptClick,
  onActionClick,
  onInsertLineClick,
}) => {
  return (
    <Card className="absolute top-1/2 left-4 -translate-y-1/2 py-2 px-1 flex flex-col gap-y-0.5 z-50">
      <span
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer"
        onClick={onTriggerClick}
      >
        <LayoutIcon />
      </span>
      <span
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer"
        onClick={onAddPromptClick}
      >
        <MessageIcon />
      </span>
      <span
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer"
        onClick={onActionClick}
      >
        <FlowIcon className="w-5 h-5" />
      </span>
      <span
        className="h-8 w-8 flex items-center justify-center hover:bg-secondary-100/10 rounded-lg cursor-pointer"
        onClick={onInsertLineClick}
      >
        <FlashIcon />
      </span>
    </Card>
  )
}

const FlowViewer: React.FC<FlowViewerProps> = ({ flowContext }) => {
  const dispatch = useAppDispatch()
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

  const [trigger, setTrigger] = useState<
    '' | 'trigger' | 'prompt' | 'action' | 'insert_line'
  >('')
  const [triggerPos, setTriggerPos] = useState<{ x: number; y: number }>({
    x: -100,
    y: -100,
  })

  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

  const handleNodeSelect = useCallback((_event: MouseEvent, _node: any) => {
    setSelectedEdgeId(null)
  }, [])

  const handleEdgeSelect = useCallback(
    (_event: MouseEvent, edge: any) => {
      setSelectedEdgeId(edge.idx === selectedEdgeId ? null : edge.id)
    },
    [selectedEdgeId]
  )

  const handleTriggerCreate = () => {
    setTrigger('trigger')
  }

  const handlePromptCreate = () => {
    setTrigger('prompt')
  }

  const handleActionCreate = () => {
    setTrigger('action')
  }

  const handleInsertLineCreate = () => {
    setTrigger('insert_line')
  }

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!trigger) return
    e.preventDefault()

    if (e.button === 0) {
      const newNode = {
        id: uuid(),
        type: 'flow_node',
        data: {
          type: trigger,
          title:
            trigger === 'trigger'
              ? 'Trigger'
              : trigger === 'prompt'
                ? 'Additional Prompt'
                : trigger === 'action'
                  ? 'Action'
                  : trigger === 'insert_line'
                    ? 'Insert Line'
                    : '',
          content: { items: [] },
        },
        position: screenToFlowPosition({ x: e.clientX, y: e.clientY }),
      }
      setTrigger('')
      setNodes([...nodes, newNode])
      dispatch(addFlowNode({ id: flowContext.id, node: newNode }))
      dispatch(createFlowNode({ id: flowContext.id, node: newNode }))
      setTriggerPos({ x: -100, y: -100 })
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

  const handleEdgeConnect = useCallback<OnConnect>(
    (params) => {
      const newEdge = {
        ...params,
        sourceHandle: `${params.sourceHandle}_point`,
        targetHandle: `${params.targetHandle}_point`,
        id: uuid(),
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.Arrow,
          strokeWidth: 1.5,
          color: 'black',
        },
        style: {
          strokeWidth: 2,
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
  }, [flowItem?.id, setViewport, fitView])

  useEffect(() => {
    dispatch(updateFlowViewport({ id: flowContext.id, viewport }))
  }, [viewport.x, viewport.y, viewport.zoom])

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(updateNodes({ id: flowContext.id, nodes }))
      dispatch(updateEdges({ id: flowContext.id, edges }))
    }, 500)

    return () => clearInterval(intervalId)
  }, [nodes, edges])

  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === selectedEdgeId
          ? {
              ...edge,
              markerEnd: {
                type: MarkerType.Arrow,
                strokeWidth: 1.5,
                color: '#0B99FF',
              },
              style: { ...edge.style, stroke: '#0B99FF' },
            }
          : {
              ...edge,
              markerEnd: {
                type: MarkerType.Arrow,
                strokeWidth: 1.5,
                color: 'black',
              },
              style: { ...edge.style, stroke: 'black' },
            }
      )
    )
  }, [selectedEdgeId])

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
        onConnect={handleEdgeConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeSelect}
        onEdgeClick={handleEdgeSelect}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionMode={ConnectionMode.Loose}
      >
        <Background />
        <Controls />
      </ReactFlow>

      <ActionButtons
        onTriggerClick={handleTriggerCreate}
        onAddPromptClick={handlePromptCreate}
        onActionClick={handleActionCreate}
        onInsertLineClick={handleInsertLineCreate}
      />

      {isPromptbar && selectedContext && (
        <PromptBar context={selectedContext} />
      )}

      {trigger && (
        <FlowNode
          id={FAKE_NODE_ID}
          type={trigger}
          data={{
            title:
              trigger === 'trigger'
                ? 'Trigger'
                : trigger === 'prompt'
                  ? 'Prompt'
                  : trigger === 'action'
                    ? 'Action'
                    : trigger === 'insert_line'
                      ? 'Insert Line'
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
