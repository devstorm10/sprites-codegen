import { memo } from 'react'
import { FaPlus } from 'react-icons/fa6'

import EditableText from '@/common/EditableText'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { SparkleIcon } from '@/components/icons/SparkleIcon'
import { TrashIcon } from '@/components/icons/TrashIcon'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Card } from '@/components/ui/card'
import { CreateNode, FlowNodeData } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Handle, Position } from 'reactflow'

type FlowTriggerProps = {
  data: FlowNodeData
  style?: React.CSSProperties
  className?: string
}

const createItems: CreateNode[] = [
  {
    title: 'Text Prompt',
    name: 'text-prompt',
  },
  {
    title: 'Action',
    name: 'action',
  },
  {
    title: 'Variable',
    name: 'variable',
  },
  {
    title: 'Autofill with AI',
    name: 'autofill-with-ai',
  },
]

const FlowTrigger: React.FC<FlowTriggerProps> = ({
  data,
  style = {},
  className = '',
}) => {
  const handleItemClick = (name: string) => () => {
    switch (name) {
      case 'text-prompt':
        break
      case 'action':
        break
    }
  }

  return (
    <Card
      className={cn('p-4 flex flex-col gap-y-4 w-[250px] shadow-sm', className)}
      style={style}
    >
      <div className="flex items-center gap-x-2">
        <SparkleIcon fontSize={20} className="mr-2" />
        <EditableText
          text={data.title || ''}
          onChange={() => {}}
          className="font-bold grow"
        />
        <div className="flex items-center gap-x-2 text-secondary-100/50">
          <CopyIcon />
          <TrashIcon />
        </div>
      </div>
      <div className="h-0.5 border" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="py-3 px-4 flex items-center gap-x-2.5 rounded-[20px] text-secondary-100/50 text-sm font-medium border">
            <FaPlus size={14} />
            <p>Add new</p>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-60 shadow-[0_0_16px_rgba(0,0,0,0.04)] rounded-[12px]"
        >
          {createItems.map((item: CreateNode) => (
            <DropdownMenuItem
              key={item.name}
              className="flex items-center gap-x-2.5"
              onClick={handleItemClick(item.name)}
            >
              <SparkleIcon fontSize={18} />
              <span className="text-[14px] font-medium">{item.title}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Right} />
    </Card>
  )
}

export default memo(FlowTrigger)
