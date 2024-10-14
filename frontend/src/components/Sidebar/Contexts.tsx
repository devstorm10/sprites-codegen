import { useCallback, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  closestCenter,
  defaultDropAnimation,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import EditableText from '@/common/EditableText'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  updateContext,
  selectContext,
  moveContext,
  findContextNodeById,
} from '@/store/slices'
import { CONTEXT_ICONS } from '@/lib/constants'
import { ContextNode } from '@/lib/types'
import clsx from 'clsx'

interface ContextItemProps {
  context: ContextNode
  onUpdate: (id: string, newContext: Partial<ContextNode>) => void
}

interface ContextGroupProps {
  context: ContextNode
  onUpdate: (id: string, newContext: Partial<ContextNode>) => void
}

const ContextGroup: React.FC<ContextGroupProps> = ({ context, onUpdate }) => {
  const { id, contexts } = context
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div ref={setNodeRef}>
      <ContextItem context={context} onUpdate={onUpdate} />
      <div className="ml-5">
        {contexts &&
          contexts.map((subContext, idx) => (
            <ContextGroup key={idx} context={subContext} onUpdate={onUpdate} />
          ))}
      </div>
    </div>
  )
}

const ContextItem: React.FC<ContextItemProps> = ({ context, onUpdate }) => {
  const dispatch = useAppDispatch()
  const { id, type, title, data } = context
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id })

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1,
  }

  const handleUpdateTitle = useCallback(
    (newTitle: string) => {
      onUpdate(id, { title: newTitle })
    },
    [onUpdate]
  )

  const handleContextSelect = () => {
    dispatch(selectContext(id))
  }

  return (
    <div
      ref={setNodeRef}
      id={id}
      key={id}
      style={itemStyle}
      className={clsx(
        'cursor-pointer flex items-center gap-2 py-2 hover:bg-muted rounded-lg mb-1 px-2 transition-all line-clamp-1',
        {
          'bg-primary-200': selectedContextId === id,
        }
      )}
      onClick={handleContextSelect}
      {...attributes}
      {...listeners}
    >
      <span className="shrink-0">{CONTEXT_ICONS[type]} </span>
      <EditableText
        className="grow text-sm"
        text={type === 'input' ? (data && data.content) || title || '' : title}
        onChange={handleUpdateTitle}
      />
    </div>
  )
}

const Contexts: React.FC = () => {
  const dispatch = useAppDispatch()
  const contexts = useAppSelector((state) => state.context.contexts)
  const [activeDndId, setActiveDndId] = useState<string>('')
  const activeContext = activeDndId
    ? findContextNodeById(contexts, activeDndId)
    : null

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  }

  const handleUpdateContext = useCallback(
    (id: string, newContext: Partial<ContextNode>) => {
      dispatch(updateContext({ id, newContext }))
    },
    []
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveDndId(active.id as string)
  }

  const handleDragOver = () => {}

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeItem = findContextNodeById(contexts, active.id as string)
    const overItem = findContextNodeById(contexts, over?.id as string)
    if (!activeItem || !overItem || activeItem === overItem) return
    dispatch(moveContext({ source: activeItem.id, target: overItem.id }))
  }

  return (
    <div className="px-3">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {contexts.map((context, idx) => (
          <ContextGroup
            key={idx}
            context={context}
            onUpdate={handleUpdateContext}
          />
        ))}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeContext ? (
            <ContextGroup
              context={activeContext}
              onUpdate={handleUpdateContext}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default Contexts
