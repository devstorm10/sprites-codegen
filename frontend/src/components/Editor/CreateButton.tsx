import { FaPlus } from 'react-icons/fa6'
import { Icon } from '@iconify/react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch } from '@/store/store'
import { createTextPrompt } from '@/store/slices'
import { CreateNode } from '@/lib/types'

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

const CreateButton: React.FC = () => {
  const dispatch = useAppDispatch()

  const handleItemClick = (name: string) => () => {
    switch (name) {
      case 'text-prompt':
        dispatch(createTextPrompt())
        break
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg">
          <FaPlus size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        {createItems.map((item: CreateNode) => (
          <DropdownMenuItem
            key={item.name}
            className="flex items-center gap-x-2.5"
            onClick={handleItemClick(item.name)}
          >
            <Icon icon="mage:stars-b" fontSize={18} />
            <span>{item.title}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CreateButton
