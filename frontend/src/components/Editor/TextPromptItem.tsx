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
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [isEditing, setEditing] = useState<boolean>(false)

  const handleItemClick = (name: string) => () => {
    switch (name) {
      case 'add-new-tag':
        dispatch(createNewTag(id))
        break
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto'
      editorRef.current.style.height = `${content ? editorRef.current.scrollHeight : 24}px`
    }
  }, [isEditing, content])

  return (
    <div className="flex gap-x-1">
      <div className="pt-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-4 w-4">
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
                <Icon icon="mage:stars-b" fontSize={18} />
                <span>{item.title}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className="pb-2 px-1 text-xs text-card-foreground">
              <p>Last edited by you</p>
              <p>Todat at 2:23 AM</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <pre
        className={cn(
          'grow px-1 py-0.5 whitespace-pre-wrap font-inter text-sm outline-none rounded',
          { 'bg-primary-200': isEditing }
        )}
        contentEditable={isEditing}
        onClick={() => setEditing(true)}
      >
        {content || 'Write something here'}
      </pre>
    </div>
  )
}

export default TextPromptItem
