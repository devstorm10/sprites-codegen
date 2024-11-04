import { FaPlus } from 'react-icons/fa6'
import uuid from 'react-uuid'

import { SparkleIcon } from '@/components/icons/SparkleIcon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch } from '@/store/store'
import { createFlow, createFlowView, createTextPrompt } from '@/store/slices'
import { CreateNode } from '@/lib/types'
import { useNavigate, useParams } from 'react-router-dom'
import { getAgentUrl } from '@/lib/utils'

interface CreateButtonProps {
  contextId: string
}

const createItems: CreateNode[] = [
  {
    title: 'Text Prompt',
    name: 'text-prompt',
  },
  {
    title: 'Flow',
    name: 'flow',
  },
  {
    title: 'File',
    name: 'file',
  },
  {
    title: 'Conversation starter',
    name: 'conversation-starter',
  },
  {
    title: 'Core memory',
    name: 'core-memory',
  },
  {
    title: 'Knowledge base',
    name: 'knowledge-base',
  },
  {
    title: 'Autofill with AI',
    name: 'autofill-with-ai',
  },
  {
    title: 'Template',
    name: 'template',
  },
]

const CreateButton: React.FC<CreateButtonProps> = ({ contextId }) => {
  const { project_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleItemClick = (name: string) => () => {
    switch (name) {
      case 'text-prompt':
        dispatch(createTextPrompt({ contextId }))
        break
      case 'flow':
        const flowId = uuid()
        dispatch(
          createFlow({
            contextId,
            flowId,
          })
        )
        dispatch(createFlowView(flowId))
        navigate(getAgentUrl(project_id || '', flowId))

        break
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-lg text-secondary-100/50"
        >
          <FaPlus size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
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
  )
}

export default CreateButton
