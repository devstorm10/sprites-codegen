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
import { useAppDispatch, useAppSelector } from '@/store/store'
import { createNewTag, selectContext, updateContext } from '@/store/slices'
import { ContextNode, CreateNode } from '@/lib/types'
import { cn } from '@/lib/utils'

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
  textPrompt: ContextNode
}

const TextPromptItem: React.FC<TextPromptProps> = ({ textPrompt }) => {
  const dispatch = useAppDispatch()
  const selectedContextId = useAppSelector((state) => state.context.selectedId)

  const { id, data } = textPrompt
  const editorRef = useRef<HTMLPreElement>(null)
  const [isEditing, setEditing] = useState<boolean>(false)

  const handleItemClick = (name: string) => () => {
    switch (name) {
      case 'add-new-tag':
        dispatch(createNewTag(id))
        break
    }
  }

  const handleTextEdit = () => {
    setEditing(true)
    dispatch(selectContext(id))
  }

  useEffect(() => {
    if (id === selectedContextId) {
      setEditing(true)
      setTimeout(() => {
        editorRef.current?.focus()
      }, 0)
    } else {
      setEditing(false)
    }
  }, [id, selectedContextId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        if (isEditing) {
          setEditing(false)
          dispatch(selectContext(null))
          dispatch(
            updateContext({
              id,
              newContext: {
                data: { content: editorRef.current.innerText },
              },
            })
          )
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editorRef, isEditing])

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
        <pre
          ref={editorRef}
          className={cn(
            'grow px-1 py-0.5 whitespace-pre-wrap font-inter text-sm outline-none rounded my-auto',
            { 'bg-primary-200': isEditing }
          )}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onClick={handleTextEdit}
        >
          {(data && data.content) || (isEditing ? '' : 'Write something here')}
        </pre>
      </div>
    </div>
  )
}

export default TextPromptItem
