import { useCallback } from 'react'
import { IoCaretDown } from 'react-icons/io5'

import AutoComplete from '@/common/Autocomplete'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { selectContext, updateContext } from '@/store/slices'
import { ContextNode } from '@/lib/types'

interface TagItemProps {
  context: ContextNode
}

const TagItem: React.FC<TagItemProps> = ({ context }) => {
  const dispatch = useAppDispatch()
  const tags = useAppSelector((state) => state.context.tags)
  const selectedContextId = useAppSelector((state) => state.context.selectedId)

  const handleTagTitle = useCallback(
    (title: string) => {
      dispatch(
        updateContext({
          id: context.id,
          newContext: {
            title,
          },
        })
      )
    },
    [dispatch, context.id]
  )

  const handleCompleteFocus = () => {
    dispatch(selectContext(context.id))
  }

  return (
    <div className="flex gap-x-1">
      <IoCaretDown className="mt-2.5 opacity-60" />
      <AutoComplete
        tagContextId={context.id}
        tagTitle={context.title || ''}
        hasFocus={selectedContextId === context.id}
        suggestions={tags}
        onTitleChange={handleTagTitle}
        onFocus={handleCompleteFocus}
      />
    </div>
  )
}

export default TagItem
