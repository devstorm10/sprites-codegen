import { IoCaretDown } from 'react-icons/io5'

import AutoComplete from '@/common/Autocomplete'
import TextPromptItem from './TextPromptItem'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { ContextNode } from '@/lib/types'
import { selectContext, updateContext } from '@/store/slices'
import { useCallback } from 'react'

interface GroupContainerProps {
  tagContext: ContextNode
}

const GroupContainer: React.FC<GroupContainerProps> = ({ tagContext }) => {
  const dispatch = useAppDispatch()
  const tags = useAppSelector((state) => state.context.tags)
  const selectedContextId = useAppSelector((state) => state.context.selectedId)

  const prompts = tagContext.contexts?.filter(
    (context) => context.type === 'input'
  )

  const handleTagTitle = useCallback(
    (title: string) => {
      dispatch(
        updateContext({
          id: tagContext.id,
          newContext: {
            title,
          },
        })
      )
    },
    [dispatch, tagContext.id]
  )

  const handleCompleteFocus = () => {
    dispatch(selectContext(tagContext.id))
  }

  if (!prompts?.length) return <></>

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-1">
        <IoCaretDown className="mt-2.5 opacity-60" />
        <AutoComplete
          tagContextId={tagContext.id}
          tagTitle={tagContext.title || ''}
          hasFocus={selectedContextId === tagContext.id}
          suggestions={tags}
          onTitleChange={handleTagTitle}
          onFocus={handleCompleteFocus}
        />
      </div>
      <div className="pl-2 flex flex-col gap-y-1">
        {prompts.map((prompt, idx) => (
          <TextPromptItem key={idx} textPrompt={prompt} />
        ))}
      </div>
    </div>
  )
}

export default GroupContainer
