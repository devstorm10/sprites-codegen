import { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppDispatch } from '@/store/store'
import { CreateNode, TextPrompt } from '@/lib/types'
import { cn } from '@/lib/utils'
import { createNewTag } from '@/store/slices'

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

type TextPromptProps = {
  textPrompt: TextPrompt
}

const TextPromptItem: React.FC<TextPromptProps> = ({ textPrompt }) => {
  const dispatch = useAppDispatch()

  const { id, content } = textPrompt
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEditing, setEditing] = useState<boolean>(false)

  const handleItemClick = (name: string) => () => {
    switch (name) {
      case 'add-new-tag':
        dispatch(createNewTag(id))
        break
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        setEditing(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editorRef])

  return (
    <div className="flex gap-x-1">
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
      <div className="grow">
        <div
          ref={editorRef}
          className={cn(
            'grow px-1 py-0.5 whitespace-pre-wrap font-inter text-sm outline-none rounded my-auto',
            { 'bg-primary-200': isEditing }
          )}
          contentEditable={isEditing}
          onClick={() => setEditing(true)}
        >
          {content || 'Write something here'}
        </div>
      </div>
    </div>
  )
}

export default TextPromptItem
