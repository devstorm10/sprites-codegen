import { useCallback, useRef, useState } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Icon } from '@iconify/react'

import TextPromptItem from './Text/TextPromptItem'
import FlowItem from './Flow/FlowItem'
import TagItem from './TagItem'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useAppDispatch } from '@/store/store'
import { createNewTag } from '@/store/slices'
import { ContextNode, CreateNode } from '@/lib/types'
import { SparkleIcon } from '../icons/SparkleIcon'
import { LuTag } from 'react-icons/lu'

const functionItems: CreateNode[] = [
  {
    icon: <SparkleIcon />,
    title: 'Autofill with AI',
    name: 'autofill-with-ai',
  },
  {
    icon: <LuTag />,
    title: 'Add new tag',
    name: 'add-new-tag',
  },
  {
    icon: <SparkleIcon />,
    title: 'Create component',
    name: 'create-component',
  },
]

interface GroupItemProps {
  context: ContextNode
}

interface GroupContainerProps {
  context: ContextNode
}

const GroupItem: React.FC<GroupItemProps> = ({ context }) => {
  const dispatch = useAppDispatch()
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: context.id,
  })
  const isDragRef = useRef(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleItemClick = useCallback(
    (name: string) => () => {
      switch (name) {
        case 'add-new-tag':
          dispatch(createNewTag(context.id))
          break
      }
    },
    [context.id]
  )

  const handleKeyDown = (event: React.KeyboardEvent) => {
    listeners?.onKeyDown(event)
  }

  const handlePointerDown = (event: React.PointerEvent) => {
    event.stopPropagation()
    setTimeout(() => {
      isDragRef.current && listeners?.onPointerDown(event)
    }, 200)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (event.buttons === 1) {
      isDragRef.current = true
    }
  }

  const handlePointerUp = () => {
    isDragRef.current = false
  }

  return (
    <div ref={setNodeRef} className="flex items-start gap-x-1">
      {context.type !== 'tag' && (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger
            className={context.type === 'input' ? 'mt-[6px]' : 'mt-[14px]'}
          >
            <span
              className="h-[24px] w-[15px] rounded-sm hover:bg-accent hover:text-accent-foreground"
              {...attributes}
              onKeyDown={handleKeyDown}
              onPointerDown={handlePointerDown}
              onMouseMove={handleMouseMove}
              onPointerUp={handlePointerUp}
              onClick={(event) => {
                event.stopPropagation()
                setIsOpen(true)
              }}
            >
              <Icon icon="ph:dots-six-vertical-light" fontSize={16} />
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="left"
            align="center"
            className="w-60 rounded-[12px] shadow-[0_0_16px_rgba(0,0,0,0.04)]"
          >
            {functionItems.map((item: CreateNode) => (
              <DropdownMenuItem
                key={item.name}
                className="flex items-center gap-x-2.5 rounded-[12px] cursor-pointer"
                onClick={handleItemClick(item.name)}
              >
                {item.icon}
                <span className="">{item.title}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className="px-2 text-[12px] text-card-foreground/50">
              <p>Last edited by you</p>
              <p>Todat at 2:23 AM</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {context.type === 'input' ? (
        <TextPromptItem textPrompt={context} {...attributes} {...listeners} />
      ) : context.type === 'flow' ? (
        <FlowItem
          key={context.id}
          context={context}
          {...attributes}
          {...listeners}
        />
      ) : context.type === 'tag' ? (
        <TagItem
          key={context.id}
          context={context}
          {...attributes}
          {...listeners}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

const GroupContainer: React.FC<GroupContainerProps> = ({ context }) => {
  const { setNodeRef } = useDroppable({
    id: context.id,
  })

  return (
    <div ref={setNodeRef} className="flex flex-col gap-y-2">
      <GroupItem context={context} />
      {context.contexts && (
        <div className="pl-2 flex flex-col gap-y-1">
          {context.contexts.map((context) => (
            <GroupContainer key={context.id} context={context} />
          ))}
        </div>
      )}
    </div>
  )
}

export default GroupContainer
