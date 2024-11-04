import React, {
  CSSProperties,
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { NodeProps } from 'reactflow'
import { FaChevronRight } from 'react-icons/fa6'

import FlowTrigger from './FlowTrigger'
import FlowPrompt from './FlowPrompt'
import FlowAction from './FlowAction'
import FlowInsertLine from './FlowInsertLine'
import FlowHandlers from './FlowHandlers'

import EditPortal, { PortalPosition } from '@/common/EditPortal'
import { EditIcon } from '@/components/icons/EditIcon'
import { SparkleIcon } from '@/components/icons/SparkleIcon'
import { LayoutIcon } from '@/components/icons/LayoutIcon'
import { PromptIcon } from '@/components/icons/PromptIcon'
import { Card } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  findContextNodeById,
  selectContext,
  updateContext,
} from '@/store/slices'
import { FAKE_NODE_ID } from '@/lib/constants'
import { cn } from '@/lib/utils'

type FlowNodeProps = {
  type: 'trigger' | 'prompt' | 'action' | 'insert_line'
  className?: string
  style?: CSSProperties
}

const FlowNode: React.FC<Partial<NodeProps> & FlowNodeProps> = ({
  id,
  type,
  data,
  className = '',
  style = {},
}) => {
  const dispatch = useAppDispatch()
  const selectedNodeId = useAppSelector((state) => state.context.selectedId)
  const context = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, id || '')
  )
  const titleRef = useRef<HTMLParagraphElement>(null)

  const [isEditing, setEditing] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(context?.title || '')
  const [inputPosition, setInputPosition] = useState<PortalPosition | null>(
    null
  )

  const handleNodeClick = useCallback(() => {
    if (id) {
      dispatch(selectContext(id))
    }
  }, [id, type])

  const handleTitleChange = useCallback(
    (text: string) => {
      if (id && context) {
        dispatch(
          updateContext({
            id,
            newContext: {
              ...context,
              title: text,
            },
          })
        )
      }
    },
    [id, context]
  )

  const handleTitleSave = () => {
    handleTitleChange(title)
    setEditing(false)
  }

  useLayoutEffect(() => {
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect()

      setInputPosition({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      })
    }
  }, [isEditing])

  return (
    <Card
      className={cn(
        'w-[300px] flex flex-col text-sm !shadow-[0_3px_15px_rgba(38,50,56,0.07)] relative',
        {
          'border border-[#0B99FF]': selectedNodeId === id,
        },
        className
      )}
      style={style}
      onClick={handleNodeClick}
    >
      <div className="flex items-center gap-x-2 drag-region p-4">
        {type === 'trigger' ? (
          <LayoutIcon />
        ) : type === 'prompt' ? (
          <PromptIcon />
        ) : (
          <SparkleIcon />
        )}
        <div ref={titleRef} className="flex-1 flex">
          <div className="font-bold flex-1 line-clamp-1 !text-wrap">
            <p className="leading-[20px]">{(context && context.title) || ''}</p>
          </div>
          <div className="flex items-center gap-x-2">
            {!isEditing && (
              <span
                className="w-4 h-4 flex items-center justify-center"
                onClick={() => setEditing(true)}
              >
                <EditIcon />
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="h-0.5 border-t mx-4" />
      <div className="p-4">
        {type === 'trigger' ? (
          <FlowTrigger id={id as string} data={data} />
        ) : type === 'prompt' ? (
          <FlowPrompt id={id as string} />
        ) : type === 'action' ? (
          <FlowAction id={id as string} data={data} />
        ) : type === 'insert_line' ? (
          <FlowInsertLine id={id as string} data={data} />
        ) : (
          <></>
        )}
      </div>

      {selectedNodeId === id && (
        <div className="absolute -top-1 left-0 -translate-y-full p-1 pr-3 rounded-full border border-[#0B99FF] flex items-center gap-x-2 bg-white">
          <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[#0B99FF] text-white font-bold">
            <FaChevronRight />
          </span>
          <p className="font-semibold text-[#0B99FF]">Start</p>
        </div>
      )}

      {id !== FAKE_NODE_ID && (
        <FlowHandlers parentId={id as string} isDual={type === 'trigger'} />
      )}

      {isEditing && inputPosition && (
        <EditPortal
          text={title}
          position={inputPosition}
          handleSave={handleTitleSave}
          handleCancel={() => setEditing(false)}
          handleTextChange={setTitle}
        />
      )}
    </Card>
  )
}

export default memo(FlowNode)
