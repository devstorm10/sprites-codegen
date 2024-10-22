import React, { CSSProperties, memo, useCallback } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import FlowBasic from './FlowBasic'
import FlowPrompt from './FlowPrompt'
import FlowCondition from './FlowCondition'

import EditableText from '@/common/EditableText'
import { Card } from '@/components/ui/card'
import { SparkleIcon } from '@/components/icons/SparkleIcon'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { selectContext, showPromptbar } from '@/store/slices'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { cn } from '@/lib/utils'

type FlowNodeProps = {
  type: 'basic' | 'prompt' | 'condition'
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
    dispatch(showPromptbar(type === 'prompt'))
  }, [id, isPromptbar, type])

  return (
    <Card
      className={cn(
        'p-4 w-[300px] flex flex-col gap-y-4 text-sm shadow-[0_3px_15px_rgba(38,50,56,0.07)]',
        {
          'border border-[#0B99FF]': selectedNodeId === id,
        },
        className
      )}
      style={style}
      onClick={handleNodeClick}
    >
      <div className="flex items-center gap-x-2">
        <SparkleIcon fontSize={20} className="mr-2 shrink-0" />
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
      {type === 'basic' ? (
        <FlowBasic />
      ) : type === 'prompt' ? (
        <FlowPrompt id={id as string} />
      ) : type === 'condition' ? (
        <FlowCondition data={data} />
      ) : (
        <></>
      )}

      <Handle type="target" position={Position.Left} className="top-14" />
      {type !== 'condition' && (
        <Handle type="source" position={Position.Right} className="top-14" />
      )}
    </Card>
  )
}

export default memo(FlowNode)
