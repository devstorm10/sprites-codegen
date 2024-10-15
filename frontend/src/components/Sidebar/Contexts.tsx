import { useState, MouseEvent, useEffect, useMemo } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  closestCorners,
  defaultDropAnimation,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'

import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  selectContext,
  moveContext,
  findContextNodeById,
  createActiveTab,
  setActiveTab,
  searchContextsByKeyword,
} from '@/store/slices'
import { CONTEXT_ICONS } from '@/lib/constants'
import { ContextNode } from '@/lib/types'
import clsx from 'clsx'

interface ContextItemProps {
  context: ContextNode
  onItemClick?: () => void
}

interface ContextGroupProps {
  context: ContextNode
}

interface FilteredContextsProps {
  filter: string
  onFilterClear: () => void
}

const ContextGroup: React.FC<ContextGroupProps> = ({ context }) => {
  const { id, contexts } = context
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div ref={setNodeRef}>
      <ContextItem context={context} />
      <div className="ml-5">
        {contexts &&
          contexts.map((subContext, idx) => (
            <ContextGroup key={idx} context={subContext} />
          ))}
      </div>
    </div>
  )
}

const ContextItem: React.FC<ContextItemProps> = ({
  context,
  onItemClick = () => {},
}) => {
  const dispatch = useAppDispatch()
  const { id, type, title, data } = context
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const { attributes, listeners, setNodeRef } = useDraggable({ id })

  const handleContextSelect = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    dispatch(selectContext(id))
    onItemClick()
  }

  return (
    <div
      ref={setNodeRef}
      id={id}
      key={id}
      className={clsx(
        'cursor-pointer flex items-center gap-2 py-2 hover:bg-muted rounded-lg mb-1 px-2 transition-all line-clamp-1',
        {
          'bg-primary-200': selectedContextId === id,
        }
      )}
      onMouseDown={handleContextSelect}
      {...attributes}
      {...listeners}
    >
      <span className="shrink-0">{CONTEXT_ICONS[type]} </span>
      <p className="grow line-clamp-1 font-medium">
        {type === 'input' ? (data && data.content) || title || '' : title}
      </p>
    </div>
  )
}

const Contexts: React.FC = () => {
  const dispatch = useAppDispatch()
  const contexts = useAppSelector((state) => state.context.contexts)
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const defaultContextId = useAppSelector((state) => state.context.activeId)

  const [activeDndId, setActiveDndId] = useState<string>('')
  const activeContext = activeDndId
    ? findContextNodeById(contexts, activeDndId)
    : null

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  }

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

  useEffect(() => {
    if (selectedContextId) {
      const selectedContext = findContextNodeById(contexts, selectedContextId)
      if (selectedContext && selectedContext.type === 'flow') {
        dispatch(createActiveTab(selectedContextId))
      } else {
        dispatch(setActiveTab(defaultContextId || ''))
      }
    }
  }, [dispatch, selectedContextId, defaultContextId])

  return (
    <div className="px-3">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {contexts.map((context, idx) => (
          <ContextGroup key={idx} context={context} />
        ))}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeContext ? <ContextGroup context={activeContext} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

const FilteredContexts: React.FC<FilteredContextsProps> = ({
  filter,
  onFilterClear,
}) => {
  const defaultContextId = useAppSelector((state) => state.context.activeId)
  const defaultContext = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, defaultContextId || '')
  )
  const filteredContexts = useMemo(() => {
    if (!defaultContext || !defaultContext.contexts) return []
    return searchContextsByKeyword(defaultContext.contexts, filter)
  }, [defaultContext, filter])

  if (!defaultContext) return null
  return (
    <div className="px-3">
      <ContextItem context={defaultContext} />
      <div className="ml-5">
        {filteredContexts.map((context) => (
          <ContextItem
            key={context.id}
            context={context}
            onItemClick={onFilterClear}
          />
        ))}
      </div>
    </div>
  )
}

export { FilteredContexts }
export default Contexts
