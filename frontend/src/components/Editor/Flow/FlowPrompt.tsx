import { memo } from 'react'
import { FaPlus } from 'react-icons/fa6'
import uuid from 'react-uuid'

import VariableInput, { optItems } from '@/common/VariableInput'
import EditableText from '@/common/EditableText'
import TextPromptItem from '@/components/Editor/Text/TextPromptItem'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
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
  createVariablePrompt,
  findContextNodeById,
  updateContext,
} from '@/store/slices'
import { splitByArray } from '@/lib/utils'

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

type VariableType = {
  name: string
  value: string
  opt: string
}

type FlowPromptProps = {
  id: string
}

const FlowPrompt: React.FC<FlowPromptProps> = ({ id }) => {
  const dispatch = useAppDispatch()
  const flowNodeItem = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, id)
  )
  const promptItems = flowNodeItem?.contexts || []

  const handleItemClick = (name: string) => () => {
    const promptId = uuid()
    if (name === 'flow') {
      const flowId = uuid()
      dispatch(createFlow({ contextId: id, flowId, isRedirect: false }))
      dispatch(createFlowView(flowId))
    } else if (name === 'variable') {
      dispatch(createVariablePrompt({ contextId: id }))
    } else {
      dispatch(createTextPrompt({ contextId: id, promptId }))
    }
  }

  const getVariable = (item: any) => {
    const value = item.data?.content || ''
    if (value.startsWith('{{') && value.endsWith('}}')) {
      const content = value.slice(2, value.length - 2)
      const { pattern, values } = splitByArray(content, optItems)
      return { name: values[0], opt: pattern, value: values[1] }
    }
    return {
      name: '',
      opt: optItems[0],
      value: '',
    }
  }

  const handleFlowChange = (context: ContextNode) => (text: string) => {
    dispatch(
      updateContext({
        id: context.id,
        newContext: {
          ...context,
          title: text,
        },
      })
    )
  }

  const handleVarChange =
    (context: ContextNode) => (variable: VariableType) => {
      dispatch(
        updateContext({
          id: context.id,
          newContext: {
            ...context,
            data: {
              content: `{{${variable.name}${variable.opt}${variable.value}}}`,
            },
          },
        })
      )
    }

  return (
    <div className="flex flex-col gap-y-4">
      {promptItems.map((item: ContextNode, idx: number) =>
        item.type === 'input' ? (
          <Card
            key={idx}
            className="py-3 px-4 flex items-end justify-center gap-x-2"
          >
            <TextPromptItem textPrompt={item} />
          </Card>
        ) : item.type === 'variable' ? (
          <Card
            key={idx}
            className="py-3 px-2 flex items-end justify-center gap-x-1"
          >
            <VariableInput
              variable={getVariable(item)}
              onVarChange={handleVarChange(item)}
              className="flex gap-x-1"
            />
          </Card>
        ) : (
          <Card key={idx} className="px-4 py-3 flex items-center gap-x-3">
            <SparkleIcon fontSize={20} />
            <EditableText
              text={item.title || ''}
              placeholder="Flow"
              onChange={handleFlowChange(item)}
              className="!text-wrap"
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
