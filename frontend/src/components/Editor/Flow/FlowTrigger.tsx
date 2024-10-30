import { memo, useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import { FaPlus } from 'react-icons/fa6'

import PromptInput from '@/common/PromptInput'
import VariableInput from '@/common/VariableInput'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TextIcon } from '@/components/icons/TextIcon'
import { VariableIcon } from '@/components/icons/VariableIcon'
import { CreateNode } from '@/lib/types'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { cn } from '@/lib/utils'

const createItems: CreateNode[] = [
  {
    title: 'Text Prompt',
    name: 'text-prompt',
    icon: (
      <TextIcon
        width={16}
        height={16}
        className="translate-x-0.5 translate-y-0.5"
      />
    ),
  },
  {
    title: 'Variable',
    name: 'variable',
    icon: <VariableIcon />,
  },
]

type VariableType = {
  name: string
  value: string
  opt: string
}

type ContentItemType = {
  type: 'prompt' | 'variable' | 'condition'
  data: string | VariableType
}

type FlowTriggerProps = {
  id: string
  data: {
    content: {
      items: ContentItemType[]
    }
  }
}

const FlowTrigger: React.FC<FlowTriggerProps> = ({ id, data }) => {
  const { setNodes } = useReactFlow()

  const handleItemClick = (name: string) => () => {
    const newItem = {
      type: name === 'text-prompt' ? 'prompt' : 'variable',
      data:
        name === 'text-prompt'
          ? ''
          : {
              name: '',
              opt: '',
              value: '',
            },
    }
    const newData = {
      ...data,
      content: {
        ...data.content,
        items: [
          ...data.content.items,
          ...(data.content.items.length > 0
            ? [{ type: 'condition', data: 'OR' }, newItem]
            : [newItem]),
        ],
      },
    }

    setNodes((prvNodes) =>
      prvNodes.map((node) =>
        node.id === id ? { ...node, data: newData } : node
      )
    )
  }

  const handleItemUpdate = useCallback(
    (
      data: string | { name: string; opt: string; value: string },
      idx: number
    ) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  content: {
                    ...node.data.content,
                    items: node.data.content.items.map(
                      (item: any, index: number) =>
                        index === idx ? { ...item, data } : item
                    ),
                  },
                },
              }
            : node
        )
      )
    },
    [id]
  )

  const handleItemDelete = useCallback(
    (idx: number) => () => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  content: {
                    ...node.data.content,
                    items: node.data.content.items
                      .map((item: any, index: number, items: any[]) => {
                        if (index === idx) return null
                        if (
                          items[index]?.type === 'condition' &&
                          ((idx === 0 && index === 1) || index === idx - 1)
                        )
                          return null
                        return item
                      })
                      .filter((item: any) => item !== null),
                  },
                },
              }
            : node
        )
      )
    },
    [id]
  )

  return (
    <div className="flex flex-col gap-y-4">
      {data.content &&
        data.content.items &&
        data.content.items.map((item: ContentItemType, idx: number) =>
          item.type === 'condition' ? (
            <Select
              key={idx}
              value={item.data as string}
              onValueChange={(condition) => handleItemUpdate(condition, idx)}
            >
              <SelectTrigger className="py-1 px-4 w-fit rounded-[20px] !outline-none">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {['AND', 'OR'].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Card
              key={idx}
              className={cn(
                'py-3 flex gap-x-2.5 group',
                item.type === 'prompt' ? 'px-4' : 'px-2'
              )}
            >
              {item.type === 'prompt' ? (
                <PromptInput
                  text={item.data as string}
                  placeholder="This is the prompt text"
                  onChange={(text) => handleItemUpdate(text, idx)}
                  className="!text-wrap"
                />
              ) : (
                <VariableInput
                  variable={item.data as VariableType}
                  onVarChange={(data) => handleItemUpdate(data, idx)}
                  className="flex gap-x-1 grow"
                />
              )}
              <span
                className="hidden group-hover:block"
                onClick={handleItemDelete(idx)}
              >
                <TrashIcon strokeOpacity={1} />
              </span>
            </Card>
          )
        )}
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
              {item.icon}
              <span className="text-[14px] font-medium">{item.title}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <div className="w-full flex gap-x-2">
        <Card
          id={`${id as string}_yes`}
          className="grow py-3 text-[#B1B0AF] font-medium text-sm text-center relative hover:z-10 hover:border-[#32CD25] hover:text-[#32CD25] group"
        >
          YES
          {id !== FAKE_NODE_ID && (
            <FlowHandlers parentId={`${id as string}_yes`} color="#32CD25" />
          )}
        </Card>
        <Card
          id={`${id as string}_no`}
          className="grow py-3 text-[#B1B0AF] font-medium text-sm text-center relative hover:z-10 hover:border-[#FF0000] hover:text-[#FF0000] group"
        >
          NO
          {id !== FAKE_NODE_ID && (
            <FlowHandlers parentId={`${id as string}_no`} color="#FF0000" />
          )}
        </Card>
      </div> */}
    </div>
  )
}

export default memo(FlowTrigger)
export type { VariableType }
