import { useCallback } from 'react'
import { IoCaretDown } from 'react-icons/io5'

import AutoComplete from '@/common/Autocomplete'
import TextPromptItem from './TextPromptItem'
import FlowItem from './FlowItem'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { selectContext, updateContext } from '@/store/slices'
import { ContextNode } from '@/lib/types'

interface GroupContainerProps {
  tagContext: ContextNode
}

const GroupContainer: React.FC<GroupContainerProps> = ({ tagContext }) => {
  const dispatch = useAppDispatch()
  const tags = useAppSelector((state) => state.context.tags)
  const selectedContextId = useAppSelector((state) => state.context.selectedId)

  const contexts = tagContext.contexts || []

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

  if (contexts.length === 0) return null

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
        {contexts.map((context) =>
          context.type === 'input' ? (
            <TextPromptItem key={context.id} textPrompt={context} />
          ) : context.type === 'flow' ? (
            <FlowItem key={context.id} context={context} />
          ) : (
            <></>
          )
        )}
      </div>
    </div>
  )
}

export default GroupContainer
