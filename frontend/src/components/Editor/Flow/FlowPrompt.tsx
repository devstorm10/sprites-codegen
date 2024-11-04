import { memo, MouseEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa6'
import uuid from 'react-uuid'

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
import { FlowHIcon } from '@/components/icons/FlowHIcon'
import { ContextNode, CreateNode } from '@/lib/types'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  createFlow,
  createFlowView,
  createTextPrompt,
  createVariablePrompt,
  deleteContext,
  findContextNodeById,
  updateContext,
} from '@/store/slices'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { EditIcon } from '@/components/icons/EditIcon'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { getAgentUrl } from '@/lib/utils'

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
    title: 'Flow',
    name: 'flow',
    icon: <FlowHIcon />,
  },
]

type FlowPromptProps = {
  id: string
}

const FlowPrompt: React.FC<FlowPromptProps> = ({ id }) => {
  const { project_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const flowNodeItem = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, id)
  )
  const promptItems = flowNodeItem?.contexts || []

  const handleItemClick = (name: string) => () => {
    const promptId = uuid()
    if (name === 'flow') {
      const flowId = uuid()
      dispatch(
        createFlow({
          contextId: id,
          flowId,
          isRedirect: false,
        })
      )
      dispatch(createFlowView(flowId))
    } else if (name === 'variable') {
      dispatch(createVariablePrompt({ contextId: id }))
    } else {
      dispatch(createTextPrompt({ contextId: id, promptId }))
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

  const handleItemSelect =
    (item: ContextNode) => (e: MouseEvent<SVGElement>) => {
      e.stopPropagation()

      navigate(getAgentUrl(project_id || '', item.id))
    }

  const handleItemDuplicate = (item: ContextNode) => () => {
    const flowId = uuid()
    dispatch(
      createFlow({
        contextId: id,
        flowId,
        title: `${item.title} Duplicate`,
        isRedirect: false,
      })
    )
    dispatch(createFlowView(flowId))
    dispatch(
      updateContext({
        id: flowId,
        newContext: { ...item, id: flowId, title: `${item.title} Duplicate` },
      })
    )
  }

  const handleItemDelete = (id: string) => () => {
    dispatch(deleteContext(id))
  }

  return (
    <div className="flex flex-col gap-y-4">
      {promptItems.map((item: ContextNode, idx: number) => (
        <Card key={idx} className="py-3 px-4 flex gap-x-2 group">
          {item.type === 'input' ? (
            <>
              <TextPromptItem textPrompt={item} isOnNode={true} />
              <span
                className="hidden group-hover:block"
                onClick={handleItemDelete(item.id)}
              >
                <TrashIcon strokeOpacity={1} />
              </span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-x-2 grow">
                <FlowHIcon fontSize={20} />
                <EditableText
                  text={item.title || ''}
                  placeholder="Flow"
                  onChange={handleFlowChange(item)}
                  className="!text-wrap font-semibold"
                />
              </div>
              <div className="flex gap-x-1">
                <EditIcon onClick={handleItemSelect(item)} />
                <CopyIcon onClick={handleItemDuplicate(item)} />
                <TrashIcon onClick={handleItemDelete(item.id)} />
              </div>
            </>
          )}
        </Card>
      ))}
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
