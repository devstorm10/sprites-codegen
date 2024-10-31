import { useState, MouseEvent, useMemo } from 'react'
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  defaultDropAnimation,
  useDraggable,
  useDroppable,
  pointerWithin,
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
  searchContextsByKeyword,
  updateContext,
  deleteContext,
  findParentContextNodeById,
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
      <div className="flex">
        <div className="w-5" />
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
              className="grow"
            >
              {contexts.map((subContext, idx) => (
                <ContextGroup key={idx} context={subContext} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
  const parentContext = useAppSelector((state) =>
    findParentContextNodeById(state.context.contexts, id)
  )
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const { attributes, listeners, setNodeRef } = useDraggable({ id })

  const handleContextSelect = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (type === 'flow') {
      dispatch(createActiveTab({ id, title: title || 'New Flow' }))
    } else if (
      type === 'flow_node' &&
      parentContext &&
      parentContext.type === 'flow'
    ) {
      dispatch(
        createActiveTab({
          id: parentContext.id,
          title: parentContext.title || 'New Flow',
        })
      )
      dispatch(selectContext(id))
    } else {
      dispatch(selectContext(id))
    }
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
      className="flex items-center relative"
      onMouseDown={handleContextSelect}
      {...attributes}
      {...listeners}
    >
      {context.contexts && (
        <motion.span
          className="absolute -left-4 opacity-60 cursor-pointer"
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
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const activeContext = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, activeContextId || '')
  )
  const contexts = activeContext ? [activeContext] : []

  const [activeDndId, setActiveDndId] = useState<string>('')
  const activeDndContext = activeDndId
    ? findContextNodeById(contexts, activeDndId)
    : null

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveDndId(active.id as string)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const source = active.id as string
    const target = over?.id as string
    const sourceItem = findContextNodeById(contexts, source)
    const targetItem = findContextNodeById(contexts, target)
    if (!sourceItem || !targetItem || sourceItem === targetItem) return
    dispatch(moveContext({ source: sourceItem.id, target: targetItem.id }))
  }

  const handleDragEnd = () => {}

  return (
    <div className="flex-1 pl-5 pr-1 flex flex-col">
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {activeContext && <ContextGroup context={activeContext} grow={true} />}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDndContext ? (
            <ContextGroup context={activeDndContext} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

const FilteredContexts: React.FC<FilteredContextsProps> = ({
  filter,
  onFilterClear,
}) => {
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const activeContext = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, activeContextId || '')
  )
  const filteredContexts = useMemo(() => {
    if (!activeContext || !activeContext.contexts) return []
    return searchContextsByKeyword(activeContext.contexts, filter)
  }, [activeContext, filter])

  if (!activeContext) return null
  return (
    <div className="px-3">
      <ContextItem context={activeContext} />
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
