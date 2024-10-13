import { useMemo } from 'react'

import TextPromptItem from '@/components/Editor/TextPromptItem'
import GroupContainer from '@/components/Editor/GroupContainer'
import { useAppSelector } from '@/store/store'

const ContextViewer: React.FC = () => {
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const activeContext = useAppSelector((state) =>
    state.context.contexts.find((context) => context.id === activeContextId)
  )
  const tagContexts = useMemo(() => {
    if (!activeContext?.contexts) return []
    return activeContext.contexts?.filter((context) => context.type === 'tag')
  }, [activeContext])
  const noTagPrompts = useMemo(() => {
    if (!activeContext?.contexts) return []
    return activeContext.contexts?.filter((context) => context.type === 'input')
  }, [activeContext])

  return (
    <div className="flex flex-col gap-y-4">
      {tagContexts.map((context, idx) => (
        <GroupContainer key={idx} tagContext={context} />
      ))}
      {noTagPrompts.map((prompt, idx) => (
        <TextPromptItem key={idx} textPrompt={prompt} />
      ))}
    </div>
  )
}

export default ContextViewer
