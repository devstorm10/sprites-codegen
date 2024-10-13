import { IoCaretDown } from 'react-icons/io5'

import AutoComplete from '@/common/Autocomplete'
import TextPromptItem from './TextPromptItem'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { ContextNode, Tag } from '@/lib/types'
import { selectContext, updateContext } from '@/store/slices'

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

  const handleCompleteFocus = () => {
    dispatch(selectContext(tagContext.id))
  }

  const handleCompleteBlur = () => {
    dispatch(selectContext(null))
  }

  if (!prompts?.length) return <></>

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-1">
        <IoCaretDown className="mt-2.5 opacity-60" />
        <AutoComplete
          tagContextId={tagContext.id}
          hasFocus={selectedContextId === tagContext.id}
          suggestions={tags}
          onComplete={handleTagComplete}
          onFocus={handleCompleteFocus}
          onBlur={handleCompleteBlur}
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
