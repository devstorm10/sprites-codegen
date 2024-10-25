import React, { CSSProperties, memo, useCallback } from 'react'
import { FaChevronRight } from 'react-icons/fa6'
import { NodeProps } from 'reactflow'

import FlowTrigger from './FlowTrigger'
import FlowPrompt from './FlowPrompt'
import FlowAction from './FlowAction'
import FlowInsertLine from './FlowInsertLine'
import FlowHandlers from './FlowHandlers'

import EditableText from '@/common/EditableText'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { SparkleIcon } from '@/components/icons/SparkleIcon'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { LayoutIcon } from '@/components/icons/LayoutIcon'
import { PromptIcon } from '@/components/icons/PromptIcon'
import { Card } from '@/components/ui/card'
import { FAKE_NODE_ID } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { selectContext, showPromptbar } from '@/store/slices'

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
  const isPromptbar = useAppSelector((state) => state.setting.isPromptbar)
  const selectedNodeId = useAppSelector((state) => state.context.selectedId)

  const handleNodeClick = useCallback(() => {
    if (id) {
      dispatch(selectContext(id))
    }
    if (type === 'prompt') dispatch(showPromptbar(true))
  }, [id, isPromptbar, type])

  return (
    <Card
      className={cn(
        'p-4 w-[300px] flex flex-col gap-y-4 text-sm shadow-[0_3px_15px_rgba(38,50,56,0.07)] relative',
        {
          'border border-[#0B99FF]': selectedNodeId === id,
        },
        className
      )}
      style={style}
      onClick={handleNodeClick}
    >
      <div className="flex items-center gap-x-2">
        {type === 'trigger' ? (
          <LayoutIcon />
        ) : type === 'prompt' ? (
          <PromptIcon />
        ) : (
          <SparkleIcon />
        )}
        <EditableText
          text={(data && data.title) || ''}
          onChange={() => {}}
          className="font-bold grow line-clamp-1 !text-wrap"
        />
        <div className="flex items-center gap-x-2 text-secondary-100/50">
          <CopyIcon />
          <TrashIcon />
        </div>
      </div>
      <div className="h-0.5 border-t" />
      {type === 'trigger' ? (
        <FlowTrigger id={id as string} data={data} />
      ) : type === 'prompt' ? (
        <FlowPrompt id={id as string} data={data} />
      ) : type === 'action' ? (
        <FlowAction id={id as string} data={data} />
      ) : type === 'insert_line' ? (
        <FlowInsertLine id={id as string} data={data} />
      ) : (
        <></>
      )}

      {selectedNodeId === id && (
        <div className="absolute -top-1 left-0 -translate-y-full p-1 pr-3 rounded-full border border-[#0B99FF] flex items-center gap-x-2 bg-white">
          <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[#0B99FF] text-white font-bold">
            <FaChevronRight />
          </span>
          <p className="font-semibold text-[#0B99FF]">Start</p>
        </div>
      )}

      {id !== FAKE_NODE_ID && (
        <FlowHandlers parentId={id as string} color="#0B99FF" />
      )}
    </Card>
  )
}

export default memo(FlowNode)
