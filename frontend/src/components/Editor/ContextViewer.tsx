import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  closestCorners,
  defaultDropAnimation,
} from '@dnd-kit/core'

import CreateButton from './CreateButton'
import GroupContainer from '@/components/Editor/GroupContainer'
import { useAppDispatch } from '@/store/store'
import { findContextNodeById, moveContext } from '@/store/slices'
import { ContextNode } from '@/lib/types'

interface ContextViewerProps {
  context: ContextNode
}

const ContextViewer: React.FC<ContextViewerProps> = ({ context }) => {
  const dispatch = useAppDispatch()
  const totalContexts = context.contexts || []

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

  const handleDragOver = ({ active, over }: DragEndEvent) => {
    const activeItem = findContextNodeById(totalContexts, active.id as string)
    const overItem = findContextNodeById(totalContexts, over?.id as string)
    if (!activeItem || !overItem || activeItem === overItem) return
    dispatch(moveContext({ source: activeItem.id, target: overItem.id }))
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeItem = findContextNodeById(totalContexts, active.id as string)
    const overItem = findContextNodeById(totalContexts, over?.id as string)
    if (!activeItem || !overItem || activeItem === overItem) return
    dispatch(moveContext({ source: activeItem.id, target: overItem.id }))
  }

  return (
    <div className="mt-[64px]">
      <CreateButton contextId={context.id} />
      <div className="mt-9 flex flex-col gap-y-4">
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
    </div>
  )
}

export default ContextViewer
