import { useCallback } from 'react'

import EditableText from '@/common/EditableText'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { updateContext, selectContext } from '@/store/slices'
import { CONTEXT_ICONS } from '@/lib/constants'
import { ContextNode } from '@/lib/types'
import clsx from 'clsx'

interface ContextGroupProps {
  context: ContextNode
  onUpdate: (id: string, newContext: Partial<ContextNode>) => void
}
const ContextGroup: React.FC<ContextGroupProps> = ({ context, onUpdate }) => {
  const dispatch = useAppDispatch()
  const { id, type, title, data, contexts } = context
  const selectedContextId = useAppSelector((state) => state.context.selectedId)

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
    <>
      <div
        id={id}
        key={id}
        className={clsx(
          'cursor-pointer flex items-center gap-2 py-2 hover:bg-muted rounded-lg mb-1 px-2 transition-all line-clamp-1',
          {
            'bg-primary-200': selectedContextId === id,
          }
        )}
        onClick={handleContextSelect}
      >
        <span className="shrink-0">{CONTEXT_ICONS[type]} </span>
        <EditableText
          className="grow text-sm"
          text={
            type === 'input' ? (data && data.content) || title || '' : title
          }
          onChange={handleUpdateTitle}
        />
      </div>
      <div className="ml-5">
        {contexts &&
          contexts.map((subContext, idx) => (
            <ContextGroup key={idx} context={subContext} onUpdate={onUpdate} />
          ))}
      </div>
    </>
  )
}

const Contexts: React.FC = () => {
  const dispatch = useAppDispatch()
  const contexts = useAppSelector((state) => state.context.contexts)

  const handleUpdateContext = useCallback(
    (id: string, newContext: Partial<ContextNode>) => {
      dispatch(updateContext({ id, newContext }))
    },
    []
  )

  return (
    <div className="px-3">
      {contexts.map((context, idx) => (
        <ContextGroup
          key={idx}
          context={context}
          onUpdate={handleUpdateContext}
        />
      ))}
    </div>
  )
}

export default Contexts
