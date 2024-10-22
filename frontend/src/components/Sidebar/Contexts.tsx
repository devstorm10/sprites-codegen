import { useState, MouseEvent, useEffect, useMemo } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  closestCorners,
  defaultDropAnimation,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { AnimatePresence, motion } from 'framer-motion'
import { IoCaretDown, IoCaretForward } from 'react-icons/io5'

import { TrashIcon } from '@/components/icons/TrashIcon'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  selectContext,
  moveContext,
  findContextNodeById,
  createActiveTab,
  setActiveTab,
  searchContextsByKeyword,
  findParentContextNodeById,
  updateContext,
  deleteContext,
} from '@/store/slices'
import { CONTEXT_ICONS } from '@/lib/constants'
import { ContextNode } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ContextItemProps {
  context: ContextNode
  onItemClick?: () => void
}

interface ContextGroupProps {
  grow?: boolean
  context: ContextNode
}

interface FilteredContextsProps {
  filter: string
  onFilterClear: () => void
}

const ContextGroup: React.FC<ContextGroupProps> = ({
  grow = false,
  context,
}) => {
  const { id, collapsed, contexts } = context
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div ref={setNodeRef} className={cn({ 'flex-1': grow })}>
      <ContextItem context={context} />
      <AnimatePresence>
        {!collapsed && contexts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              height: 0,
              transformOrigin: 'top',
              transition: {
                opacity: { duration: 0.2 },
              },
            }}
            className="ml-5"
          >
            {contexts.map((subContext, idx) => (
              <ContextGroup key={idx} context={subContext} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ContextItem: React.FC<ContextItemProps> = ({
  context,
  onItemClick = () => {},
}) => {
  const dispatch = useAppDispatch()
  const { id, type, title, data } = context
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const { attributes, listeners, setNodeRef } = useDraggable({ id })

  const handleContextSelect = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    dispatch(selectContext(id))
    onItemClick()
  }

  const handleCollapseClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    dispatch(
      updateContext({
        id: context.id,
        newContext: {
          collapsed: !context.collapsed,
        },
      })
    )
  }

  const handleContextDelete = (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (context.id !== activeContextId) dispatch(deleteContext(context.id))
  }

  return (
    <div
      ref={setNodeRef}
      id={id}
      key={id}
      className="flex items-center gap-2"
      onMouseDown={handleContextSelect}
      {...attributes}
      {...listeners}
    >
      {context.contexts && (
        <motion.span
          className="opacity-60 cursor-pointer"
          onMouseDown={handleCollapseClick}
        >
          {context.collapsed ? <IoCaretForward /> : <IoCaretDown />}
        </motion.span>
      )}
      <div
        className={cn(
          'w-full mb-1 py-2 px-2 flex items-center gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer group',
          {
            'bg-primary-200': selectedContextId === id,
          }
        )}
      >
        <span className="shrink-0">{CONTEXT_ICONS[type]}</span>
        <p className="grow line-clamp-1">
          {type === 'input' ? (data && data.content) || title || '' : title}
        </p>
        <span
          className="hidden group-hover:flex items-center justify-center"
          onMouseDown={handleContextDelete}
        >
          <TrashIcon />
        </span>
      </div>
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

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeItem = findContextNodeById(contexts, active.id as string)
    const overItem = findContextNodeById(contexts, over?.id as string)
    if (!activeItem || !overItem || activeItem === overItem) return
    dispatch(moveContext({ source: activeItem.id, target: overItem.id }))
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeItem = findContextNodeById(contexts, active.id as string)
    const overItem = findContextNodeById(contexts, over?.id as string)
    if (!activeItem || !overItem || activeItem === overItem) return
    dispatch(moveContext({ source: activeItem.id, target: overItem.id }))
  }

  useEffect(() => {
    if (selectedContextId) {
      const selectedContext = findContextNodeById(contexts, selectedContextId)
      if (
        selectedContext &&
        (selectedContext.type === 'flow' ||
          selectedContext.type === 'flow_node')
      ) {
        const parentContext = findParentContextNodeById(
          contexts,
          selectedContextId
        )
        dispatch(
          createActiveTab(
            selectedContext.type === 'flow'
              ? selectedContextId
              : parentContext?.id || ''
          )
        )
      } else {
        dispatch(setActiveTab(defaultContextId || ''))
      }
    }
  }, [dispatch, selectedContextId, defaultContextId])

  return (
    <div className="flex-1 px-3 flex flex-col">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {contexts.map((context, idx) => (
          <ContextGroup
            key={idx}
            context={context}
            grow={idx === contexts.length - 1}
          />
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
      {
        <div className="ml-5">
          {filteredContexts.map((context) => (
            <ContextItem
              key={context.id}
              context={context}
              onItemClick={onFilterClear}
            />
          ))}
        </div>
      }
    </div>
  )
}

export { FilteredContexts }
export default Contexts
