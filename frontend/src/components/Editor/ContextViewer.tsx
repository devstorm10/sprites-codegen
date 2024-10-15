import { useMemo, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  closestCorners,
  defaultDropAnimation,
} from '@dnd-kit/core'

import GroupContainer from '@/components/Editor/GroupContainer'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { findContextNodeById, moveContext } from '@/store/slices'

const ContextViewer: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const activeContext = useAppSelector((state) =>
    state.context.contexts.find((context) => context.id === activeContextId)
  )
  const totalContexts = useMemo(() => {
    if (!activeContext || !activeContext.contexts) return []
    return activeContext.contexts
  }, [activeContext])

  const [activeDndId, setActiveDndId] = useState<string>('')
  const activeDndContext = activeDndId
    ? findContextNodeById(totalContexts, activeDndId)
    : null

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveDndId(active.id as string)
  }

  const handleDragOver = () => {}

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeItem = findContextNodeById(totalContexts, active.id as string)
    const overItem = findContextNodeById(totalContexts, over?.id as string)
    if (!activeItem || !overItem || activeItem === overItem) return
    dispatch(moveContext({ source: activeItem.id, target: overItem.id }))
  }

  return (
    <div className="flex flex-col gap-y-4">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {totalContexts.map((context) => (
          <GroupContainer key={context.id} context={context} />
        ))}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDndContext ? (
            <GroupContainer context={activeDndContext} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default ContextViewer
