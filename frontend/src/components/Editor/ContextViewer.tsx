import { useMemo } from 'react'

import TextPromptItem from '@/components/Editor/TextPromptItem'
import FlowItem from './FlowItem'
import GroupContainer from '@/components/Editor/GroupContainer'
import { useAppSelector } from '@/store/store'

const ContextViewer: React.FC = () => {
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const activeContext = useAppSelector((state) =>
    state.context.contexts.find((context) => context.id === activeContextId)
  )
  const totalContexts = useMemo(() => {
    if (!activeContext || !activeContext.contexts) return []
    return activeContext.contexts
  }, [activeContext])

  return (
    <div className="flex flex-col gap-y-4">
      {totalContexts.map((context) =>
        context.type === 'input' ? (
          <TextPromptItem key={context.id} textPrompt={context} />
        ) : context.type === 'flow' ? (
          <FlowItem key={context.id} context={context} />
        ) : (
          <GroupContainer key={context.id} tagContext={context} />
        )
      )}
    </div>
  )
}

export default ContextViewer
