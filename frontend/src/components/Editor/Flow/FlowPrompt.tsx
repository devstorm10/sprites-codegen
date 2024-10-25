import { memo, useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import { FaPlus } from 'react-icons/fa6'

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
import { FlowHIcon } from '@/components/icons/FlowHIcon'
import { SparkleIcon } from '@/components/icons/SparkleIcon'
import { ContextNode, CreateNode } from '@/lib/types'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  createFlow,
  createFlowView,
  createTextPrompt,
  findContextNodeById,
  updateContext,
} from '@/store/slices'
import uuid from 'react-uuid'

const createItems: CreateNode[] = [
  {
    title: 'Text Prompt',
    name: 'prompt',
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
  {
    title: 'Flow',
    name: 'flow',
    icon: <FlowHIcon />,
  },
]

const optItems: string[] = ['==', '!=', '>', '<', '>=', '<=']

type VariableType = {
  name: string
  value: string
  opt: string
}

type ContentItemType = {
  type: 'prompt' | 'variable' | 'flow'
  data: string | VariableType | ContextNode
}

type FlowPromptProps = {
  id: string
  data: {
    content: {
      items: ContentItemType[]
    }
  }
}

const FlowPrompt: React.FC<FlowPromptProps> = ({ id, data }) => {
  const dispatch = useAppDispatch()
  const { setNodes } = useReactFlow()
  const variables = useAppSelector((state) => state.context.variables)
  const flowNodeItem = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, id)
  )
  const promptItems = flowNodeItem?.contexts || []

  const handleItemClick = (name: string) => () => {
    if (name === 'flow') {
      const flowId = uuid()
      dispatch(createFlow({ contextId: id, flowId, isRedirect: false }))
      dispatch(createFlowView(flowId))
    } else dispatch(createTextPrompt(id))

    const newData = {
      ...data,
      content: {
        ...data.content,
        items: [
          ...data.content.items,
          {
            type: name,
            data:
              name === 'prompt'
                ? ''
                : name === 'variable'
                  ? {
                      name: '',
                      opt: '',
                      value: '',
                    }
                  : 'Flow',
          },
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
      type: 'prompt' | 'variable' | 'flow',
      data: string | VariableType,
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
      if (promptItems[idx]) {
        const targetItem = promptItems[idx]
        dispatch(
          updateContext({
            id: targetItem.id,
            newContext: {
              ...targetItem,
              data: {
                content:
                  type === 'variable'
                    ? `{{${(data as VariableType).name}${(data as VariableType).opt}${(data as VariableType).value}}}`
                    : data,
              },
            },
          })
        )
      }
    },
    [id, promptItems]
  )

  // useEffect(() => {
  //   setNodes((nodes) =>
  //     nodes.map((node) => {
  //       if (node.id !== id) return node
  //       console.log('changed node', node)
  //       return {
  //         ...node,
  //         data: {
  //           ...node.data,
  //           content: {
  //             ...node.data.content,
  //             items: (
  //               (node.data?.content?.items as ContentItemType[]) || []
  //             ).map((item, idx) =>
  //               item.type === 'prompt'
  //                 ? { ...item, data: promptItems[idx]?.data?.content || '' }
  //                 : item.type === 'variable'
  //                   ? {
  //                       ...item,
  //                       data: (() => {
  //                         const content = promptItems[idx]?.data?.content || ''
  //                         const match = content.match(
  //                           /{{(.+?)(==|!=|>|<|>=|<=)(.+?)}}/
  //                         )
  //                         if (match) {
  //                           return {
  //                             name: match[1],
  //                             opt: match[2],
  //                             value: match[3],
  //                           }
  //                         }
  //                         return { name: '', opt: '', value: '' }
  //                       })(),
  //                     }
  //                   : { ...item, data: promptItems[idx]?.data?.content || '' }
  //             ),
  //           },
  //         },
  //       }
  //     })
  //   )
  // }, [id, promptItems])

  return (
    <div className="flex flex-col gap-y-4">
      {data.content &&
        data.content.items &&
        data.content.items.map((item: ContentItemType, idx: number) =>
          item.type === 'prompt' ? (
            <Card
              key={idx}
              className="py-3 px-4 border border-[#EAEAEA] shadow-[0_0_16px_0px_rgba(0,0,0,0.08)] rounded-[20px] flex items-end justify-center gap-x-2"
            >
              <InputText
                text={item.data as string}
                placeholder="This is the text prompt"
                onChange={(text) => handleDataUpdate('prompt', text, idx)}
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
                    'variable',
                    { ...(item.data as VariableType), name },
                    idx
                  )
                }
                className="grow rounded-[20px]"
              />
              <Select
                value={(item.data as VariableType).opt}
                onValueChange={(opt) =>
                  handleDataUpdate(
                    'variable',
                    { ...(item.data as VariableType), opt },
                    idx
                  )
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
                    'variable',
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
            <Card className="px-4 py-3 flex items-center gap-x-3 border border-[#EAEAEA] shadow-[0_0_16px_0px_rgba(0,0,0,0.08)] rounded-[20px]">
              <SparkleIcon fontSize={20} />
              <InputText
                text={item.data as string}
                onChange={(text) => handleDataUpdate('flow', text, idx)}
                className="font-bold"
              />
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
    </div>
  )
}

export default memo(FlowPrompt)
