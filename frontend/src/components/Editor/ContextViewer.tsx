import React, { PropsWithChildren, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  rectIntersection,
  defaultDropAnimation,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core'

import CreateButton from './CreateButton'
import GroupContainer from '@/components/Editor/GroupContainer'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { findContextNodeById, moveContext } from '@/store/slices'
import { ContextNode } from '@/lib/types'

interface ContextViewerProps {
  context: ContextNode
  isOnPromptbar?: boolean
}

interface ContextDropProps {
  className?: string
}

const ContextDrop: React.FC<PropsWithChildren & ContextDropProps> = ({
  children,
  className = '',
}) => {
  const activeContextId = useAppSelector(
    (state) => state.context.activeId || ''
  )
  const { setNodeRef } = useDroppable({ id: activeContextId })

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  )
}

const ContextViewer: React.FC<ContextViewerProps> = ({
  context,
  isOnPromptbar = false,
}) => {
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

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const source = active.id as string
    const target = over?.id as string
    const sourceItem = findContextNodeById([context], source)
    const targetItem = findContextNodeById([context], target)
    if (!sourceItem || !targetItem || sourceItem === targetItem) return
    dispatch(moveContext({ source: sourceItem.id, target: targetItem.id }))
  }

  const handleDragEnd = () => {}

  return (
    <div className="mt-[64px]">
      <CreateButton contextId={context.id} />
      <DndContext
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ContextDrop className="mt-9 pb-10 flex flex-col gap-y-2">
          {totalContexts.map((context) => (
            <GroupContainer
              key={context.id}
              context={context}
              isOnPromptbar={isOnPromptbar}
            />
          ))}
          <DragOverlay dropAnimation={dropAnimation}>
            {activeDndContext ? (
              <GroupContainer context={activeDndContext} />
            ) : null}
          </DragOverlay>
        </ContextDrop>
      </DndContext>
    </div>
  )
}

export default ContextViewer
