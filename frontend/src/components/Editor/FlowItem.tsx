import { Icon } from '@iconify/react'
import { BsCopy } from 'react-icons/bs'
import { FaRegTrashCan } from 'react-icons/fa6'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch } from '@/store/store'
import { createNewTag, selectContext, updateContext } from '@/store/slices'
import { ContextNode, CreateNode } from '@/lib/types'
import EditableText from '@/common/EditableText'

const functionItems: CreateNode[] = [
  {
    title: 'Autofill with AI',
    name: 'autofill-with-ai',
  },
  {
    title: 'Add new tag',
    name: 'add-new-tag',
  },
  {
    title: 'Create component',
    name: 'create-component',
  },
]

type FlowProps = {
  context: ContextNode
}

const FlowItem: React.FC<FlowProps> = ({ context }) => {
  const dispatch = useAppDispatch()

  const { id, title } = context

  const handleItemClick = (name: string) => () => {
    switch (name) {
      case 'add-new-tag':
        dispatch(createNewTag(id))
        break
    }
  }

  const handleTitleUpdate = (newTitle: string) => {
    dispatch(
      updateContext({
        id,
        newContext: {
          title: newTitle,
        },
      })
    )
  }

  const handleNewFlowClick = () => {
    dispatch(selectContext(id))
  }

  return (
    <div className="flex items-center gap-x-1">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-[24px] w-[15px] rounded-sm"
            >
              <Icon icon="ph:dots-six-vertical-light" fontSize={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" align="center" className="w-60">
            {functionItems.map((item: CreateNode) => (
              <DropdownMenuItem
                key={item.name}
                className="flex items-center gap-x-2.5"
                onClick={handleItemClick(item.name)}
              >
                <Icon icon="mage:stars-b" fontSize={16} />
                <span className="text-sm">{item.title}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className="px-2 text-xs text-card-foreground/50">
              <p>Last edited by you</p>
              <p>Todat at 2:23 AM</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="flex items-center gap-x-3 px-3 py-2 rounded-full">
        <Icon icon="mage:stars-b" fontSize={16} onClick={handleNewFlowClick} />
        <EditableText
          text={title || ''}
          onChange={handleTitleUpdate}
          className="font-bold text-sm"
        />
        <div className="flex items-center gap-x-2 text-black/30 text-sm">
          <BsCopy />
          <FaRegTrashCan />
        </div>
      </Card>
    </div>
  )
}

export default FlowItem
