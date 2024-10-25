import { memo, useCallback } from 'react'
import { FaPlus } from 'react-icons/fa6'

import FlowHandlers from './FlowHandlers'
import AutoVarComplete from '@/common/AutoVarComplete'
import InputText from '@/common/InputText'
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
import { Input } from '@/components/ui/input'
import { TextIcon } from '@/components/icons/TextIcon'
import { VariableIcon } from '@/components/icons/VariableIcon'
import { CreateNode } from '@/lib/types'
import { FAKE_NODE_ID } from '@/lib/constants'
import { useReactFlow } from 'reactflow'
import { useAppSelector } from '@/store/store'

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

const optItems: string[] = ['==', '!=', '>', '<', '>=', '<=']

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
  const variables = useAppSelector((state) => state.context.variables)

  const handleItemClick = (name: string) => () => {
    const newData = {
      ...data,
      content: {
        ...data.content,
        items: [
          ...data.content.items,
          {
            type: name === 'text-prompt' ? 'prompt' : 'variable',
            data:
              name === 'text-prompt'
                ? 'This is the text prompt'
                : {
                    name: '',
                    opt: '',
                    value: '',
                  },
          },
          { type: 'condition', data: 'OR' },
        ],
      },
    }

    setNodes((prvNodes) =>
      prvNodes.map((node) =>
        node.id === id ? { ...node, data: newData } : node
      )
    )
  }

  const handleDataUpdate = useCallback(
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

  return (
    <div className="flex flex-col gap-y-4">
      {data.content &&
        data.content.items &&
        data.content.items.map((item: ContentItemType, idx: number) =>
          item.type === 'prompt' ? (
            <Card
              key={idx}
              className="py-3 px-4 border border-[#EAEAEA] shadow-card rounded-[20px] flex items-end justify-center gap-x-2"
            >
              <InputText
                text={item.data as string}
                onChange={(text) => handleDataUpdate(text, idx)}
                className="!text-wrap"
              />
            </Card>
          ) : item.type === 'variable' ? (
            <Card
              key={idx}
              className="py-3 px-2 border border-[#EAEAEA] shadow-card rounded-[20px] flex items-end justify-center gap-x-1"
            >
              <AutoVarComplete
                varname={(item.data as VariableType).name}
                suggestions={variables}
                onFocus={() => {}}
                onVarChange={(name) =>
                  handleDataUpdate(
                    { ...(item.data as VariableType), name },
                    idx
                  )
                }
                className="grow rounded-[20px]"
              />
              <Select
                value={(item.data as VariableType).opt}
                onValueChange={(opt) =>
                  handleDataUpdate({ ...(item.data as VariableType), opt }, idx)
                }
              >
                <SelectTrigger className="py-1 px-4 w-[70px] rounded-[20px] !outline-none">
                  <SelectValue placeholder="==" />
                </SelectTrigger>
                <SelectContent>
                  {optItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="value"
                value={(item.data as VariableType).value}
                onChange={(e) =>
                  handleDataUpdate(
                    {
                      ...(item.data as VariableType),
                      value: e.target.value,
                    },
                    idx
                  )
                }
                className="grow py-0.5 !px-0 focus-visible:ring-0 outline-none text-sm text-center font-medium leading-none rounded-[20px]"
              />
            </Card>
          ) : (
            <Select
              key={idx}
              value={item.data as string}
              onValueChange={(condition) => handleDataUpdate(condition, idx)}
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
      <div className="w-full flex gap-x-2">
        <Card
          id={`${id as string}_yes`}
          className="grow py-3 rounded-[20px] shadow-card text-[#B1B0AF] font-medium text-sm text-center relative hover:z-10 hover:border-[#32CD25] hover:text-[#32CD25] group"
        >
          YES
          {id !== FAKE_NODE_ID && (
            <FlowHandlers parentId={`${id as string}_yes`} color="#32CD25" />
          )}
        </Card>
        <Card
          id={`${id as string}_no`}
          className="grow py-3 rounded-[20px] shadow-card text-[#B1B0AF] font-medium text-sm text-center relative hover:z-10 hover:border-[#FF0000] hover:text-[#FF0000] group"
        >
          NO
          {id !== FAKE_NODE_ID && (
            <FlowHandlers parentId={`${id as string}_no`} color="#FF0000" />
          )}
        </Card>
      </div>
    </div>
  )
}

export default memo(FlowTrigger)
