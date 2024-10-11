import { useCallback } from 'react'

import EditableText from '@/common/EditableText'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { updateContext } from '@/store/slices'
import { CONTEXT_ICONS } from '@/lib/constants'
import { ContextNode } from '@/lib/types'

interface ContextGroupProps {
  context: ContextNode
  onUpdate: (id: string, newContext: Partial<ContextNode>) => void
}
const ContextGroup: React.FC<ContextGroupProps> = ({ context, onUpdate }) => {
  const { id, type, title, contexts } = context

  const handleUpdateTitle = useCallback(
    (newTitle: string) => {
      onUpdate(id, { title: newTitle })
    },
    [onUpdate]
  )

  return (
    <>
      <div
        id={id}
        key={id}
        className="cursor-pointer flex items-center gap-2 py-2 hover:bg-muted rounded-lg mb-1 px-2 transition-all"
      >
        {CONTEXT_ICONS[type]}{' '}
        <EditableText
          className="text-sm"
          text={title || ''}
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
