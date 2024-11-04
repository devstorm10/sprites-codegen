import { useState, MouseEvent, useMemo, useRef, useLayoutEffect } from 'react'
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
  searchContextsByKeyword,
  updateContext,
  deleteContext,
  findParentContextNodeById,
  closeTab,
} from '@/store/slices'
import { CONTEXT_ICONS } from '@/lib/constants'
import { ContextNode } from '@/lib/types'
import { cn, getAgentUrl } from '@/lib/utils'
import { useNavigate, useParams } from 'react-router-dom'
import EditPortal, { PortalPosition } from '@/common/EditPortal'
import { EditIcon } from '../icons/EditIcon'

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
  const { id, type, title, data } = context

  const { project_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const parentContext = useAppSelector((state) =>
    findParentContextNodeById(state.context.contexts, id)
  )
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const { attributes, listeners, setNodeRef } = useDraggable({ id })
  const isDragRef = useRef(false)

  const [isEditing, setEditing] = useState<boolean>(false)
  const [editingTitle, setEditingTitle] = useState<string>(title || '')
  const [inputPosition, setInputPosition] = useState<PortalPosition | null>(
    null
  )
  const titleRef = useRef<HTMLDivElement>(null)

  let clickTimeout: NodeJS.Timeout | null = null

  const handlePointerDown = (event: React.PointerEvent) => {
    event.stopPropagation()
    clickTimeout = setTimeout(() => {
      isDragRef.current && listeners?.onPointerDown(event)
    }, 100)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (event.buttons === 1) {
      isDragRef.current = true
    }
  }

  const handlePointerUp = (e: MouseEvent<HTMLDivElement>) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      clickTimeout = null
    }
    if (isDragRef.current === false) {
      handleContextSelect(e)
    } else if (isDragRef.current === true) {
      isDragRef.current = false
    }
  }

  const handleContextSelect = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (type === 'flow') {
      navigate(getAgentUrl(project_id || '', id))
    } else if (
      type === 'flow_node' &&
      parentContext &&
      parentContext.type === 'flow'
    ) {
      navigate(getAgentUrl(project_id || '', parentContext.id))
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
    if (context.id !== activeContextId) {
      dispatch(deleteContext(context.id))
      dispatch(closeTab(context.id))
    }
  }

  const handleTitleSave = () => {
    dispatch(
      updateContext({
        id,
        newContext: {
          ...context,
          title: editingTitle,
        },
      })
    )
    setEditing(false)
  }

  useLayoutEffect(() => {
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect()

      setInputPosition({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      })
    }
  }, [isEditing])

  return (
    <>
      <div
        ref={setNodeRef}
        id={id}
        key={id}
        className="flex items-center relative"
        {...attributes}
        onPointerDown={handlePointerDown}
        onMouseMove={handleMouseMove}
        onPointerUp={handlePointerUp}
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
          <div ref={titleRef} className="flex-1 flex items-center gap-x-2">
            <p className="grow line-clamp-1">
              {type === 'input' ? (data && data.content) || title || '' : title}
            </p>
            <div className="flex gap-x-2">
              <span
                className="hidden group-hover:flex items-center justify-center"
                onMouseDown={() => setEditing(true)}
              >
                <EditIcon />
              </span>
              <span
                className="hidden group-hover:flex items-center justify-center"
                onMouseDown={handleContextDelete}
              >
                <TrashIcon />
              </span>
            </div>
          </div>
        </div>
      </div>
      {isEditing && inputPosition && (
        <EditPortal
          text={editingTitle}
          position={inputPosition}
          handleSave={handleTitleSave}
          handleCancel={() => setEditing(false)}
          handleTextChange={setEditingTitle}
        />
      )}
    </>
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
