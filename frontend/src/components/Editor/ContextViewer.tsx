import { useMemo } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { IoCaretDown } from 'react-icons/io5'

import TextPromptItem from '@/components/Editor/TextPromptItem'
import AutoComplete from '@/components/Autocomplete'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { ContextNode, Tag } from '@/lib/types'
import { updateContext } from '@/store/slices'

interface TagContextProps {
  tagContext: ContextNode
}

const TagContext: React.FC<TagContextProps> = ({ tagContext }) => {
  const dispatch = useAppDispatch()
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const totalTags = useAppSelector((state) => state.context.tags)
  const textPrompts = useAppSelector((state) =>
    state.context.textPrompts.filter(
      (prompt) => prompt.contextId === activeContextId
    )
  )

  const tag = totalTags.find((tag) => tag.title === tagContext?.title)
  const prompts = tagContext?.contexts
    ?.filter((context) => context.type === 'input')
    .map((context) => textPrompts.find((prompt) => prompt.id === context.id))
    .filter((prompt) => !!prompt)

  const handleTagComplete = (item: Tag) => {
    dispatch(
      updateContext({
        id: tagContext.id,
        newContext: {
          title: item.title,
        },
      })
    )
  }

  if (!prompts?.length) return <></>

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-2">
        {tag ? (
          <div className="flex items-center gap-x-2">
            <FaChevronDown className="text-text-200" />
            <span className="rounded-full py-1 px-4 bg-primary-200 text-sm font-medium">
              {tag.title}
            </span>
          </div>
        ) : (
          <div className="flex gap-x-2.5">
            <IoCaretDown className="mt-2.5" />
            <AutoComplete
              suggestions={totalTags}
              onComplete={handleTagComplete}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-y-1">
        {prompts.map((prompt) => (
          <TextPromptItem textPrompt={prompt} />
        ))}
      </div>
    </div>
  )
}

const ContextViewer: React.FC = () => {
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const activeContext = useAppSelector((state) =>
    state.context.contexts.find((context) => context.id === activeContextId)
  )
  const textPrompts = useAppSelector((state) =>
    state.context.textPrompts.filter(
      (prompt) => prompt.contextId === activeContextId
    )
  )
  const tagContexts = useMemo(() => {
    if (!activeContext?.contexts) return []
    return activeContext.contexts?.filter((context) => context.type === 'tag')
  }, [activeContext])
  const noTagPrompts = useMemo(() => {
    if (!activeContext?.contexts) return []
    return activeContext.contexts
      ?.filter((context) => context.type === 'input')
      .map((context) => textPrompts.find((prompt) => prompt.id === context.id))
      .filter((prompt) => !!prompt)
  }, [activeContext, textPrompts])

  return (
    <div className="flex flex-col gap-y-2.5">
      {tagContexts.map((context) => (
        <TagContext tagContext={context} />
      ))}
      {noTagPrompts.map((prompt) => (
        <TextPromptItem textPrompt={prompt} />
      ))}
    </div>
  )
}

export default ContextViewer
